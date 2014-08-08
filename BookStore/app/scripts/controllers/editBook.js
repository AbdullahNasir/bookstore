'use strict';

angular.module('bookStoreApp')
  .controller('EditbookBookidCtrl', function ($scope,$routeParams,books,publishers,$location) {

        var bookId = $routeParams.bookId;

        $scope.isDeleteable = true;

        books.getOne(bookId,function(bookObj){

            books.Properties = bookObj

            delete books.Properties._id;

            $scope.Book = books;

            publishers.getPublisher(function(publishers){

                $scope.Publishers = publishers;

                var index = publishers.map(function(e) { return e._id; }).indexOf($scope.Book.Properties.Publisher._id);

                $scope.Book.Properties.Publisher = publishers[index];

            })

        })



        $scope.save = function(){

            if (validate()) {
                    $scope.Book.update(bookId,function(book){
                                    console.log('saved ' +book);
                                    $location.path("/Books");
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


        $scope.delete = function(){
            if (confirm("کیا آپ واقعی اس کتاب کو ڈیلیٹ کرنا چاہتے ہیں ؟")){
            $scope.Book.delete(bookId,function(res){
                console.log(res);
                $location.path("/Books");
            })
            }
        }
  });
