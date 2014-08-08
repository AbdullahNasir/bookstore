'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// Schema
var BookSchema = new Schema({
    bookName: String,
    Writer: String,
    Publisher: {},
    Price:Number,
    Discount:Number,
    costDiscount:Number,
    Qty:Number,
    type: String,
    sNo:String,
    set_books:[{type:mongoose.Schema.Types.ObjectId,ref:'Books'}]

});



mongoose.model('Books', BookSchema);
