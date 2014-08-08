var mongoose = require('mongoose');

var Set_Schema = new mongoose.Schema({
    name:String,
    books:[{type:mongoose.Schema.Types.ObjectId,ref:'Books'}]
});

set_model = mongoose.model('sets',Set_Schema);

exports.save = function(set,callback){
    set = new set_model(set);
    set.save(callback);
}

exports.getList = function(callback){
    set_model.find().populate('books').exec(callback);
}

exports.get = function(id,callback){
    set_model.find({_id:id}).populate('books').exec(callback);
}

exports.update = function(id,set,callback){
    set_model.update({_id:id},{$set:set},callback);
}