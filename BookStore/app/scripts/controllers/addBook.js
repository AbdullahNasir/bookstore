'use strict';

angular.module('bookStoreApp')
    .controller('AddbookCtrl', function ($scope,books,publishers,$location) {

        publishers.getPublisher(function(publishers){
            $scope.Publishers = publishers;
        })

        $scope.Book = books;
        $scope.Book.Properties = {};
        $scope.save = function()
        {
            if (validate()) {
                $scope.Book.add(function(data,status,headers,config){
                                console.log(data+' '+status)
                                $location.path("/Books")

                            })

            }

            
        }

        function validate() {
           
            if ($scope.Book.Properties.bookName.trim() == '') {
                alert('کتاب کا نام لکھئیے');
                return false;
            }
            
            if ($scope.Book.Properties.Publisher == undefined) {
                alert('پبلیشر سلیکٹ کریں');
                return false;
            }

            return true;

        }


    });
