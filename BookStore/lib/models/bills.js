
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment')

var book_schema = {
    type:String,
    books:[Number]
}

var Bill_Items = {
    publisher:{type:mongoose.Schema.Types.ObjectId,ref:'publisher'},
    book:{type:mongoose.Schema.Types.ObjectId,ref:'Books'},
    Qty:Number,
    Price:Number,
    Discount:Number

}

var Bill_Schema = new mongoose.Schema({
    bill_no:Number,
    customer:{type:mongoose.Schema.Types.ObjectId,ref:'customers'},
    date: { type: Date, default: Date.now },
    mode:String,
    billItems:[Bill_Items],
    grand_total:Number,
    amountPaid:Number,
    balance:Number

});

autoIncrement.initialize(mongoose.connection)

Bill_Schema.plugin(autoIncrement.plugin,{model:'bills',field:'bill_no'});

bill_model = mongoose.model('bills',Bill_Schema);

exports.save = function(bill,callback){
    bill = new bill_model(bill);
    bill.save(function(err){
        bill.nextCount(callback);
    });
}

exports.update = function(id,bill,callback){
    console.log(bill);
    console.log(id);
    bill_model.update({bill_no:id},{$set:bill},callback);
}

exports.get = function(id,callback){
    console.log('req received in bills model');
    bill_model.find({bill_no:id}).populate('customer')
        .populate('billItems.book')
        .exec(callback);
}

exports.delete = function(id,callback){
    bill_model.remove({_id:id},callback);
}

exports.list = function(callback){
    bill_model.find({}).populate('customer').exec(callback);
}

exports.filteredList = function (filterObj,take,skip,callback) {
    bill_model.find(filterObj).limit(take).skip(skip).populate('customer').exec(callback);
}

exports.filteredListCount = function (filterObj, callback) {
    bill_model.count(filterObj, callback);
}