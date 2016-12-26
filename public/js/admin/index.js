// let angular = require("angular");

let app = angular.module("app", []);

app.controller("appCtrl", function($scope, $http){

    // get current admin profile
    $http({
        url : "./admin_profile",
        method : "get"
    }).then(function(data, status){
        console.log(data.data);

        let result = data.data;
        if(result.ok == 1){
            $scope.admin_profile = result.data;
        }
    });

});