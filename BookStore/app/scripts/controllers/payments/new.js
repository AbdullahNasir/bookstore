'use strict';

angular.module('bookStoreApp')
  .controller('PaymentsNewCtrl', function ($scope, customerFactory,paymentService) {
        customerFactory.getCustomers(function(response){
            $scope.customers = response;
        });

        $scope.isDeleteable = false;

        $scope.payment = new Object();

        $scope.savePayment = function () {

            if (confirm("محفوظ کر دیا جائے ؟")) {

                paymentService.properties = $scope.payment;

                paymentService.savePayment(function (response) {

                    if (response.success) {
                        if (response.success) {
                            alert('محفوظ ہو گیا ہے. ');
                            window.location = "#/payments/list";
                        }
                        else {
                            alert('معذرت محفوظ نہیں ہو سکا');
                        }
                    }
                });
            }
        }

        $scope.cancelPayment = function () {

        }
  });
