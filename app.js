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
})


const facultyLoginCollection = mongoose.model("facultyLoginCollection", facultyLoginSchema);


// const facultySchema = new mongoose.Schema({
//     name: String,
//     id: Number,
//     school: String,
//     cabin: String,
//     email: String,
//     linkedin: String,
//     ongoing_project: [],
//     ongoing_research: String,
//     subjects: [],
//     education: [],
//     bio: []
// });

// const Faculty = new mongoose.model("Faculty", facultySchema);







app.get("/", function(req, res){
    res.redirect("/about");
})

app.get("/about", function(req, res){
    res.render("about_page");
})




app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });
  