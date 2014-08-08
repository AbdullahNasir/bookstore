/**
 * Created with JetBrains PhpStorm.
 * User: Abdullah
 * Date: 1/11/14
 * Time: 8:55 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');

var Customer_Schema = new mongoose.Schema({
    name:String,
    opening_balance:Number,
    current_balance:Number
});

customer_model = mongoose.model('customers',Customer_Schema);

exports.saveCustomer = function(customer,callback){
    customer.current_balance = customer.opening_balance;
    customer = new customer_model(customer);
    customer.save(callback);
}

exports.delete = function(customerId,callback){
    customer_model.remove({_id:customerId},callback);
}

exports.get = function(callback){
    customer_model.find(callback);
}

function getOne(customer_id,callback){
    customer_model.find({_id:customer_id},callback)
}

exports.updateBalance = function(customer_id,balance,callback){
    customer_model.findOne({_id:customer_id},function(err,doc){
        doc.current_balance = doc.current_balance + balance;
        doc.save(callback);
    });
}

exports.update = function(id,customer,callback){

    getOne(id,function(err,existing_customer){

        existing_customer = existing_customer[0];

       //console.log("new:")
        //console.log(customer);
        //console.log("Existing");
        //console.log(existing_customer);

        if (existing_customer.opening_balance > customer.opening_balance){
            //customer's opening balance reduced
            //console.log('difference: '+existing_customer.opening_balance - customer.opening_balance);
            customer.current_balance -= (existing_customer.opening_balance - customer.opening_balance);
            //console.log('new balance: '+customer.current_balance);
        }

        else if (existing_customer.opening_balance < customer.opening_balance){
            customer.current_balance += (customer.opening_balance - existing_customer.opening_balance );

        }

        console.log("Updated customer:");
        //console.log(customer);

        if (customer._id != undefined){
            delete customer._id;
        }

        customer_model.update({_id:id},{$set:customer},callback);

    });

}