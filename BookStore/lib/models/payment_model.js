
var autoIncrement = require('mongoose-auto-increment')

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// Schema
var PaymentSchema = new Schema({
    voucher_no:Number,
    date: { type: Date, default: Date.now },
    customer: {type:mongoose.Schema.Types.ObjectId,ref:'customers'},
    type:Number,
    amount:Number

});

PaymentSchema.plugin(autoIncrement.plugin,{model:'payments',field:'voucher_no'});


payment_model = mongoose.model('payments', PaymentSchema);

exports.save = function(payment,callback){
    console.log(payment);
    payment = new payment_model(payment);
    payment.save(function(err){
        console.log(err);
        if(!err){
            payment.nextCount(callback);
        }
    })
}

exports.get = function(id,callback){
    payment_model.find({_id:id}).populate('customer').exec(callback);
}

exports.update = function(id,payment,callback){
    payment_model.update({_id:id},{$set:payment},callback);
}

exports.delete = function(id,callback){
    payment_model.remove({_id:id},callback);
}

exports.list = function (filterObj,take,skip, callback) {
    payment_model.find(filterObj).limit(take).skip(skip).populate('customer').exec(callback);
}

exports.count = function (filterObj, callback) {
    payment_model.count(filterObj).exec(callback);
}