/**
 * Created with JetBrains PhpStorm.
 * User: Abdullah
 * Date: 2/9/14
 * Time: 9:45 PM
 * To change this template use File | Settings | File Templates.
 */
var bills = require('../models/purchase_bill_model');
var customers = require('../models/customers');
var mongoose = require('mongoose');
Books = mongoose.model('Books');

function updateBookQty(id,Qty,mode){
    if(mode == 'decrease'){
        Qty*=-1;
    }
    console.log('finding book :' + id);
    Books.findOne({_id:id}, function(err,doc){


            console.log('previous qty: '+doc.Qty);
            doc.Qty+=Qty;
            console.log('updated qty: '+doc.Qty);
            doc.save(function(){});

        }
    );
}

function updateInventory(billItems,mode){

    for (var i=0;i<billItems.length;i++){
        var item = billItems[i];
        console.log('item :' + item.book.type);
        if(item.book.type=="book"){

            var id = item.book._id;
            var Qty = item.Qty;
            updateBookQty(id,Qty,mode);
        }

        else if(item.book.type=="set") {
            console.log('book length: '+item.book.set_books.length);
            for(var j=0;j<item.book.set_books.length;j++){
                console.log('book id:' + item.book.set_books[j]);
                var id = item.book.set_books[j]._id;
                console.log('calling update book method on : '+id);
                updateBookQty(id,item.Qty,mode);
            }
        }

    }
}


exports.save = function(req,res){


    console.log(req.body);

    req.body = req.body.Bill;


    //req.body.billItems.splice(req.body.billItems.length,1);

    var Bill = JSON.parse(JSON.stringify(req.body));

    Bill.customer = req.body.customer._id;

    console.log('checking reference: ' + req.body.customer);

    for (var i=0;i<Bill.billItems.length;i++){

        Bill.billItems[i].book = Bill.billItems[i].book._id;

    }

    console.log('saving bill: '+JSON.stringify(Bill));

    bills.save(Bill,function(err,billNo){
        if (!err){
            //Decrease Customer's Balance
            customers.updateBalance(req.body.customer._id,-1*req.body.balance,function(){});
           //Increase Inventory
            updateInventory(req.body.billItems,'increase');

            return res.send({success:true,billNo:billNo-1});

        }
    });
}

exports.getOne = function(req,res){
    console.log('Request Received in purchase_bill_controller')
    bills.get(req.params.id,function(err,bill){

        if(!err){
            res.json(bill);
        }
        else{
            res.send(err);
        }

    });
}



exports.updateBill = function(req,res){



    var previousBill;

    console.log('request received');
    console.log('bill no :'+req.params.id);

    bills.get(req.params.id,function(err,bill){
        console.log('response received');
        previousBill = JSON.parse(JSON.stringify(bill[0]));
        //updateCustomerBalance(previousBill.customer,previousBill);
        customers.updateBalance(previousBill.customer._id,previousBill.balance,function(){});

        updateInventory(previousBill.billItems,'decrease');
        var Bill = JSON.parse(JSON.stringify(req.body));
        Bill.customer = Bill.customer._id;
        delete Bill._id;

        for (var i=0;i<Bill.billItems.length;i++){

            Bill.billItems[i].book = Bill.billItems[i].book._id;

        }
        bills.update(req.params.id,Bill,function(err){
            if(err){
                console.log('error: ' + err);
            }
            else{
            customers.updateBalance(req.body.customer._id,-1*req.body.balance,function(){});

            //Updating Inventory
            console.log('billitem length: ' + req.body.billItems.length);
            updateInventory(req.body.billItems,'increase');
                return res.send({success:true});
            }


        });


    });


}

exports.deleteBill = function(req,res){

    //Get Previous bill
    var previousBill;

    console.log('request received for deleting bill');
    console.log('bill no :'+req.params.id);

    bills.get(req.params.id,function(err,bill){
        console.log('response received');
        console.log(bill);
        previousBill = JSON.parse(JSON.stringify(bill[0]));
        console.log(previousBill);
        //Increase Customer's balance
        customers.updateBalance(previousBill.customer._id,previousBill.balance,function(){});
        //Decrease Inventory
        updateInventory(previousBill.billItems,'decrease');
        bills.delete(previousBill._id,function(err){
            if (!err){
                res.json({success:true});
            }
            else{
                res.json(err);
            }
        })
    });


    //Delete Bill
}

exports.getList = function(req,res){
    console.log('req received');
    bills.list(function(err,response){
        if (!err){
            res.json(response);
        }
        else{
            res.send(err);
            console.log(err);
        }
    })
}

exports.getFilteredList = function (req, res) {
    console.log('req received');
    console.log(req.body);

    var filterObj = {};

    if (req.body.customer.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        filterObj.customer = req.body.customer;
    }

    if (req.body.startDate != "" || req.body.endDate != "") {
        filterObj.date = {};

    }

    if (req.body.bill_no != "") {
        filterObj.bill_no = req.body.bill_no;
    }

    if (req.body.startDate != "") {
        filterObj.date['$gte'] = new Date(req.body.startDate);
    }

    if (req.body.endDate != "") {
        filterObj.date['$lte'] = new Date(req.body.endDate);
    }

    //filterObj.date = { $gte: new Date(req.body.startDate), $lte: new Date(req.body.endDate) };



    bills.filteredList(filterObj, req.body.take, req.body.skip, function (err, billsArr) {
        console.log('response');
        if (!err) {
            var result = {};
            result.data = billsArr;

            bills.filteredListCount(filterObj, function (err, count) {

                if (err) {
                    console.log(err);
                }

                result.count = count;
                return res.json(result);
            });


        }
        else {
            res.send(err);
        }
    })
}