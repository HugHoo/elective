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

    // get all teachers
    $http({
        url : "./teachers",
        method : "get"
    }).then(function(data, status){
        let result = data.data;

        $scope.allTeachers = new Object();
        if(result.ok == 1){
            let allTeachers = result.data;

            for(let i = 0; i < allTeachers.length; i++){
                $scope.allTeachers[allTeachers[i].teacher_id] = allTeachers[i];
            }

            console.log("all teachers : ", $scope.allTeachers);            
        }
    });

});

app.controller("studentCtrl", function($scope, $rootScope, $http){

    // get all students
    $http({
        url : "./students",
        method : "get"
    }).then(function(data, status){
        console.log("students : ", data);

        let result = data.data;
        if(result.ok == 1){
            $scope.students = result.data;
        }
    });

    $scope.editStudentModal = function(key){
        console.log("eidt key : ", key);

        $rootScope.$emit("showEditStudentModal", { key : key, data : angular.copy($scope.students[key]) });
    }

    $scope.deleteStudentModal = function(key){
        $rootScope.$emit("showDeleteStudentModal", { key : key, data : angular.copy($scope.students[key]) });
    }

    $rootScope.$on("addStudentSuccess", function(event, newStudent){
        console.log("studentCtrl : ", newStudent);
        Materialize.toast('添加学生成功!', 4000); 

        $scope.students[$scope.students.length] = newStudent;
    });

    $rootScope.$on("editStudentSuccess", function(event, data){
        console.log("Student edited : ", data);
        Materialize.toast('修改学生成功!', 4000); 

        $scope.students[data.key] = data.data;        
    });

    $rootScope.$on("deleteStudentSuccess", function(event, data){
        console.log("Student delete : " + data.key);
        Materialize.toast("删除学生成功", 4000);

        console.log($scope.students.length);
        $scope.students.splice(data.key, 1);
        console.log($scope.students.length);
    })

});

app.controller("addStudentModalCtrl", function($scope, $rootScope, $http){

    // let majors01 = $scope.majors = [
    //     { major_id : 0, major_name : "软件工程" },
    //     { major_id : 1, major_name : "计算机科学与技术" },
    //     { major_id : 2, major_name : "电子工程" },
    //     { major_id : 3, major_name : "通信工程" },
    // ];

    // let majors02 = [
    //     { major_id : 4, major_name : "软件工程02" },
    //     { major_id : 5, major_name : "计算机科学与技术02" },
    //     { major_id : 6, major_name : "电子工程02" }
    // ]

    $scope.newStudentInit = {
        // sid : 0,
        student_id : "20142480xxx",
        username : "学生xxx",
        tel : 13839162000
        // sex : 0
    }

    $scope.newStudent = {
        // sid : 0,
        student_id : "20142480xxx",
        username : "学生xxx",
        tel : 13839162000
        // sex : 0
    }

    $scope.schoolSelectChange = function(){
        console.log("school select : ", $scope.newStudent.sid);

        $scope.nowMajors = [];
        $scope.nowMajors = angular.copy($scope.$parent.majors[$scope.newStudent.sid]);
    }

    $scope.addStudentSubmit = function(){
        console.log($scope.newStudent);

        $http({
            url : "./add_student",
            method : "post",
            data : $scope.newStudent
        }).then(function(r, status){
            let result = r.data;
            // console.log(r);

            if(result.ok == 1){
                $scope.newStudent = angular.copy($scope.newStudentInit);

                // console.log(result.data[0]);
                $rootScope.$emit("addStudentSuccess", result.data[0]);
            }
        });
    }
});

app.controller("editStudentModalCtrl", function($scope, $rootScope, $http){
    let key = -1;

    $rootScope.$on("showEditStudentModal", function(event, data){
        key = data.key;
        let editStudent = data.data;

        console.log("Edit Student : ", editStudent);

        $scope.editStudent = editStudent;
        $scope.nowMajors = $scope.$parent.majors[$scope.editStudent.sid];        

        $('#editStudentModal').modal('open');
    });

    $scope.schoolSelectChange = function(){
        console.log("school select : ", $scope.editStudent.sid);

        $scope.nowMajors = [];
        $scope.nowMajors = angular.copy($scope.$parent.majors[$scope.editStudent.sid]);
    }

    $scope.editStudentSubmit = function(){
        console.log("Edited : ", $scope.editStudent);

        $http({
            url : "./update_student",
            method : "post",
            data : $scope.editStudent
        }).then(function(result, status){
            console.log(result);

            if(result.data.ok == 1){
                $rootScope.$emit("editStudentSuccess", { key : key, data : angular.copy($scope.editStudent)});
            }
        });
    }

});

app.controller("deleteStudentModalCtrl", function($scope, $rootScope, $http){
    let key = -1;

    $rootScope.$on("showDeleteStudentModal", function(event, data){
        key = data.key;
        $scope.deleteStudent = data.data;

        console.log("delete " + data.key);
        $("#deleteStudentModal").modal("open");
    });

    $scope.deleteStudentSubmit = function(){
        console.log("delete comfirm : " + key);

        $http({
            url : "./delete_student",
            method : "post",
            data : {
                _id : $scope.deleteStudent._id
            }
        }).then(function(result, status){
            console.log(result);

            if(result.data.ok == 1){
                $rootScope.$emit("deleteStudentSuccess", { key : key });
            }
        });
    }

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

    $scope.editTeacherModal = function(key){
        console.log("eidt key : ", key);

        $rootScope.$emit("showEditTeacherModal", { key : key, data : angular.copy($scope.teachers[key]) });
    }

    $scope.deleteTeacherModal = function(key){
        $rootScope.$emit("showDeleteTeacherModal", { key : key, data : angular.copy($scope.teachers[key]) });
    }

    $rootScope.$on("addTeacherSuccess", function(event, newTeacher){
        console.log("teacherCtrl : ", newTeacher);
        Materialize.toast('添加教师成功!', 4000); 

        $scope.teachers[$scope.teachers.length] = newTeacher;
    });

    $rootScope.$on("editTeacherSuccess", function(event, data){
        console.log("Teacher edited : ", data);
        Materialize.toast('修改教师成功!', 4000); 

        $scope.teachers[data.key] = data.data;        
    });

    $rootScope.$on("deleteTeacherSuccess", function(event, data){
        console.log("Teacher delete : " + data.key);
        Materialize.toast("删除教师成功", 4000);

        console.log($scope.teachers.length);
        $scope.teachers.splice(data.key, 1);
        console.log($scope.teachers.length);
    })

});

