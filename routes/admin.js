let assert = require("assert");
let passwordHash = require("password-hash");
let mongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let url = "mongodb://localhost:2333/elective";

let admin = {
    index : function(app, req, res){
        if(!req.session.admin){
            res.redirect("./login");
        }else{
            res.sendFile(app.get("views") + "/admin/index.html");
        }
    },

    login : function(app, req, res){
        res.sendFile(app.get("views") + "/admin/login.html");
    },

    login_do : function(app, req, res){
        authenticate(req.body, function(err, doc){
            if(err){
                console.log("管理员认证失败 [ %s : %s ]", req.body.admin_id, req.body.password)

                res.send({
                    ok : 0,
                    data : err.message
                });
            }else{
                console.log("管理员认证成功");
                req.session.admin = doc;

                res.send({
                    ok : 1,
                    data : "登陆成功"
                })
            }
        });
    },

    admin_profile : function(req, res){
        // check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                let current_admin = req.session.admin;

                res.send({
                    ok : 1,
                    data : {
                        username : current_admin.username,
                        sex : current_admin.sex
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

    add_course : function(req, res){
        // check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let courseColl = db.collection("course");
                    courseColl.insertOne(req.body, function(err, r){
                        assert.equal(err, null);
                        assert.equal(r.insertedCount, 1);

                        // console.log(r.ops);
                        console.log("添加成功");
                        res.send({
                            ok : 1,
                            data : r.ops
                        });
                    });

                    db.close();
                });
            }
        });
    },

    update_course : function(req, res){
        // check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let courseColl = db.collection("course");
                    courseColl.updateOne({ _id : ObjectID(req.body._id) },
                    {
                        title : req.body.title,
                        time : req.body.time,
                        point : req.body.point,
                        room : req.body.room,
                        intro : req.body.intro,
                    }, function(err, result){
                        assert.equal(null, err);
                        assert.equal(1, result.result.n);

                        console.log("更新成功");
                        res.send({
                            ok : 1
                        });
                    });

                    db.close();
                });
            }
        });
    },

    delete_course : function(req, res){
        //check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let courseColl = db.collection("course");
                    courseColl.deleteOne({ _id : ObjectID(req.body._id) }, function(err, result){
                        assert.equal(err, null);
                        assert.equal(result.result.n, 1);

                        console.log("删除课程 [ %s ] 成功", req.body._id);
                        res.send({
                            ok : 1,
                        });
                    });
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

    add_teacher : function(req, res){
        // check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                req.body.password = passwordHash.generate(req.body.teacher_id);

                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let teacherColl = db.collection("teacher");
                    teacherColl.insertOne(req.body, function(err, r){
                        assert.equal(err, null);
                        assert.equal(r.insertedCount, 1);

                        // console.log(r.ops);
                        console.log("添加教师成功");
                        res.send({
                            ok : 1,
                            data : r.ops
                        });
                    });

                    db.close();
                });
            }
        });
    },

    update_teacher : function(req, res){
        // check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let teacherColl = db.collection("teacher");
                    teacherColl.updateOne({ _id : ObjectID(req.body._id) },
                    {
                        sid : req.body.sid,
                        username : req.body.username,
                        sex : req.body.sex,
                    }, function(err, result){
                        assert.equal(null, err);
                        assert.equal(1, result.result.n);

                        console.log("更新教师成功");
                        res.send({
                            ok : 1
                        });
                    });

                    db.close();
                });
            }
        });
    },

    delete_teacher : function(req, res){
        //check session
        checkSession(req, function(result){
            if(!result){
                res.redirect("./login");
            }else{
                mongoClient.connect(url, function(err, db){
                    assert.equal(err, null);

                    let teacherColl = db.collection("teacher");
                    teacherColl.deleteOne({ _id : ObjectID(req.body._id) }, function(err, result){
                        assert.equal(err, null);
                        assert.equal(result.result.n, 1);

                        console.log("删除课程 [ %s ] 成功", req.body._id);
                        res.send({
                            ok : 1,
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
    }
}

function checkSession(req, fn){
    if(req.session.admin == null){
        fn(false);
    }else{
        fn(true);
    }
}

function authenticate(admin, fn){
    console.log("管理员认证中 [ %s : %s ]", admin.admin_id, admin.password);

    mongoClient.connect(url, function(err, db){
        assert.equal(err, null);

        let adminColl = db.collection("admin");
        adminColl.findOne({ admin_id : admin.admin_id }, function(err, doc){
            assert.equal(err, null);

            if(doc == null){
                fn(new Error("登陆失败，请检查账号或密码是否正确"));
            }else{
                if(passwordHash.verify(admin.password, doc.password)){
                    fn(null, doc);
                }else{
                    fn(new Error("登陆失败，请检查账号或密码是否正确"));
                }
            }

            db.close();
        });
    });
}

module.exports = admin;