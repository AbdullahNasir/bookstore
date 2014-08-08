'use strict';

angular.module('bookStoreApp')
  .controller('NewsetCtrl', function ($scope,books,setFactory) {

        books.getBooks(function(Data){
            $scope.universalSet = Data;

        })

        $scope.set = setFactory.Properties;

        $scope.selectedTemp = [];

        $scope.selected = [];

        $scope.moveBooks = function(){
            for(var i=0;i<$scope.selectedTemp.length;i++){
                $scope.selected.push($scope.selectedTemp[i]);
                var index = $scope.universalSet.indexOf($scope.selectedTemp[i])
                $scope.universalSet.splice(index,1);
            }
        }

        $scope.removeBook = function(index,obj){
            $scope.selected.splice(index,1);
            $scope.universalSet.push(obj);
        }

        $scope.save = function(){

            $scope.set.set_books = [];

            for(var i=0;i<$scope.selected.length;i++){

                $scope.set.set_books.push($scope.selected[i]._id);
            }

            setFactory.save(function(response){
                console.log(response);
            })
        }

        $scope.back = function(){
            window.history.back();
        }

  });
