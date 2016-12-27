// let angular = require("angular");

let app = angular.module("app", []);

app.controller("appCtrl", function($scope, $rootScope, $http){

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
        $("select").material_select();
    });

});

app.controller("teacherCtrl", function($scope, $rootScope, $http){

    // get all teachers
    $http({
        url : "./teachers",
        method : "get"
    }).then(function(data, status){
        console.log("teachers : ", data);

        let result = data.data;
        if(result.ok == 1){
            $scope.teachers = result.data;
        }
    });

});

// app.controller("teacherCtrl", function($scope, $rootScope, $http){

//     // get all teachers
//     $http({
//         url : "./teachers",
//         method : "get"
//     }).then(function(data, status){
//         console.log(data);

//         let result = data.data;
//         if(result.ok == 1){
//             $scope.teachers = result.data;
//         }
//     });

//     $scope.editTeacherModal = function(key){
//         console.log("eidt key : ", key);

//         $rootScope.$emit("showEditTeacherModal", { key : key, data : angular.copy($scope.teachers[key]) });
//     }

//     $scope.deleteTeacherModal = function(key){
//         $rootScope.$emit("showDeleteTeacherModal", { key : key, data : angular.copy($scope.teachers[key]) });
//     }

//     $rootScope.$on("addTeacherSuccess", function(event, newTeacher){
//         console.log("teacherCtrl : ", newTeacher);
//         Materialize.toast('添加教师成功!', 4000); 

//         $scope.teachers[$scope.teachers.length] = newTeacher;
//     });

//     $rootScope.$on("editTeacherSuccess", function(event, data){
//         console.log("Teacher edited : ", data);
//         Materialize.toast('修改教师成功!', 4000); 

//         $scope.teachers[data.key] = data.data;        
//     });

//     $rootScope.$on("deleteTeacherSuccess", function(event, data){
//         console.log("Teacher delete : " + data.key);
//         Materialize.toast("删除教师成功", 4000);

//         console.log($scope.teachers.length);
//         $scope.teachers.splice(data.key);
//         console.log($scope.teachers.length);
//     })

// });

app.controller("addTeacherModalCtrl", function($scope, $rootScope, $http){

    $scope.newTeacherInit = $scope.newTeacher = {
        // sid : 0,
        teacher_id : "20160x",
        username : "教师0x"
        // sex : 0
    }

    $scope.addTeacherSubmit = function(){
        console.log($scope.newTeacher);

        $http({
            url : "./add_teacher",
            method : "post",
            data : $scope.newTeacher
        }).then(function(r, status){
            let result = r.data;
            // console.log(r);

            if(result.ok == 1){
                $scope.newTeacher = angular.copy($scope.newTeacherInit);

                // console.log(result.data[0]);
                $rootScope.$emit("addTeacherSuccess", result.data[0]);
            }
        });
    }
});

app.controller("courseCtrl", function($scope, $rootScope, $http){

    // get all courses
    $http({
        url : "./courses",
        method : "get"
    }).then(function(data, status){
        console.log(data);

        let result = data.data;
        if(result.ok == 1){
            $scope.courses = result.data;
        }
    });

    $scope.editCourseModal = function(key){
        console.log("eidt key : ", key);

        $rootScope.$emit("showEditCourseModal", { key : key, data : angular.copy($scope.courses[key]) });
    }

    $scope.deleteCourseModal = function(key){
        $rootScope.$emit("showDeleteCourseModal", { key : key, data : angular.copy($scope.courses[key]) });
    }

    $rootScope.$on("addCourseSuccess", function(event, newCourse){
        console.log("courseCtrl : ", newCourse);
        Materialize.toast('添加课程成功!', 4000); 

        $scope.courses[$scope.courses.length] = newCourse;
    });

    $rootScope.$on("editCourseSuccess", function(event, data){
        console.log("course edited : ", data);
        Materialize.toast('修改课程成功!', 4000); 

        $scope.courses[data.key] = data.data;        
    });

    $rootScope.$on("deleteCourseSuccess", function(event, data){
        console.log("course delete : " + data.key);
        Materialize.toast("删除课程成功", 4000);

        console.log($scope.courses.length);
        $scope.courses.splice(data.key);
        console.log($scope.courses.length);
    })

});

app.controller("addCourseModalCtrl", function($scope, $rootScope, $http){

    $scope.newCourseInit = $scope.newCourse = {
        title : "课程0x",
        room : "北1-10x",
        time : "第二周 - 第十六周 周三 5-6节",
        intro : "这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。"
    }

    $scope.addCourseSubmit = function(){
        console.log($scope.newCourse);

        $http({
            url : "./add_course",
            method : "post",
            data : $scope.newCourse
        }).then(function(r, status){
            let result = r.data;
            // console.log(r);

            if(result.ok == 1){
                $scope.newCourse = angular.copy($scope.newCourseInit);

                // console.log(result.data[0]);
                $rootScope.$emit("addCourseSuccess", result.data[0]);
            }
        });
    }
});

app.controller("editCourseModalCtrl", function($scope, $rootScope, $http){
    let key = -1;

    $rootScope.$on("showEditCourseModal", function(event, data){
        key = data.key;
        let editCourse = data.data;

        console.log("Edit course : ", editCourse);

        $scope.editCourse = editCourse;
        $('#editCourseModal').modal('open');
    });

    $scope.editCourseSubmit = function(){
        console.log("Edited : ", $scope.editCourse);

        $http({
            url : "./update_course",
            method : "post",
            data : $scope.editCourse
        }).then(function(result, status){
            console.log(result);

            if(result.data.ok == 1){
                $rootScope.$emit("editCourseSuccess", { key : key, data : angular.copy($scope.editCourse)});
            }
        });
    }

});

app.controller("deleteCourseModalCtrl", function($scope, $rootScope, $http){
    let key = -1;

    $rootScope.$on("showDeleteCourseModal", function(event, data){
        key = data.key;
        $scope.deleteCourse = data.data;

        console.log("delete " + data.key);
        $("#deleteCourseModal").modal("open");
    });

    $scope.deleteCourseSubmit = function(){
        console.log("delete comfirm : " + key);

        $http({
            url : "./delete_course",
            method : "post",
            data : {
                _id : $scope.deleteCourse._id
            }
        }).then(function(result, status){
            console.log(result);

            if(result.data.ok == 1){
                $rootScope.$emit("deleteCourseSuccess", { key : key });
            }
        });
    }

});