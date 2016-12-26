let assert = require("assert");
let passwordHash = require("password-hash");
let mongoClient = require("mongodb").MongoClient;
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