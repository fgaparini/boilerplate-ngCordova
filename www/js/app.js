// Ionic Starter App

var db = null;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngRoute'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($routeProvider){
  $routeProvider
    .when("/", {
      controller: "MyCtrl",
      templateUrl:"templates/main.html"
    })
    .otherwise({ redirectTo: '/' })
})


.controller('MyCtrl', function($scope, $ionicPlatform, $cordovaSQLite, $http) {



  //inicializacion

  db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser or mobile



  //create de table 
  var query = "CREATE TABLE cuestionario(ID INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, opcion TEXT NOT NULL, sync INT NOT NULL);";
  $cordovaSQLite.execute(db, query).then(function(res) {
    $scope.test = "create table";
  }, function (err) {
    //if exist
    console.error(err);

    //sync to server
      var query = "select * from cuestionario where sync = 0";
      $cordovaSQLite.execute(db, query, []).then(function(res) {
        $scope.test = "";
        for (var i = 0; i < res.rows.length; i++) {
            
            var data = {email : res.rows.item(i).email, opcion : res.rows.item(i).opcion };
            $http.post("myserver.php", data, function(response){
              if (response == 1){
                  var update = "update cuestionario set sync = 1 where ID = " + res.rows.item(i).ID;
                  $cordovaSQLite.execute(db, update).then(function(res) {
                    console.log("insert fine");
                  }, function (err) {
                    console.error(err);
                  });
                }
            });
        }
      }, function (err) {
        //fail execute query
        console.error(err);
      });
    //sync 

  });




  $scope.guardar = function(){

    //alert("entro" + $scope.email + $scope.opcion);
    var query = "INSERT INTO cuestionario (email, opcion, sync) VALUES (?,?, 0)";
    $cordovaSQLite.execute(db, query, [$scope.email, $scope.opcion]).then(function(res) {
      console.log("insert fine");
      $scope.email = "";
      $scope.opcion = "";
    }, function (err) {
      console.error(err);
    });
  }

  $scope.createTable = function(){
    var query = "CREATE TABLE cuestionario(ID INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, opcion TEXT NOT NULL, sync INT NOT NULL);";
    $cordovaSQLite.execute(db, query).then(function(res) {
      $scope.test = "create table";
    }, function (err) {
      console.error(err);
    });
  }



  $scope.dropTable = function (){
    var query = "DROP TABLE test_table";
    $cordovaSQLite.execute(db, query).then(function(res) {
      $scope.test ="drop tablecorrect";
    }, function (err) {
      console.error(err);
    });
  }

  $scope.insert = function() {
    var query = "INSERT INTO test_table (data, data_num) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, ["test", 100]).then(function(res) {
      console.log("insert fine");
    }, function (err) {
      console.error(err);
    });
  };

  $scope.list = function(){
    var query = "select * from cuestionario";
    $cordovaSQLite.execute(db, query, []).then(function(res) {
      $scope.test = "";
      for (var i = 0; i < res.rows.length; i++) {
          console.log(res.rows.item(i));
      }
    }, function (err) {
      console.error(err);
    });
  }


});