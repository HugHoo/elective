let assert = require("assert");
let passwordHash = require("password-hash");
let mongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;

let url = "mongodb://localhost:2333/elective";

let student = {

    index : function(app, req, res){
        if(!req.session.student){
            res.redirect("./login");
        }else{
            res.sendFile(app.get("views") + "/student/index.html");
        }
    },

    login : function(app, req, res){
        res.sendFile(app.get("views") + "/student/login.html");
    },

    login_do : function(app, req, res){
        authenticate(req.body, function(err, doc){
            if(err){
                console.log("学生认证失败 [ %s : %s ]", req.body.student_id, req.body.password)

                res.send({
                    ok : 0,
                    data : err.message
                });
            }else{
                console.log("学生认证成功");
                req.session.student = doc;

                res.send({
                    ok : 1,
                    data : "登陆成功"
                })
            }
        });
    },

    student_profile : function(req, res){
        // check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                let current_student = req.session.student;

                res.send({
                    ok : 1,
                    data : {
                        student_id : current_student.student_id,
                        username : current_student.username,
                        sex : current_student.sex
                    }
                });
            }
        });
    },

    courses : function(req, res){
        // check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let courseColl = db.collection("course");
                    courseColl.find({}).toArray(function(err, docs){
                        assert.equal(err, null);

                        console.log("获取所有课程");
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

    teachers : function(req, res){
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let teacherColl = db.collection("teacher");
                    teacherColl.find({}).toArray(function(err, docs){
                        assert.equal(err, null);

                        console.log("获取所有教师");
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

    electives : function(req, res){
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                console.log("req query : ", req.query);

                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let collection = db.collection("elective_info");
                    collection.find({ student_id : req.session.student.student_id }).toArray(function(err, docs){
                        assert.equal(err, null);

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

    add_elective : function(req, res){
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                let length = req.body.length;

                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let collection = db.collection("elective_info");
                    collection.deleteMany({ student_id : req.session.student.student_id }, function(err, r){
                        assert.equal(err, null);
                        assert.equal(1, r.result.ok);
                    });

                    collection.insertMany(req.body, function(err, obj){
                        assert.equal(err, null);
                        assert.equal(length, obj.result.n);
                        assert.equal(length, obj.ops.length);

                        res.send({
                            ok : 1,
                            data : obj.ops
                        });
                    });

                    db.close();
                });
            }
        });
    }
}

function checkSession(req, fn){
    if(req.session.student == null){
        fn(false);
    }else{
        fn(true);
    }
}

function authenticate(student, fn){
    console.log("学生认证中 [ %s : %s ]", student.student_id, student.password);

    mongoClient.connect(url, function(err, db){
        assert.equal(err, null);

        let studentColl = db.collection("student");
        studentColl.findOne({ student_id : student.student_id }, function(err, doc){
            assert.equal(err, null);

            if(doc == null){
                fn(new Error("登陆失败，请检查账号或密码是否正确"));
            }else{
                if(passwordHash.verify(student.password, doc.password)){
                    fn(null, doc);
                }else{
                    fn(new Error("登陆失败，请检查账号或密码是否正确"));
                }
            }

            db.close();
        });
    });
}

module.exports = student;