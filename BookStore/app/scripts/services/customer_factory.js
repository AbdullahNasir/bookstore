'use strict';

angular.module('bookStoreApp')
  .factory('customerFactory', function ($http) {



    return {

        properties:{
            name:'',
            opening_balance:'',
            current_balance:''
        },

      getCustomers:function(callback){
          $http.get('/api/customers').success(callback);
      },
      saveCustomer:function(callback){
          $http.post('/api/customers/add',this.properties).success(callback);
      },
      updateCustomer:function(id,callback){
          $http.post('/api/customers/update/'+id,this.properties).success(callback);
      },
        deleteCustomer:function(id,callback){
            $http.post('/api/customer/delete/'+id).success(callback);
        }



    };
  });
