let app = angular.module("app", []);

app.controller("appCtrl", ["$scope", "$http", function($scope, $http){
    console.log("app ctrl loaded.");

    // get current student info
    $http({
        url : "./student_profile",
        method : "get",
    }).then(function(result, status){
        console.log(result.data);

        let data = result.data;
        if(data.ok == 1){
            $scope.currentStudent = angular.copy(data.data);
        }
    });

    // get all courses' info
    $http({
        url : "./courses",
        method : "get",
    }).then(function(result, status){
        console.log(result.data);

        let data = result.data;
        if(data.ok == 1){
            $scope.courses = angular.copy(data.data);
        }

        // get all elective info about current student
        $http({
            url : "./elective",
            method : "get",
        }).then(function(result, status){
            console.log("elective info : ", result.data);
            let electiveInfo = result.data.data;

            updateElectiveInfo(electiveInfo);
        });
    });

    function updateElectiveInfo(electiveInfo){
        $scope.courseSelect = new Array();        

        for(let i = 0; i < $scope.courses.length; i++){
            for(let j = 0; j < electiveInfo.length; j++){
                if($scope.courses[i]._id == electiveInfo[j].course_id){
                    $scope.courseSelect[i] = true;
                }
            }
        }
    }

    // get all teachers
    $http({
        url : "./teachers",
        method : "get"
    }).then(function(data, status){
        let result = data.data;

        $scope.teachers = new Object();
        if(result.ok == 1){
            let teachers = result.data;

            for(let i = 0; i < teachers.length; i++){
                $scope.teachers[teachers[i].teacher_id] = teachers[i];
            }

            console.log("all teachers : ", $scope.teachers);            
        }
    });

    $scope.electiveSubmit = function(){
        console.log($scope.courseSelect);

        let electiveInfo = new Array();
        for(let i = 0; i < $scope.courseSelect.length; i++){
            if($scope.courseSelect[i] == true){
                console.log(i);

                electiveInfo.push({
                    course_id : $scope.courses[i]._id,
                    student_id : $scope.currentStudent.student_id,
                    score : -1
                });
            }
        }

        console.log(electiveInfo);

        $http({
            url : "elective",
            method : "post",
            data : electiveInfo
        }).then(function(result, status){
            console.log(result.data);

            Materialize.toast('选修课程成功！', 4000)
            // updateElectiveInfo(result.data.data);
        });
    }

}]);