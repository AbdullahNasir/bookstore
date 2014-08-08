'use strict';

angular.module('bookStoreApp')
  .controller('NewbillCtrl', function ($scope,customerFactory,publishers,books,setFactory,billFactory) {

        $scope.Bill = {};
        $scope.showDelete = false;
        $scope.Bill.bill_no = '';
        $scope.Bill.customer = {};
        $scope.Bill.mode = '';
        $scope.Bill.date = new Date();
        $scope.Bill.billItems = [];
        $scope.Bill.amountPaid = 0;
        $scope.Bill.balance= '';
        $scope.Bill.grand_total = 0;
        $scope.tempItem = {};
        $scope.Math = window.Math;
        newRow();
        var Books = [];
        $scope.SelectedBooks = [];

        customerFactory.getCustomers(function(Data){
            $scope.customers = Data;
            $scope.Bill.customer = $scope.customers[0];

        });

        publishers.getPublisher(function(Data){
            $scope.publishers = Data;
        });

        books.getBooksAndSets(function(Data){

            console.log(Data);
            $scope.Books = Data;
        });


        $scope.addBillItemToBill = function(){

            $scope.Bill.billItems.push({
                Price:$scope.tempItem.book.originalObject.Price,
                Discount:$scope.tempItem.book.originalObject.Discount,
                book:$scope.tempItem.book.originalObject,
                Qty:$scope.tempItem.Qty

            })
            angular.element('#ex1_value').select();
            angular.element('#ex1_value').val('');
            newRow();
        }

        function newRow(){
            $scope.tempItem = {Qty:1,Price:'',Discount:''};

        }

        $scope.bookChanged = function(index){

            $scope.Bill.billItems[index].Price = $scope.Bill.billItems[index].book.Price;
            $scope.Bill.billItems[index].Discount = $scope.Bill.billItems[index].book.Discount;

            $scope.SelectedBooks[index] = new Object();

            if ($scope.Bill.billItems[index].book.type=='book'){
              $scope.SelectedBooks[index].publisher = $scope.Bill.billItems[index].book.Publisher;
              $scope.SelectedBooks[index].writer = $scope.Bill.billItems[index].book.Writer;
            }else{
                $scope.SelectedBooks[index].publisher = $scope.Bill.billItems[index].book.set_books[0].Publisher;
                $scope.SelectedBooks[index].writer = $scope.Bill.billItems[index].book.set_books[0].Writer;

            }

            if (index == $scope.Bill.billItems.length - 1)
                newRow();
        }

        $scope.grandTotal = function(){

            var Total = 0;

            angular.forEach($scope.Bill.billItems,function(billitem){
                Total+= billitem.Qty * Math.round((billitem.Price - (billitem.Price * (billitem.Discount/100))))

            });

            return Total;
        }

        $scope.balance = function(){
            return $scope.grandTotal() - $scope.Bill.amountPaid;

        }

        $scope.removeItem = function(index){

                $scope.Bill.billItems.splice(index,1);
        }

        $scope.paidAmountChanged = function(){
        }

        function validate() {
            if ($scope.Bill.customer == undefined) {
                alert('کسٹمر سلیکٹ کریں');
                return false;
            }

            if ($scope.Bill.mode == '' || $scope.Bill.mode == undefined) {
                alert('بل کا طریقہ کار سلیکٹ کریں');
                return false;
            }

            if ($scope.Bill.billItems.length == 0) {
                alert('بل میں کوئی کتاب موجود نہیں ہے');
                return false;
            }

            return true;
        }

        $scope.saveBill = function () {

            if (!validate()) {
                return false;
            }

            if (confirm("محفوظ کر دیا جائے ؟")){


            console.log($scope.Bill);
            if ($scope.Bill.mode == "Cash"){
                $scope.Bill.grand_total = $scope.grandTotal();
                $scope.Bill.balance = $scope.balance();

            }
            else {
                $scope.Bill.grand_total = $scope.grandTotal();
                $scope.Bill.balance = $scope.Bill.grand_total;

            }

            billFactory.Bill = $scope.Bill;
            billFactory.saveBill(function(response){

                $scope.Bill.bill_no = response.billNo;

                if(response.success){
                    alert('بل محفوظ ہو گیا ہے. بل نمبر ہے'+response.billNo);
                    window.location = "#/bill/edit/"+response.billNo;
                }
                else{
                    alert('معذرت بل محفوظ نہیں ہو سکا');
                }
            })
          }
        }

  });
