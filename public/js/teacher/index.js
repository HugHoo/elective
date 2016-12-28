let app = angular.module("app", []);

app.controller("appCtrl", ["$scope", "$http", function($scope, $http){
    console.log("app ctrl loaded.");

    // get current teacher profile
    $http({
        url : "./teacher_profile",
        method : "get",
    }).then(function(result, status){
        console.log("teacher_profile : ", result.data);

        let data = result.data;
        if(data.ok == 1){
            $scope.currentTeacher = angular.copy(data.data);
        }
    });

    // get course info
    $http({
        url : "./course",
        method : "get",
    }).then(function(result, status){
        console.log("course : ", result.data);

        let data = result.data;
        if(data.ok == 1){
            $scope.course = angular.copy(data.data);
        }
    });

    // get students
    $http({
        url : "./students",
        method : "get"
    }).then(function(result, status){
        console.log("students : ", result.data);

        let data = result.data;
        if(data.ok == 1){
            $scope.students = angular.copy(data.data);
        }
    });

    // get school info
    $http({
        url : "./schools",
        method : "get",
    }).then(function(result, status){
        let old_schools = result.data.data;

        $scope.schools = new Array();
        if(result.data.ok == 1){
            for(let i = 0; i < old_schools.length; i++){
                $scope.schools[old_schools[i].school_id] = old_schools[i];
            }
        }

        console.log("schools : ", $scope.schools);        
    });

    // get majors info
    $http({
        url : "./majors",
        method : "get",
    }).then(function(result, status){
        let old_majors = result.data.data;

        $scope.majors = new Object();
        if(result.data.ok == 1){
            for(let i = 0; i < old_majors.length; i++){
                if(typeof $scope.majors[old_majors[i].sid] == 'undefined')
                    $scope.majors[old_majors[i].sid] = {};
                $scope.majors[old_majors[i].sid][old_majors[i].major_id] = old_majors[i];
            }
        }

        console.log("majors : ", $scope.majors);
    });

}]);