app.controller("addTeacherModalCtrl", function($scope, $rootScope, $http){

    $scope.newTeacherInit = {
        // sid : 0,
        teacher_id : "20160x",
        username : "教师0x"
        // sex : 0
    }

    $scope.newTeacher = {
        // sid : 0,
        teacher_id : "20160x",
        username : "教师0x"
        // sex : 0
    }

    $scope.addTeacherSubmit = function(){
        console.log($scope.newTeacher);

        uploadFile(function(result, fileInfo){
            let teacherInfo = angular.copy($scope.newTeacher);

            if(result == 1){
                teacherInfo.fileInfo = fileInfo;
                let fileNameArr = fileInfo.fileName.split(".");
                teacherInfo.avator = teacherInfo.teacher_id + "." + fileNameArr[fileNameArr.length - 1];
            }

            $http({
                url : "./add_teacher",
                method : "post",
                data : teacherInfo
            }).then(function(r, status){
                let result = r.data;
                // console.log(r);

                if(result.ok == 1){
                    $scope.newTeacher = angular.copy($scope.newTeacherInit);

                    // console.log(result.data[0]);
                    $rootScope.$emit("addTeacherSuccess", result.data[0]);
                }
            });
        });
    }

    function uploadFile(fn){
        let f = $('#addTeacherFile')[0].files[0];
        let r = new FileReader();

        if(typeof f == "undefined"){
            fn(0);
        }else{
            let fileName = f.name;
            // let fileName = "test233." + fileNameArr[fileNameArr.length - 1];

            r.onloadend = function(e){
                // console.log(e);
                console.log(fileName);
                var data = e.target.result;
                
                fn(1, {
                    fileName : fileName,
                    file : data
                });

                $('#addTeacherFile').val("");
                $("#addTeacherFileInfo").val("");
            }

            r.readAsBinaryString(f);
        }
    }
});

app.controller("editTeacherModalCtrl", function($scope, $rootScope, $http){
    let key = -1;

    $rootScope.$on("showEditTeacherModal", function(event, data){
        key = data.key;
        let editTeacher = data.data;

        console.log("Edit Teacher : ", editTeacher);

        $scope.editTeacher = editTeacher;
        $('#editTeacherModal').modal('open');
    });

    $scope.editTeacherSubmit = function(){
        console.log("Edited : ", $scope.editTeacher);
        
        uploadFile(function(result, fileInfo){
            let teacherInfo = angular.copy($scope.editTeacher);

            if(result == 1){
                teacherInfo.fileInfo = fileInfo;
                let fileNameArr = fileInfo.fileName.split(".");
                teacherInfo.avator = teacherInfo.teacher_id + "." + fileNameArr[fileNameArr.length - 1];
            }

            $http({
                url : "./update_teacher",
                method : "post",
                data : teacherInfo
            }).then(function(result, status){
                console.log(result);

                if(result.data.ok == 1){
                    $rootScope.$emit("editTeacherSuccess", { key : key, data : angular.copy($scope.editTeacher)});
                }
            });
        });

    }

    function uploadFile(fn){
        let f = $('#editTeacherFile')[0].files[0];
        let r = new FileReader();

        if(typeof f == "undefined"){
            fn(0);
        }else{
            let fileName = f.name;
            // let fileName = "test233." + fileNameArr[fileNameArr.length - 1];

            r.onloadend = function(e){
                // console.log(e);
                console.log(fileName);
                var data = e.target.result;
                
                fn(1, {
                    fileName : fileName,
                    file : data
                });

                $('#editTeacherFile').val("");
                $("#editTeacherFileInfo").val("");
            }

            r.readAsBinaryString(f);
        }
    }

});

app.controller("deleteTeacherModalCtrl", function($scope, $rootScope, $http){
    let key = -1;

    $rootScope.$on("showDeleteTeacherModal", function(event, data){
        key = data.key;
        $scope.deleteTeacher = data.data;

        console.log("delete " + data.key);
        $("#deleteTeacherModal").modal("open");
    });

    $scope.deleteTeacherSubmit = function(){
        console.log("delete comfirm : " + key);

        $http({
            url : "./delete_teacher",
            method : "post",
            data : {
                _id : $scope.deleteTeacher._id
            }
        }).then(function(result, status){
            console.log(result);

            if(result.data.ok == 1){
                $rootScope.$emit("deleteTeacherSuccess", { key : key });
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
        $scope.courses.splice(data.key, 1);
        console.log($scope.courses.length);
    })

});

app.controller("addCourseModalCtrl", function($scope, $rootScope, $http){

    $scope.newCourseInit = {
        title : "课程0x",
        room : "北1-10x",
        time : "第二周 - 第十六周 周三 5-6节",
        intro : "这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。这是课程0x的简介。"
    }

    $scope.newCourse = {
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