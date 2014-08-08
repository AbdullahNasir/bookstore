'use strict';

angular.module('bookStoreApp')
  .factory('books', function ($http) {

    return {

        Properties:{

        bookName: '',
        Writer: '',
        Publisher: undefined,
        Price:0,
        Discount:0,
        costDiscount:0,
        Qty: 0,
        sNo:'0'
        },

      getBooks: function (callback) {
            $http.get('/api/getBooks').success(callback);
      },
        getOne:function(id,callback){
            $http.get('/api/books/'+id).success(callback);
        }
        ,
        add: function (callback) {
            console.log(this.Properties);
            $http.post('/api/addBook',this.Properties).success(callback);
        }
        ,
        update:function(id,callback){
            $http.post('/api/updateBook/'+id,this.Properties).success(callback);
        },
        delete:function(id,callback){
            $http.post('/api/deleteBook/'+id).success(callback);
        },
        getBooksAndSets:function(callback){
            $http.get('/api/getBooks/complete').success(callback);
        }
    };
  });
