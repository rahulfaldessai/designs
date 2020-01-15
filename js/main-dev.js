var app = angular
  .module('myModule', ['uiSlider', 'ngCookies'])
  .controller('mycontroller', ['$scope', '$http', '$cookies', '$cookieStore', function ($scope, $http, $cookies, $cookieStore) {
    //array data
    var url = "https://api.myjson.com/bins/qzuzi";
    $http.get(url).success(function (response) {
      $scope.items = response;
      $scope.filteredItems = angular.copy($scope.items);
    });

    //sort list
    $scope.sortlimit = "-price";
    $scope.reverseSort = false;

    //search list
    $scope.searchData = {}
    $scope.searchDataBy = '$'

    //filter data
    $scope.lower_price_bound = 100;
    $scope.upper_price_bound = 10000;
    $scope.priceRange = function (lower_price_bound, upper_price_bound) {
      $scope.filteredItems = $scope.items.filter(x => x.price <= upper_price_bound && x.price >= lower_price_bound);
    };

    //show tabs
    this.tab = 1;
    this.selectTab = function (setTab) {
      this.tab = setTab;
    }
    this.isSelected = function (checkTab) {
      return this.tab === checkTab;
    }

    $scope.cart = [];
    $scope.total = 0;
    $scope.discountValue = 0;
    $scope.totalItems = 0;

    if (!angular.isUndefined($cookies['total'])) {
      $scope.total = parseFloat($cookies['total']);
    }

    if (!angular.isUndefined($cookies['cart'])) {
      $scope.cart = $cookieStore.get('cart');
    }

    if (!angular.isUndefined($cookies['discount'])) {
      $scope.discountValue = parseFloat($cookies['discount']);
    }

    if (!angular.isUndefined($cookies['totalItems'])) {
      $scope.totalItems = $cookieStore.get('totalItems');
    }

    $scope.addItemToCart = function (item) {
      if ($scope.cart.length === 0) {
        item.count = 1;
        $scope.cart.push(item);
      } else {
        var repeat = false;
        for (var i = 0; i < $scope.cart.length; i++) {
          if ($scope.cart[i].id === item.id) {
            repeat = true;
            $scope.cart[i].count += 1;
          }
        }
        if (!repeat) {
          item.count = 1;
          $scope.cart.push(item);
        }
      }
      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1);
      $cookieStore.put('cart', $scope.cart, { 'expires': expireDate });
      $scope.cart = $cookieStore.get('cart');

      $scope.total += parseFloat(item.price);
      $cookieStore.put('total', $scope.total, { 'expires': expireDate });

      $scope.discountValue += parseFloat(item.price - (item.price / 100) * item.discount);
      $cookieStore.put('discount', $scope.discountValue, { 'expires': expireDate });

      $scope.totalItems += 1;
      $cookieStore.put('totalItems', $scope.totalItems, { 'expires': expireDate });

      
        $scope.selectCart = function(){
          if($scope.cart.length >= 1){
          $scope.panel.tab = 2;
          $scope.searchData = {};
        }
        else{
          $scope.panel.tab = 1;
        }
        };

    };

    $scope.removeItemCart = function (item) {
      if (item.count > 1) {
        item.count -= 1;
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        $cookieStore.put('cart', $scope.cart, { 'expires': expireDate });
        $scope.cart = $cookieStore.get('cart');
      }
      else if (item.count === 1) {
        var index = $scope.cart.indexOf(item);
        $scope.cart.splice(index, 1);
        expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        $cookieStore.put('cart', $scope.cart, { 'expires': expireDate });
        $scope.cart = $cookieStore.get('cart');
      }

      $scope.total -= parseFloat(item.price);
      $cookieStore.put('total', $scope.total, { 'expires': expireDate });

      $scope.discountValue -= parseFloat(item.price - (item.price / 100) * item.discount);
      $cookieStore.put('discount', $scope.discountValue, { 'expires': expireDate });

      $scope.totalItems -= 1;
      $cookieStore.put('totalItems', $scope.totalItems, { 'expires': expireDate });

      if($scope.cart.length == 0){
        $scope.panel.tab = 1;
       }

    };

    $scope.IsVisible = false;
    $scope.ShowHide = function () {
      $scope.sortlimitValue = "-price";
      $scope.IsVisible = $scope.IsVisible ? false : true;
    }
    $scope.IsVisible1 = false;
    $scope.ShowHide1 = function () {
      $scope.IsVisible1 = $scope.IsVisible1 ? false : true;
    }

    $scope.submitResult = function(changedVal) {  
      $scope.sortlimit = changedVal;
    };

  }]);
