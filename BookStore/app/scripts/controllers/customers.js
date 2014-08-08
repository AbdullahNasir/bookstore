'use strict';

angular.module('bookStoreApp')
  .controller('CustomersCtrl', function ($scope, $http,customerFactory) {

       $scope.getCustomers = function(){customerFactory.getCustomers(function(custs){
            console.log(custs);
               $scope.customers= custs;
            });
       };

        $scope.getCustomers();


        $scope.mode = 'new';

        $scope.customer = customerFactory.properties;

        $scope.refresh = function(){

            $scope.customer = new Object();
            $scope.customer.name = '';
            $scope.customer.opening_balance = 0;
          $scope.mode = 'new';

        }

        function validate() {
            
            if ($scope.customer.name.trim() == '') {
                alert('کسٹمر کا نام لکھیں');
                return false;
            }
            
            if (isNaN($scope.customer.opening_balance)) {
                alert('اوپننگ بیلنس صحیح ڈالیں');
                return false;
            }

            return true;
        }

        $scope.save = function(){

            if (!validate()) {
                return false;
            }

            console.log('save called');

            if($scope.mode == 'new'){
                customerFactory.properties = $scope.customer;
                customerFactory.saveCustomer(function(err){
                    console.log(err);
                    $scope.getCustomers();

                })
            }

            else{
                customerFactory.properties = $scope.customer;
                var id = $scope.customer._id;
                delete customerFactory.properties._id;
                customerFactory.updateCustomer(id,function(response){
                    $scope.getCustomers();

                });
            }
        }

        $scope.update = function(customer){

            $scope.mode='edit';

            $scope.customer = customer;

        }

        $scope.delete = function(){

            if (confirm("کیا آپ واقعی اس کسٹمر کو ڈیلیٹ کرنا چاہتے ہیں ؟")){

                customerFactory.deleteCustomer($scope.customer._id,function(response){
                    console.log(response);
                    $scope.getCustomers();

                });
            }
        }


        $scope.formatNumber = function (number) {
            if (number < 0) {
            
                number *= -1
                return "(" + number + ")";
            }
            else {
                
                return number;
            }
        }

        $scope.formatColor = function (number) {
            if (number < 0) {

                return 'red';
            }
            else {

                return '';
            }
        }

    }
  );


