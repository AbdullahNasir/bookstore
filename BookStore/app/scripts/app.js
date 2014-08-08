'use strict';

angular.module('bookStoreApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  "angucomplete"
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/Books.html',
        controller: 'ListbooksCtrl'
      })
      .when('/Books', {
        templateUrl: 'views/Books.html',
        controller: 'ListbooksCtrl'
      })
      .when('/addBook', {
        templateUrl: 'views/addBook.html',
        controller: 'AddbookCtrl'
      })
      .when('/editBook/:bookId', {
        templateUrl: 'views/addBook.html',
        controller: 'EditbookBookidCtrl'
      })
      .when('/customers', {
        templateUrl: 'views/customers.html',
        controller: 'CustomersCtrl'
      })
      .when('/NewSet', {
        templateUrl: 'views/NewSet.html',
        controller: 'NewsetCtrl'
      })
      .when('/sets', {
        templateUrl: 'views/sets.html',
        controller: 'SetsCtrl'
      })
      .when('/editSet/:id', {
        templateUrl: 'views/NewSet.html',
        controller: 'EditsetCtrl'
      })
      .when('/NewBill', {
        templateUrl: 'views/NewBill.html',
        controller: 'NewbillCtrl'
      })
      .when('/bill/edit/:id', {
        templateUrl: 'views/NewBill.html',
        controller: 'BillEditCtrl'
      })
      .when('/bill/purchase/new', {
        templateUrl: 'views/NewBill.html',
        controller: 'BillPurchaseNewCtrl'
      })
      .when('/bill/purchase/edit/:id', {
        templateUrl: 'views/NewBill.html',
        controller: 'BillPurchaseEditCtrl'
      })
      .when('/bill/list', {
        templateUrl: 'views/bill_list.html',
        controller: 'BillListCtrl'
      })
      .when('/bill/purchase/list', {
        templateUrl: 'views/bill_purchase_list.html',
        controller: 'BillPurchaseListCtrl'
      })
      .when('/payments/new', {
        templateUrl: 'views/payments/new.html',
        controller: 'PaymentsNewCtrl'
      })
      .when('/payments/list', {
        templateUrl: 'views/payments/list.html',
        controller: 'PaymentsListCtrl'
      })
      .when('/payments/edit/:id', {
        templateUrl: 'views/payments/new.html',
        controller: 'PaymentsEditCtrl'
      })
      
      .when('/partyledger', {
        templateUrl: 'views/partyledger.html',
        controller: 'PartyledgerCtrl'
      })
      .when('/publishers', {
        templateUrl: 'views/publishers.html',
        controller: 'PublishersCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
