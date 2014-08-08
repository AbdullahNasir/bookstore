/**
 * Created with JetBrains PhpStorm.
 * User: Abdullah
 * Date: 1/11/14
 * Time: 9:28 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var sets = mongoose.model('Books');

exports.saveSet = function(req,res){

    req.body.type = "set";
    var book = new Books(req.body);
    return book.save(function(err,book){
        if (err){
            console.log(err);
            return res.send(err);
        }
        else{
            return res.json(book);
        }
    });
}

exports.getList = function(req,res){

    console.log('req received')

    sets.find({type:"set"}).populate('set_books').exec(function(err,sets){
        console.log(sets);

        if (!err){
            res.json(sets);
        }
        else{
            res.send(err);
        }
    })
}

exports.getOne = function(req,res){

    sets.find({_id:req.params.id}).populate('set_books').exec(function(err,set){
        if (!err){
            console.log(set);
            res.json(set);
        }
        else{
            res.send(err);
        }
    })
}

exports.update = function(req,res){
    console.log('update request received -- Sets');
    console.log(req.body);
    sets.update({_id:req.params.id},{$set:req.body},function(err){
        if (!err){
            res.send({status:"success"});
        }else{
            res.send(err);
        }
    })
}

