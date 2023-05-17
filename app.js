require('dotenv').config();
const express= require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const multer = require('multer');
const path = require('path');
const { Mongoose } = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// MongoDB 
const mongoose = require("mongoose");
const e = require("express");
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:true,useUnifiedTopology: true});

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
    ongoing_research: String,
    subjects: [],
    education: [],
    bio: [],
    website: String,
    image:{
        data: Buffer,
        contentType: String},
    },
{ collection: 'facultyInfoCollection'
});

const facultyImageSchema = new mongoose.Schema({
   id: Number,
   image:{
        data: Buffer,
        contentType: String},
   },
   { collection: 'facultyImageCollection'

});


const facultyLoginCollection = mongoose.model("facultyLoginCollection", facultyLoginSchema);
const facultyInfoCollection = mongoose.model("facultyInfoCollection", facultySchema);
const facultyImageCollection = mongoose.model("facultyImageCollection", facultyImageSchema);

/* ------------------------------- Set up Disk Storage for Files ----------------------------------------------*/

const Storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req,file,cb) =>{
        cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    },
});

const upload = multer({
    storage: Storage,
}).single('testImage')



/* ------------------------------------------------------------------------------------------------------------*/
// Funtional Code

function splitOnComma(str){
    if(str && typeof str == 'string')
        return (str.split(','));
    else   
        return [];
}


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
    
    // Checking in Existing collection of Info, Not in login credentials
    facultyInfoCollection.findOne({id: req.params.id},function(err,found){
        if(err)
            console.log(err);
        else if(found)
            res.render("compose", {userId: req.params.id, isData: true});
        else
            res.render("compose", {userId: req.params.id, isData: false});
    });   
});

app.post("/login/compose/:id", function(req,res){
    console.log(req.body.linkedin);
    console.log(req.body.website);
    const faculty = new facultyInfoCollection({
        name: req.body.name,
        cabin: req.body.cabin,
        id: req.body.id,
        school: req.body.department,
        email: req.body.email,
        linkedin: req.body.linkedin,
        ongoing_project: req.body.project,
        ongoing_research: req.body.research,
        subjects: splitOnComma(req.body.subject),
        education: splitOnComma(req.body.education),
        bio: splitOnComma(req.body.bio),
        website: req.body.website,
        image: {
            data: req.body.image,
            contentType: 'image/png'
        }
    });

    // const faculty_image = new facultyImageCollection({
    //     id: req.body.id,
    //     image: {
    //         data:req.body.image,
    //         contentType:'image/png'
    //     }
    // });

    faculty.save();
    // faculty_image.save();

    res.redirect("/");
});

app.get("/login/edit/:id", function(req, res){
    
    facultyInfoCollection.findOne({id: req.params.id}, function(err,found){
        if(err)
            console.log(err);
        else if(found)
            res.render("edit", {userId: req.params.id, canEdit: true});
        else    
            res.render("edit", {userId: req.params.id, canEdit: false});
    }); 
    
});


/* Methods for Faculty - Details Inside Page */

app.get("/faculty_page/:id", function(req,res){
    facultyInfoCollection.findOne({id: req.params.id}, function(err, found){
        if(err)
            console.log(err);
        else{
            res.render("faculty_detail", {
                id: found.id, 
                name: found.name,
                department: found.school,
                cabin: found.cabin,
                linkedin: found.linkedin,
                email: found.email,
                website: found.website,
                subject: found.subjects,
                research: found.ongoing_research,
                project: found.ongoing_project,
                education: found.education,
                bio: found.bio,
                // image: found.image
                //
            });
        }
    });
    
});






/* --------------------------------------------------- */

app.listen(process.env.PORT || 3001, function() {
    console.log("Server started on port 3001");
  });
  