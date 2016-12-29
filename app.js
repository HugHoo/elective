let express = require("express");
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let passwordHash = require("password-hash");

let admin = require('./routes/admin');
let student = require("./routes/student");
let teacher = require("./routes/teacher");

let app = express();

app.use(express.static('public'));
app.use(express.static("node_modules"));
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

app.get("/", (req, res) => {
    res.sendFile(app.get("views") + "/index.html");
});

app.get("/admin/index", (req, res) => { admin.index(app, req, res); });
app.get("/admin/login", (req, res) => { admin.login(app, req, res); });
app.post("/admin/login", (req, res) => { admin.login_do(app, req, res); });
app.get("/admin/admin_profile", admin.admin_profile);
app.get("/admin/courses", admin.courses);
app.post("/admin/add_course", admin.add_course);
app.post("/admin/update_course", admin.update_course);
app.post("/admin/delete_course", admin.delete_course);
app.get("/admin/teachers", admin.teachers);
app.post("/admin/add_teacher", (req, res) => { admin.add_teacher(app, req, res); });
app.post("/admin/update_teacher", (req, res) => { admin.update_teacher(app, req, res); });
app.post("/admin/delete_teacher", admin.delete_teacher);
app.get("/admin/schools", admin.schools);
app.get("/admin/majors", admin.majors);
app.get("/admin/students", admin.students);
app.post("/admin/add_student", admin.add_student);
app.post("/admin/update_student", admin.update_student);
app.post("/admin/delete_student", admin.delete_student);
// app.post("/admin/teacher_image", (req, res) => { admin.teacher_image(app, req, res); });

app.get("/student/index", (req, res) => { student.index(app, req, res); });
app.get("/student/login", (req, res) => { student.login(app, req, res); });
app.post("/student/login", (req, res) => { student.login_do(app, req, res); });
app.get("/student/student_profile", student.student_profile);
app.get("/student/courses", student.courses);
app.get("/student/teachers", student.teachers);
app.get("/student/elective", student.electives);
app.post("/student/elective", student.add_elective);

app.get("/teacher/index", (req, res) => { teacher.index(app, req, res); });
app.get("/teacher/login", (req, res) => { teacher.login(app, req, res); });
app.post("/teacher/login", (req, res) => { teacher.login_do(app, req, res); });
app.get("/teacher/teacher_profile", teacher.teacher_profile);
app.get("/teacher/course", teacher.course);
app.get("/teacher/students", teacher.students);
app.get("/teacher/schools", teacher.schools);
app.get("/teacher/majors", teacher.majors);
app.post("/teacher/rating", teacher.rating);

app.listen(3000, () => { console.log("Listening on http://localhost:3000")});