'use strict';

angular.module('bookStoreApp')
  .controller('PublishersCtrl', function ($scope, publishers) {

      $scope.viewState = 'List';

      var callback = function (publisherObjects) {

          $scope.Publishers = publisherObjects;

      }

      publishers.getPublisher(callback);

      $scope.Publisher = publishers;

      $scope.save = function () {

          if (publishers.Properties.name.trim() == '') {
              alert('پبلیشر کا نام لکھیں');
              return false;
          }

          publishers.addPublisher(function (publisherObj) {
              publishers.Properties.name = '';
              publishers.getPublisher(callback)


          });
      }

      $scope.showDetails = function (publisherObj) {
          $scope.selectedPublisher = publisherObj;
          $scope.viewState = 'Detail';
      }

      $scope.showList = function () {
          $scope.selectedPublisher = null;
          $scope.viewState = 'List';
      }

      $scope.update = function () {
          console.log($scope.selectedPublisher);
          var pubId = $scope.selectedPublisher._id;
          publishers.Properties = $scope.selectedPublisher;
          delete publishers.Properties._id;
          publishers.updatePublisher(pubId, function (publisherObj) {
              publishers.getPublisher(callback);
          })
          $scope.showList();
      }

      $scope.delete = function () {
          console.log($scope.selectedPublisher);
          publishers.deletePublisher($scope.selectedPublisher._id, function (response) {
              console.log(response);
              publishers.getPublisher(callback);
          });
          $scope.showList();
      }

  });
