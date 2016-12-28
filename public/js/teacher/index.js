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
        let data = result.data;
        if(data.ok == 1){
            $scope.electiveInfo = new Object();

            let electiveTmp = angular.copy(data.data.electiveInfo);
            for(let i = 0; i < electiveTmp.length; i++){
                $scope.electiveInfo[electiveTmp[i].student_id] = electiveTmp[i];
            }
            console.log("electiveInfo : ", $scope.electiveInfo);

            $scope.students = angular.copy(data.data.students);
            console.log('students : ', $scope.students);                        
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

    $scope.rating = function(key, student_id){
        console.log("rating student_id : ", student_id);
        console.log("rating key : ", key);

        let scoreTmp = new Number(angular.copy($scope.electiveInfo[student_id].score));

        $scope.ratingObj = {
            student_id : student_id,
            score : 60 ? scoreTmp : scoreTmp != -1
        }
        $scope.ratingObj.name = $scope.students[key].username;

        $('#ratingModal').modal('open');
    }

    $scope.ratingSubmit = function(){
        console.log("score : ", $scope.ratingObj.score);
        console.log("student_id : ", $scope.ratingObj.student_id);

        $http({
            url : 'rating',
            method : "post",
            data : {
                student_id : $scope.ratingObj.student_id,
                score : $scope.ratingObj.score
            }
        }).then(function(result, status){
            console.log(result.data);

            if(result.data.ok == 1){
                $scope.electiveInfo[$scope.ratingObj.student_id].score = angular.copy($scope.ratingObj.score);

                Materialize.toast("评分成功", 2000);
            }

            $('#ratingModal').modal('close');
        });

    }

}]);