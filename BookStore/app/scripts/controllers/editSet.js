'use strict';

angular.module('bookStoreApp')
  .controller('EditsetCtrl', function ($scope, $routeParams,setFactory,books) {

        var Set;
        $scope.universalSet = [];
        $scope.selectedTemp = [];
        $scope.selected = [];


        setFactory.getOne($routeParams.id,function(response){
            Set = response[0];
            console.log(Set);

            books.getBooks(function(response){
                $scope.universalSet = response;
                populateFields();
            })

        });



        function populateFields(){

            setFactory.Properties = Set;
            $scope.set = setFactory.Properties;
            console.log(Set.set_books);

            for(var i=0;i<Set.set_books.length;i++){
                var index = $scope.universalSet.map(function(obj){return obj._id}).indexOf(Set.set_books[i]._id);
                $scope.universalSet.splice(index,1);
            }

            $scope.selected = Set.set_books;

        }

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

            delete setFactory.Properties._id;

            setFactory.update($routeParams.id,function(response){
                console.log(response);
            });
        }

        $scope.back = function(){
            window.history.back();
        }

  });
