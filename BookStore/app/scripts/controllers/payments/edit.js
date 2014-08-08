'use strict';

angular.module('bookStoreApp')
  .controller('PaymentsEditCtrl', function ($scope, customerFactory,paymentService,$routeParams) {
        customerFactory.getCustomers(function(response){
            $scope.customers = response;
        });

        $scope.isDeleteable = true;

        paymentService.getPayment($routeParams.id,function(response){
            console.log(response[0])
            $scope.payment = response[0];
            $scope.payment.date = $scope.payment.date.substring(0, 10)
            $scope.payment.customer = response[0].customer;
        })

        $scope.payment = new Object();

        $scope.savePayment = function () {
            if (confirm("محفوظ کر دیا جائے ؟")) {

                paymentService.properties = $scope.payment;
                console.log(paymentService.properties);

                paymentService.updatePayment($routeParams.id, function (response) {
                    if (response.success) {
                        if (response.success) {
                            alert('محفوظ ہو گیا ہے. ');
                            window.location = "#/payments/list";
                        }
                        else {
                            alert('معذرت محفوظ نہیں ہو سکا');
                        }
                    }
                    console.log(response);
                });
            }
        }

        $scope.deletePayment = function () {

            if (confirm("کیا آپ واقعی یہ پیمنٹ ڈیلیٹ  کرنا چاہتے ہیں ؟")) {

                paymentService.delete($routeParams.id, function (response) {
                    if (response.success) {
                        alert('پیمنٹ ڈیلیٹ ہو گیی ہے');
                        window.location = "#/payments/list";
                    }
                    else {
                        alert("معذرت پیمنٹ ڈیلیٹ نہیں ہو سکی");
                    }
                })
            }
        }
  });
