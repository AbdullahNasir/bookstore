'use strict';

angular.module('bookStoreApp')
  .controller('BillPurchaseListCtrl', function ($scope,billFactory) {
        billFactory.getPurchaseBillList(function(Data){
            $scope.bills = Data;
        })
  });
