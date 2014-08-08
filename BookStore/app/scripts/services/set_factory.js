'use strict';

angular.module('bookStoreApp')
  .factory('setFactory', function ($http) {


    return {

        Properties:{},

        save: function (callback) {
        $http.post('/api/sets/add',this.Properties).success(callback);
      },
        getList:function(callback){
            $http.get('/api/sets/get').success(callback);
        },
        getOne:function(id,callback){
            $http.get('/api/sets/get/'+id).success(callback);
        },
        update:function(id,callback){
            $http.post('/api/sets/update/'+id,this.Properties).success(callback);
        }


    };
  });
