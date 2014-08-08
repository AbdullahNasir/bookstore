'use strict';

angular.module('bookStoreApp')
  .controller('SetsCtrl', function ($scope, setFactory) {
        console.log('sending request');
        setFactory.getList(function(Data){
            $scope.sets = Data;
            console.log(Data);
        })
  });
