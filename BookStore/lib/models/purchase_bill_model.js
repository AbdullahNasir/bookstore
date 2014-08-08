var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment')



var purchase_Bill_Items = {
    publisher:{type:mongoose.Schema.Types.ObjectId,ref:'publisher'},
    book:{type:mongoose.Schema.Types.ObjectId,ref:'Books'},
    Qty:Number,
    Price:Number,
    Discount:Number

}

var purchase_Bill_Schema = new mongoose.Schema({
    bill_no:Number,
    customer:{type:mongoose.Schema.Types.ObjectId,ref:'customers'},
    date: { type: Date, default: Date.now },
    mode:String,
    billItems:[purchase_Bill_Items],
    grand_total:Number,
    amountPaid:Number,
    balance:Number

});

//autoIncrement.initialize(mongoose.connection);

purchase_Bill_Schema.plugin(autoIncrement.plugin,{model:'purchasebills',field:'bill_no'});

purchase_bill_model = mongoose.model('purchasebills',purchase_Bill_Schema);

exports.save = function(bill,callback){
    console.log('req received in bill_model' + bill.customer);
    bill = new purchase_bill_model(bill);
    bill.save(function(err){
        bill.nextCount(callback);
    });
}

exports.get = function(id,callback){
    purchase_bill_model.find({bill_no:id}).populate('customer')
        .populate('billItems.book')
        .exec(callback);
}

exports.update = function(id,bill,callback){

    console.log(bill);
    console.log(id);
    purchase_bill_model.update({bill_no:id},{$set:bill},callback);
}

exports.delete = function(id,callback){
    purchase_bill_model.remove({_id:id},callback);
}

exports.list = function(callback){
    purchase_bill_model.find({}).populate('customer').exec(callback);
}

exports.filteredList = function (filterObj, take, skip, callback) {
    purchase_bill_model.find(filterObj).limit(take).skip(skip).populate('customer').exec(callback);
}

exports.filteredListCount = function (filterObj, callback) {
    purchase_bill_model.count(filterObj, callback);
}