var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');
var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    interest: String,
    adhaar:String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user",userSchema);