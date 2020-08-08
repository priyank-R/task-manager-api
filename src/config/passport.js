const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')



module.exports = function(passport){
    var opts = {}
    try{
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.JWT_SECRET;
}catch(e){
    console.log('Passport error: ',e)
}


    


    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
   // console.log(jwt_payload)
    User.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            console.log('Passport-error: ',err)
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}))
    
}