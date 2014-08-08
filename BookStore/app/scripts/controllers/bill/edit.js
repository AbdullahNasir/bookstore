'use strict';

angular.module('bookStoreApp')
    .controller('BillEditCtrl', function ($scope,customerFactory,publishers,books,setFactory,billFactory,$routeParams) {

        $scope.Bill = {};
        $scope.Bill.bill_no = '';
        $scope.Bill.customer = {};
        $scope.Bill.mode = '';
        $scope.Bill.date = new Date();
        $scope.Bill.billItems = [];
        $scope.Bill.amountPaid = 0;
        $scope.Bill.balance= '';
        $scope.Bill.grand_total = 0;
        $scope.Math = window.Math;
        $scope.tempItem = {};
        var Books = [];
        $scope.SelectedBooks = [];

        customerFactory.getCustomers(function(Data){
            $scope.customers = Data;
        });

        publishers.getPublisher(function(Data){
            $scope.publishers = Data;
        });

        books.getBooksAndSets(function(Data){

            console.log(Data);
            $scope.Books = Data;
        });

        billFactory.getOneBill($routeParams.id,function(Data){
            console.log(Data[0]);
            $scope.Bill = Data[0];
            //$scope.Bill.date = $scope.Bill.date.substring(0, 10);
        });

        $scope.addBillItemToBill = function(){

            $scope.Bill.billItems.push({
                Price:$scope.tempItem.book.originalObject.Price,
                Discount:$scope.tempItem.book.originalObject.Discount,
                book:$scope.tempItem.book.originalObject,
                Qty:$scope.tempItem.Qty

            });
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


        $scope.saveBill = function(){

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
                    $scope.Bill.balance = 0;

                }

                billFactory.Bill = $scope.Bill;
                billFactory.updateBill($routeParams.id,function(response){
                console.log(response);

                })
            }


        }

        $scope.deleteBill = function(){
            if (confirm("کیا آپ واقعی یہ بل  ڈیلیٹ  کرنا چاہتے ہیں ؟"))
                billFactory.deleteBill($routeParams.id,function(response){
                    if(response.success){
                        alert('بل ڈیلیٹ ہو گیا ہے');
                        window.location = "#/bill/purchase/list";
                    }
                    else{
                        alert("معذرت بل ڈیلیٹ نہیں ہو سکا");
                    }
                });
        }

        $scope.print = function(){
            window.print();
        }
    });
