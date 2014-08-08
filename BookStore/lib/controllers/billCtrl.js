
var bills = require('../models/bills');
var customers = require('../models/customers');
var mongoose = require('mongoose');
Books = mongoose.model('Books');

exports.getList = function(req,res){
    console.log('req received');
    bills.list(function(err,bills){
        console.log('response');
        if(!err){
            res.json(bills);
        }
        else{
            res.send(err);
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
    
    

    bills.filteredList(filterObj,req.body.take,req.body.skip,function (err, billsArr) {
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

exports.getOne = function(req,res){

    console.log('req received in bill Controller')

    bills.get(req.params.id,function(err,bill){

        if(!err){
            console.log(bill);
            res.json(bill);
        }
        else{
            res.send(err);
        }

    });
}

function updateCustomerBalance (customer,bill){
    customer.current_balance = customer.current_balance - bill.balance;
    var id = customer._id;
    _customer = JSON.parse(JSON.stringify(customer));
    delete _customer._id;


    customers.update(id,_customer,function(){
    });
}

function updateInventory(bill){
    console.log('update inventory called');

    for (var i=0;i<bill.billItems.length;i++){
        console.log('first loop');
        var item = bill.billItems[i];

        if(item.book.type=="book"){

            var id = item.book._id;
            var Qty = item.Qty;
            console.log('calling update inventory on: ' + id);
            updateBookQty(id,-Qty);
        }

        else if(item.book.type=="set") {
            for(var j=0;j<item.book.set_books.length;j++){
                var id = item.book.set_books[j];
                console.log('calling update inventory on: ' + id);
                updateBookQty(id,-item.Qty);
            }
        }
    }

}

function deleteBill(bill,callback){
    bills.delete(bill._id,callback);
}

exports.updateBill = function(req,res){

    //req.body.billItems.splice(req.body.billItems.length-1,1);


    var previousBill;

    console.log('request received');
    console.log('bill no :'+req.params.id);

 bills.get(req.params.id,function(err,bill){
        console.log('response received');
        previousBill = JSON.parse(JSON.stringify(bill[0]));
        updateCustomerBalance(previousBill.customer,previousBill);

        updateInventory(previousBill);
        var Bill = JSON.parse(JSON.stringify(req.body));
        Bill.customer = Bill.customer._id;
        delete Bill._id;

     for (var i=0;i<Bill.billItems.length;i++){

         Bill.billItems[i].book = Bill.billItems[i].book._id;

     }
        bills.update(req.params.id,Bill,function(err){
            customers.updateBalance(req.body.customer._id,req.body.balance,function(){});

            //Updating Inventory
            console.log('billitem length: ' + req.body.billItems.length);
            for (var i=0;i<req.body.billItems.length;i++){
                var item = req.body.billItems[i];
                console.log('item :' + item.book.type);
                if(item.book.type=="book"){

                    var id = item.book._id;
                    var Qty = item.Qty;
                    updateBookQty(id,Qty);
                }

                else if(item.book.type=="set") {
                    console.log('book length: '+item.book.set_books.length);
                    for(var j=0;j<item.book.set_books.length;j++){
                        console.log('book id:' + item.book.set_books[j]);
                        var id = item.book.set_books[j];
                        console.log('calling update book method on : '+id);
                        updateBookQty(id,item.Qty);
                    }
                }

            if (!err){
                res.send({result:'success'});
            }
            else{
                console.log(err);
                res.send(err);
            }
            }
        });


    });

}

exports.deleteBill = function(req,res){

    bills.get(req.params.id,function(err,bill){
        console.log('bill: ' + bill[0]._id);
        console.log(err);
        updateCustomerBalance(bill[0].customer,bill[0]);
        updateInventory(bill[0]);
        deleteBill(bill[0],function(err){
            if (!err){
                res.send({success:true});
            }
        });
    })
}

function updateBookQty(id,Qty){
console.log(id);
    console.log('finding book :' + id);
    Books.findOne({_id:id}, function(err,doc){
            if(!err){


            var wait=true;
            console.log('previous qty: '+doc.Qty);
            doc.Qty-=Qty;
            console.log('updated qty: '+doc.Qty);
            doc.save(function(){});
            }
            else{
                console.log('error occured in updateBookQty');
                console.log(err);
            }

        }
    );
}

exports.saveBill = function(req,res){


        //req.body.billItems.splice(req.body.billItems.length-1,1);

        var Bill = JSON.parse(JSON.stringify(req.body));

        Bill.customer = req.body.customer._id;

        console.log('checking reference: ' + req.body.customer);

        for (var i=0;i<Bill.billItems.length;i++){

            Bill.billItems[i].book = Bill.billItems[i].book._id;

        }

        bills.save(Bill,function(err,billNo){

        //Updating Inventory

        for (var i=0;i<req.body.billItems.length;i++){
            var item = req.body.billItems[i];

            if(item.book.type=="book"){

                var id = item.book._id;
                var Qty = item.Qty;
                updateBookQty(id,Qty);
            }

            else if(item.book.type=="set") {
                for(var j=0;j<item.book.set_books.length;j++){
                    var book = item.book.set_books[j];
                    var id = book._id;
                   updateBookQty(id,item.Qty);
                }
            }
        }

        //Updating Customer Balance if there is balance amount

        if (req.body.balance != 0){
            req.body.customer.current_balance +=req.body.balance;
            customers.update(req.body.customer._id,req.body.customer,function(err,response){
                if (!err){
                    console.log(billNo);
                   return res.send({success:true,billNo:billNo-1});

                }

            })
        }

        else{
                console.log('returning');
                return res.send({result:'success',billNo:billNo-1});

        }





    });
    }



