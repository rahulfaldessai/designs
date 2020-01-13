var app = angular.module('myModule', ['uiSlider', 'ngCookies']);
// app.filter('nfcurrency', ['$filter', '$locale', function ($filter, $locale) {

//     var currency = $filter('currency'),
//         formats = $locale.NUMBER_FORMATS;

//     return function (amount, symbol) {
//         var value = currency(amount, symbol);
//         return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '');
//     };
// }]);
app.controller('mycontroller', ['$scope', '$http', '$cookies', '$cookieStore', function($scope, $http, $cookies, $cookieStore) {

    var url = "https://api.myjson.com/bins/qzuzi";
    $http.get(url).success(function (response) {
        $scope.items = response;
//         $scope.items.forEach(function (item) {
// 			item.Quantity = 0
// 		 });
    });

    $scope.sortlimit = "-price";
    $scope.reverseSort = false;

    $scope.searchData = {}
    $scope.searchDataBy = '$'


    $scope.lower_price_bound = 100;
  $scope.upper_price_bound = 10000;

  $scope.priceRange = function(lower_price_bound, upper_price_bound) {
    return (parseInt(lower_price_bound) >= $scope.lower_price_bound && parseInt(upper_price_bound) <= $scope.upper_price_bound);
//alert(lower_price_bound + " | " + upper_price_bound);
  };


  this.tab = 1;
  this.selectTab = function(setTab){
    this.tab = setTab;
  }
  this.isSelected = function(checkTab){
    return this.tab === checkTab;
  } 

  $scope.cart =[];
  $scope.total = 0;
  $scope.discountValue = 0;     
  $scope.totalItems = 0;
  /*
    if ($cookieStore.get('cart') !== null) {
             $scope.cart =  $cookieStore.get('cart');
    }
    */
    
    if(!angular.isUndefined($cookies['total'])){
      $scope.total = parseFloat($cookies['total']);
    }

    if (!angular.isUndefined($cookies['cart'])) {
             $scope.cart =  $cookieStore.get('cart');
    }
     if(!angular.isUndefined($cookies['discount'])){
         $scope.discountValue = parseFloat($cookies['discount']);
       }

      if (!angular.isUndefined($cookies['totalItems'])) {
        $scope.totalItems =  $cookieStore.get('totalItems');
}
    
    $scope.addItemToCart = function(item){
        
        //item.Quantity +=1
         if ($scope.cart.length === 0){
              $scope.cart.TotalCartQuantity=0;
            item.count = 1;
             $scope.cart.push(item);
         } else {
             var repeat = false;
             for(var i = 0; i< $scope.cart.length; i++){
                 if($scope.cart[i].id === item.id){
                     repeat = true;
                     $scope.cart[i].count +=1;
                 }
             }
             if (!repeat) {
                item.count = 1;
                  $scope.cart.push(item);	
             }
         }
         var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 1);
         $cookieStore.put('cart', $scope.cart,  {'expires': expireDate});
         $scope.cart = $cookieStore.get('cart');
         
        
     
      $scope.total += parseFloat(item.price);
  $cookieStore.put('total', $scope.total,  {'expires': expireDate});

   $scope.discountValue += parseFloat(item.price - (item.price/100) * item.discount);
   $cookieStore.put('discount', $scope.discountValue,  {'expires': expireDate});

  //$scope.totalItems += parseFloat(item.count);
  $scope.totalItems += 1;
  $cookieStore.put('totalItems', $scope.totalItems,  {'expires': expireDate});

     };

     $scope.removeItemCart = function(item){
       if(item.count > 1){
        item.count -= 1;
         var expireDate = new Date();
     expireDate.setDate(expireDate.getDate() + 1);
         $cookieStore.put('cart', $scope.cart, {'expires': expireDate});
            $scope.cart = $cookieStore.get('cart');
       }
       else if(item.count === 1){
         var index = $scope.cart.indexOf(item);
          $scope.cart.splice(index, 1);
          expireDate = new Date();
   expireDate.setDate(expireDate.getDate() + 1);
          $cookieStore.put('cart', $scope.cart, {'expires': expireDate});
          $scope.cart = $cookieStore.get('cart');
         
       }
       
       $scope.total -= parseFloat(item.price);
   $cookieStore.put('total', $scope.total,  {'expires': expireDate});

    $scope.discountValue -= parseFloat(item.price - (item.price/100) * item.discount);
   $cookieStore.put('discount', $scope.discountValue,  {'expires': expireDate});

  //$scope.totalItems -= parseFloat(item.count);
  $scope.totalItems -= 1;
  $cookieStore.put('totalItems', $scope.totalItems,  {'expires': expireDate});

     };

     $scope.IsVisible = false;
            $scope.ShowHide = function () {
                $scope.IsVisible = $scope.IsVisible ? false : true;
            }
$scope.IsVisible1 = false;
            $scope.ShowHide1 = function () {
                $scope.IsVisible1 = $scope.IsVisible1 ? false : true;
            }
    
//$scope.sortlimitValue = "-price";
  $scope.submitResult = function(sortlimitValue) {  
    $scope.sortlimit = $scope.sortlimitValue;
    $scope.IsVisible = $scope.IsVisible ? false : true;
  };


}]);
