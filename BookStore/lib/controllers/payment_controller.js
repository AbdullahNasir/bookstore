/**
 * Created with JetBrains PhpStorm.
 * User: Abdullah
 * Date: 3/5/14
 * Time: 1:34 AM
 * To change this template use File | Settings | File Templates.
 */

var payments = require('../models/payment_model');
var customer_model = require('../models/customers');

exports.savePayments = function(req,res){
    console.log('payments req received');
    console.log(req.body);
    var customer = JSON.parse(JSON.stringify(req.body.customer));
    console.log('payments customer');
    console.log(customer);
    req.body.customer = req.body.customer._id;
    console.log('customer id '+ req.body.customer);
       payments.save(req.body,function(err,billNo){
            if(!err){
                console.log('payment saved successfully');
                console.log(billNo);
                console.log('type: '+req.body.type);
                if(req.body.type==1){
                    //wasoli
                    customer.balance = req.body.amount * (-1);
                    console.log('amount: '+customer.balance);
                }
                else{
                    customer.balance = req.body.amount;
                    console.log('amount: '+customer.balance);
                }

                customer_model.updateBalance(req.body.customer,customer.balance,function(err){
                    if(!err){
                        res.send({success:true});
                    }
                    else{
                        res.send({success:false,reason:err});
                    }
                });


            }
           else{
                console.log(err);
            }
       })
}

exports.getDetail = function(req,res){
    payments.get(req.params.id,function(err,payment){
        if(!err){
            res.send(payment);
        }else{
            res.send(err);
        }
    })
}

exports.editPayment = function(req,res){
    var customer = JSON.parse(JSON.stringify(req.body.customer));
    req.body.customer = req.body.customer._id;
    console.log(req.body.customer);
    delete req.body._id;

    payments.update(req.params.id,req.body,function(err){
        if(!err){
            payments.get(req.params.id,function(err,previousPayment){
                    if(!err){
                        if(previousPayment.type==1){
                            //wasoli
                            customer.balance = previousPayment.amount;
                            console.log('amount: '+customer.balance);
                        }
                        else{
                            customer.balance = previousPayment.amount * (-1);
                            console.log('amount: '+customer.balance);
                        }

                        customer_model.updateBalance(req.body.customer,customer.balance,function(err){
                            if(!err){

                        console.log('type: '+req.body.type);
                        if(req.body.type==1){
                            //wasoli
                            customer.balance = req.body.amount;
                            console.log('amount: '+customer.balance);
                        }
                        else{
                            customer.balance = req.body.amount * (-1);
                            console.log('amount: '+customer.balance);
                        }

                        customer_model.updateBalance(req.body.customer,customer.balance,function(err){
                            if(!err){
                                res.send({success:true});
                            }
                            else{
                                res.send({success:false,reason:err});
                            }
                        });
                            }

                    });
            }

        else{
            console.log(err);
        }
            })
    }
    });
}


exports.getFilteredList = function (req, res) {

    var filterObj = {};

    if (req.body.customer.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        filterObj.customer = req.body.customer;
    }

    if (req.body.startDate != "" || req.body.endDate != "") {
        filterObj.date = {};

    }

    if (req.body.startDate != "") {
        filterObj.date['$gte'] = new Date(req.body.startDate);
    }

    if (req.body.type != "") {
        filterObj.type = req.body.type;
    }

    if (req.body.endDate != "") {
        filterObj.date['$lte'] = new Date(req.body.endDate);
    }

    payments.list(filterObj, req.body.take, req.body.skip, function (err, Payments) {
        if (!err) {
            var result = {};
            result.data = Payments;
            payments.count(filterObj, function (err, count) {
                if (!err) {
                    result.count = count;
                    res.json(result);
                }
                else {
                    res.send(err);
                }
            });
        }
        else {
            res.send(err);
        }
    });
}


exports.deletePayment = function(req,res){

    payments.get(req.params.id,function(err,previousPayment){
        if(!err){
            previousPayment = previousPayment[0];
            var customer = previousPayment.customer;
            console.log(customer);
            payments.delete(req.params.id,function(err){
                if(!err){
                    console.log('payment deleted successfully');
                    console.log('type: '+req.body.type);
                    if(previousPayment.type==1){
                        //wasoli
                        customer.balance = previousPayment.amount;
                        console.log('amount: '+customer.balance);
                    }
                    else{
                        customer.balance = req.body.amount * (-1);
                        console.log('amount: '+customer.balance);
                    }

                    customer_model.updateBalance(customer._id,customer.balance,function(err){
                        if(!err){
                            res.send({success:true});
                        }
                        else{
                            res.send({success:false,reason:err});
                        }
                    });


                }
                else{
                    console.log(err);
                }
            })
        }
    })


}

