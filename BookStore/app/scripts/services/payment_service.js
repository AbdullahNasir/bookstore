'use strict';

angular.module('bookStoreApp')
  .factory('paymentService', function ($http) {


    return {

        properties:{

        },
        savePayment:function(callback){
            $http.post('/api/payments/new',this.properties).success(callback);
        },
        getPayment:function(id,callback){
            $http.get('/api/payments/get/'+id).success(callback);
        },
        updatePayment:function(id,callback){
            $http.post('/api/payments/edit/'+id,this.properties).success(callback);
        },
        delete:function(id,callback){
            $http.get('/api/payments/delete/'+id).success(callback);
        }

    };
  });
