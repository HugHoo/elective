let assert = require("assert");
let passwordHash = require("password-hash");
let mongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;

let url = "mongodb://localhost:2333/elective";

let teacher = {

    index : function(app, req, res){
        if(!req.session.teacher){
            res.redirect("./login");
        }else{
            res.sendFile(app.get("views") + "/teacher/index.html");
        }
    },

    login : function(app, req, res){
        res.sendFile(app.get("views") + "/teacher/login.html");
    },

    login_do : function(app, req, res){
        authenticate(req.body, function(err, doc){
            if(err){
                console.log("教师认证失败 [ %s : %s ]", req.body.teacher_id, req.body.password)

                res.send({
                    ok : 0,
                    data : err.message
                });
            }else{
                console.log("教师认证成功");
                req.session.teacher = doc;

                res.send({
                    ok : 1,
                    data : "登陆成功"
                })
            }
        });
    },

    teacher_profile : function(req, res){
        // check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                let current_teacher = req.session.teacher;

                res.send({
                    ok : 1,
                    data : {
                        teacher_id : current_teacher.teacher_id,
                        username : current_teacher.username,
                        sex : current_teacher.sex,
                        avator : current_teacher.avator
                    }
                });
            }
        });
    },

    course : function(req, res){
        // check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let courseColl = db.collection("course");
                    courseColl.findOne({ teacher_id : req.session.teacher.teacher_id }, function(err, doc){
                        assert.equal(err, null);

                        console.log("获取当前教师的课程");
                        res.send({
                            ok : 1,
                            data : doc
                        });
                    });

                    db.close();
                });
            }
        });
    },

    students : function(req, res){
        // check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let courseColl = db.collection("course");
                    courseColl.findOne({ teacher_id : req.session.teacher.teacher_id }, function(err, doc){
                        assert.equal(err, null);

                        console.log("获取当前教师的课程");
                        let course_id = doc.course_id;
                        console.log("course id : ", course_id);

                        // find all students'id from elective_info
                        let electiveColl = db.collection("elective_info");
                        electiveColl.find({ course_id : course_id }).toArray(function(err, docs){
                            assert.equal(err, null);

                            console.log("elective info : ", docs);

                            let student_id_coll = [];
                            for(let i = 0; i < docs.length; i++){
                                student_id_coll.push(docs[i].student_id);
                            }

                            console.log("student_id_coll : ", student_id_coll);

                            let studentColl = db.collection("student");
                            studentColl.find({ student_id : { $in : student_id_coll }}).toArray(function(err, docs){
                                assert.equal(err, null);
                                console.log("elective students : ", docs);

                                res.send({
                                    ok : 1,
                                    data : docs
                                });

                                db.close();                                
                            });

                        });
                    });

                });
            }
        });
    },

    schools : function(req, res){
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let collection = db.collection("school");
                    collection.find({}).toArray(function(err, docs){
                        assert.equal(err, null);

                        console.log("获取所有学院");
                        res.send({
                            ok : 1,
                            data : docs
                        });
                    });

                    db.close();
                });
            }
        });
    },

    majors : function(req, res){
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let collection = db.collection("major");
                    collection.find({}).toArray(function(err, docs){
                        assert.equal(err, null);

                        console.log("获取所有专业");
                        res.send({
                            ok : 1,
                            data : docs
                        });
                    });

                    db.close();
                });
            }
        });
    },

}

function checkSession(req, fn){
    if(req.session.teacher == null){
        fn(false);
    }else{
        fn(true);
    }
}

function authenticate(teacher, fn){
    console.log("教师认证中 [ %s : %s ]", teacher.teacher_id, teacher.password);

    mongoClient.connect(url, function(err, db){
        assert.equal(err, null);

        let teacherColl = db.collection("teacher");
        teacherColl.findOne({ teacher_id : teacher.teacher_id }, function(err, doc){
            assert.equal(err, null);

            if(doc == null){
                fn(new Error("登陆失败，请检查账号或密码是否正确"));
            }else{
                if(passwordHash.verify(teacher.password, doc.password)){
                    fn(null, doc);
                }else{
                    fn(new Error("登陆失败，请检查账号或密码是否正确"));
                }
            }

            db.close();
        });
    });
}

module.exports = teacher;