'use strict';

angular.module('bookStoreApp')
  .factory('billFactory', function ($http) {
    // Service logic
    // ...

        var Bill;

    // Public API here
    return {
      saveBill: function (callback) {
            $http.post("/api/bills/new/",this.Bill).success(callback);
      },
        getOneBill: function(id,callback){
            $http.get('/api/bill/get/'+id).success(callback);
        },
        updateBill:function(id,callback){
            console.log('calling api');
            $http.post('/api/bills/update/'+id,this.Bill).success(callback);

        },
        getList:function(callback){
            $http.get('/api/bills/list').success(callback);
        },
        deleteBill:function(id,callback){
            $http.get('/api/bill/delete/'+id).success(callback);
        },
        newPurchaseBill:function(callback){
            $http.post('/api/bills/purchase/new',this,Bill).success(callback);
        },
        getOnePurchaseBill:function(id,callback){
            $http.get('/api/bill/purchase/get/'+id).success(callback);
        },
        updatePurchaseBill:function(id,callback){
            $http.post('/api/bills/purchase/update/'+id,this.Bill).success(callback);
        },
        deletePurchaseBill:function(id,callback){
            $http.get('/api/bill/purchase/delete/'+id).success(callback);

        },
        getPurchaseBillList:function(callback){
            $http.get('/api/bill/purchase/list').success(callback);
        }
    };
  });
