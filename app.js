let express = require("express");
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let passwordHash = require("password-hash");

let admin = require('./routes/admin');

let app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    name : "connect_sid",
    resave : true,
    saveUninitialized : true,
    secret : "this_is_my_secret_and_fuck_you_all"
}));

app.set("views", __dirname + "/views"); 
app.set("public", __dirname + "/public");

// let admin = {
//     index : function(app, req, res){
//         if(!req.session.admin){
//             res.redirect("./login");
//         }else{
//             res.sendFile(app.get("views") + "/admin/index.html");
//         }
//     },

//     login : function(app, req, res){
//         res.sendFile(app.get("views") + "/admin/login.html");
//     },

//     login_do : function(app, req, res){
//         res.send({
//             ok : 1,
//             data : "ok"
//         });
//     }
// }

app.get("/", (req, res) => {
    // let p1 = passwordHash.generate("admin");
    // let p2 = passwordHash.generate("admin");
    // console.log(p1);
    // console.log(p2);
    // console.log(passwordHash.verify("admin", p1));
    // console.log(passwordHash.verify("admin", p2));
    // res.send("elective admin page.");
    res.sendFile(app.get("views") + "/student/index.html");
});

app.get("/admin/index", (req, res) => { admin.index(app, req, res); });
app.get("/admin/login", (req, res) => { admin.login(app, req, res); });
app.post("/admin/login", (req, res) => { admin.login_do(app, req, res); });
app.get("/admin/admin_profile", admin.admin_profile);

app.listen(3000, () => { console.log("Listening on http://localhost:3000")});