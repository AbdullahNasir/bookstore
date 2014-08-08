'use strict';

angular.module('bookStoreApp')
  .factory('publishers', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
       Properties:{
      name:''
        },

      addPublisher:function(callback){
            $http.post('/api/addPublisher',this.Properties).success(callback);
        },
        getPublisher:function(callback){
            $http.get('/api/getPublishers').success(callback);
        },
        updatePublisher:function(id,callback){
            console.log('Publisher ID : ' + id);
            $http.post('/api/updatePublisher/'+id,this.Properties).success(callback);
        },
        deletePublisher:function(id,callback){
            console.log('Publisher ID :'+id);
            $http.post('/api/deletePublisherAPI/'+id).success(callback);
        }
    };
  });
