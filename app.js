var express = require('express'),
    bodyParser = require('body-parser'),
    nodemailer =  require('nodemailer'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    user = require('./models/user.js'),
    middleware = require('./middleware');
    
mongoose.connect("mongodb://localhost/eksaath");


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
passport.use(new LocalStrategy(user.authenticate()));//used to configure middleware for login
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    //res.locals.error = req.flash('error');
    //res.locals.success = req.flash('success');
    next();
});

app.set("view engine","ejs");

app.use(express.static(__dirname + '/public'));

var transporter = nodemailer.createTransport({
    service : 'gmail',
    auth: {
        user: 'eksaath.wie@gmail.com',
        pass: 'wehavehackedyou2018'
    },
});

//=========================================================
app.get('/',function(req,res){
    res.render('about');
});

app.get('/login',function(req,res){
    res.render('login');
});

app.post("/login",
    passport.authenticate("local",{
        successRedirect: "/othergrps",
        failureRedirect: "/login"
    }),function(req,res){
        
});

app.post('/signup',function(req,res){
    var reqName = req.body.username,
        pass = req.body.password,
        email = req.body.email;
        console.log(reqName+":"+pass+":"+email);
    var strHtml =  '<h3>Hello, from Eksaath!!</h3>'+
                '<h4>'+ reqName +',your account has been activated.</h4><h4> Registered email '+ email +'</h4><h4>Registered Password'+ pass +'</h4>'+
                '<p> </p>';
    const mailOptions = {
                from: 'eksaath.wie@gmail.com', // sender address
                to: email, // list of receivers
                subject:  'Account Verification By Eksaath ', // Subject line
                html: strHtml// plain text body
            };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err){
            //req.flash('error','Mail not sent check your email!');
            console.log(err);
        }else{
            //req.flash('success','Your mail has been sent!');
            console.log(info);
        }
    });
    
    user.register(new user({username: req.body.username , email: req.body.email , adhaar : req.body.adhaar , interest : req.body.interest}),req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render('login');
       }
       passport.authenticate("local")(req,res,function(){
           //req.flash('success',"Successfully Registered!"+user.username);
           console.log('Authenticate user');
           res.redirect('/othergrps');
       });
    });
});

app.get('/othergrps',middleware.isLoggedIn,function(req,res){
    res.render('othergrps');
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server Started");
});