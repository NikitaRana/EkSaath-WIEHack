var express = require('express'),
    bodyParser = require('body-parser'),
    nodemailer =  require('nodemailer'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');
    
mongoose.connect("mongodb://localhost/change_incident");

var app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(require('express-session')({
    secret : "User",
    resave : false,
    saveUninitialized  : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine","ejs");

app.get('/',function(req,res){
    res.render('about');
});



app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server Started");
});