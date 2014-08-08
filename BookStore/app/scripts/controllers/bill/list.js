'use strict';

angular.module('bookStoreApp')
  .controller('BillListCtrl', function ($scope,billFactory ) {

        billFactory.getList(function(response){
            $scope.bills = response;
            console.log(response);
        })
  });
