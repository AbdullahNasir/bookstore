'use strict';

// Module dependencies.
var express = require('express'),
    path = require('path'),
    fs = require('fs');

var app = express();

// Connect to database
var db = require('./lib/db/mongo');

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

// Populate empty DB with dummy data
require('./lib/db/dummydata');

// Controllers
var api = require('./lib/controllers/api');
var customer_controller = require('./lib/controllers/customers');
var set_controller = require('./lib/controllers/setCtrl');
var bill_controller = require('./lib/controllers/billCtrl');
var purchase_bill_controller = require('./lib/controllers/purchase_bill_ctrl')
var payment_controller = require('./lib/controllers/payment_controller');
// Express Configuration
app.configure(function(){
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});

app.configure('development', function(){
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
});

app.configure('production', function(){
  app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));
});

// Routes
app.get('/api/awesomeThings', api.awesomeThings);
app.get('/api/getBooks',api.getBooks);
app.get('/api/getPublishers',api.getPublishers);
app.get('/api/books/:bookId',api.getOneBook);
app.get("/api/customers",customer_controller.getCustomer);
app.get('/api/sets/get',set_controller.getList);
app.get('/api/sets/get/:id',set_controller.getOne);
app.get('/api/bill/get/:id',bill_controller.getOne);
app.get('/api/getBooks/complete',api.getBooksAndSets);
app.get('/api/bill/delete/:id',bill_controller.deleteBill);
app.get('/api/bill/purchase/get/:id',purchase_bill_controller.getOne);
app.get('/api/bill/purchase/delete/:id',purchase_bill_controller.deleteBill);
app.get('/api/bills/list',bill_controller.getList);
app.get('/api/bill/purchase/list',purchase_bill_controller.getList);
app.get('/api/payments/get/:id',payment_controller.getDetail);
app.get('/api/payments/delete/:id',payment_controller.deletePayment);

app.post('/api/addBook',api.addBook);
app.post('/api/addPublisher',api.addPublisher);
app.post('/api/updateBook/:bookId',api.updateBook);
app.post('/api/deleteBook/:bookId',api.deleteBook);
app.post('/api/updatePublisher/:publisherId',api.updatePublisher);
app.post('/api/deletePublisherAPI/:publisherId',api.deletePublisherAPI);
app.post('/api/customers/add',customer_controller.saveCustomer);
app.post('/api/customers/update/:id',customer_controller.updateCustomer);
app.post('/api/customer/delete/:id',customer_controller.deleteCustomer);
app.post('/api/sets/add',set_controller.saveSet);
app.post('/api/sets/update/:id',set_controller.update);
app.post('/api/bills/new',bill_controller.saveBill);
app.post('/api/bills/update/:id',bill_controller.updateBill);
app.post('/api/bills/purchase/new',purchase_bill_controller.save);
app.post('/api/bills/purchase/update/:id',purchase_bill_controller.updateBill);
app.post('/api/payments/new',payment_controller.savePayments);
app.post('/api/Books/getFilteredBooks', api.getFilteredBooks);
app.post('/api/payments/edit/:id',payment_controller.editPayment);
app.post('/api/bills/filteredList', bill_controller.getFilteredList);
app.post('/api/bill/purchase/filteredList', purchase_bill_controller.getFilteredList);
app.post('/api/payments/filteredList', payment_controller.getFilteredList);

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});