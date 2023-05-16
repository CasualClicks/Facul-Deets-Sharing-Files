const express= require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const { Mongoose } = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// MongoDB 
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/facultyDB", {useNewUrlParser:true,useUnifiedTopology: true});

const facultyLoginSchema = new mongoose.Schema({
    id: Number,
    password: String},
    {

    collection : 'facultyLoginCollection'
});

const facultySchema = new mongoose.Schema({
    name: String,
    cabin: String,
    id: Number,
    school: String,
    email: String,
    linkedin: String,
    ongoing_project: String,
    subjects: [],
    education: [],
    bio: []},
{ collection: 'facultyInfo'
});

const facultyLoginCollection = mongoose.model("facultyLoginCollection", facultyLoginSchema);
const facultyInfoCollection = mongoose.model("facultyInfoCollection", facultySchema);



app.get("/", function(req, res){
    res.redirect("/about");
    facultyLoginCollection.findOne({id:100382},function(err, result){
        if(err)
            console.log(err);
        else   
            if(result)
                console.log(result);
    }); 
})

app.get("/faculty_page/", function(req, res){
    res.render("faculty_page");
});

app.get("/about", function(req, res){
    res.render("about_page");
})

app.get("/login", function(req,res){
    res.render("login_page");
})

app.post("/login", function(req, res){
    const userid = req.body.userid;
    const password = req.body.password;

    facultyLoginCollection.findOne({id: userid}, function(err, foundUser){
        if(err)
            console.log(err);
        else
            if(foundUser)
                if(foundUser.password === password)
                    res.redirect("/login/"+userid);
    });
});


app.get("/login/:id", function(req, res){
    const userid = req.params.id;
    res.redirect("/login/comoredit/"+userid);
})

app.get("/login/comoredit/:id", function(req, res){
    res.render("compose_and_edit_page", {userId: req.params.id});
});

app.get("/login/compose/:id", function(req, res){
    var status = false;
    // Checking in Existing collection of Info, Not in login credentials
    facultyInfoCollection.findOne({id: req.params.id},function(err,found){
        if(err)
            console.log(err);
        else if(found)
            status = true;

    });
    res.render("compose", {userId: req.params.id, canCompose: status});
});

app.get("/login/edit/:id", function(req, res){
    
});




app.listen(process.env.PORT || 3001, function() {
    console.log("Server started on port 3001");
  });
  