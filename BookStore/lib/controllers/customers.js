/**
 * Created with JetBrains PhpStorm.
 * User: Abdullah
 * Date: 1/11/14
 * Time: 9:28 PM
 * To change this template use File | Settings | File Templates.
 */

var customers = require('../models/customers');

exports.saveCustomer = function(req,res){
    console.log(req.body);
    customers.saveCustomer(req.body,function(err){
        res.send(err);
    })
}

exports.getCustomer = function(req,res){

    console.log('getCustomer');

    customers.get(function(err,customers){

        if (!err){
            return res.json(customers);
        }
        else{
            return res.send(err);
        }
    });
}

exports.updateCustomer = function(req,res){

    customers.update(req.params.id,req.body,function(err){
        if(!err){
            res.send({status:'success'});
        }
        else{
            res.send(err);
        }
    })
}

exports.deleteCustomer = function(req,res){

    customers.delete(req.params.id,function(err){

        if(!err){
            res.send({status:'success'});
        }
        else{
            res.send(err);
        }

    });

}