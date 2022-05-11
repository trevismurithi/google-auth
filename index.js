const express = require('express');
const passport = require('passport');
require('dotenv/config');

const app = express();
const port = 3000;

app.get('/',(req,res)=>{
    res.send("Hello World");
});

var GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done,) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));

app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
    }));

app.get('/auth/google/success',(req,res)=>{
    res.send("success");
});

app.get('/auth/google/failure', (req, res) => {
    res.send("failure");
});

app.listen(port,()=>{
    console.log('listening to port 3000');
})