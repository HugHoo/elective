// let angular = require("angular");

let app = angular.module("app", []);

app.controller("loginFormCtrl", function($scope, $http, $window){

    console.log("login form controller loaded.");

    $scope.loginFormSubmit = function(){
        console.log($scope.teacher);

        $http({
            url : "./login",
            method : "post",
            data : $scope.teacher
        }).then(function(data, status){
            console.log(data);

            let result = data.data;

            if(result.ok == 0){
                $scope.notify = {
                    color : "red-text",
                    message : result.data
                }

            }else{
                $scope.notify = {
                    color : "green-text",
                    message : result.data
                }

                $window.location.href = "./index";
            }

            console.log($scope.notify);            
        });
    }

});