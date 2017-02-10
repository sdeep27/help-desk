const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github').Strategy;
const api = require('./../config.js');
const github = api.github;
const User = require('./models/userModel.js');
const session = require('express-session')

app.use(session({secret: 'somekindofhash', 
    resave: true,
    saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session())
//if we want secure https additional options needed
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './../client'))); 

passport.use(new GitHubStrategy({
    clientID: github.apiId,
    clientSecret: github.apiSecret,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
   User.findOrCreate({where: {username: profile.username, password: profile.id}}).spread((user, created) =>{
      console.log(profile);
      return cb(null, user);
   })
  }
))

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/', (request, response) => {
  console.log('session details ',request.session.passport.user);
  response.send('hi');
});

app.get('/auth/github/',
  passport.authenticate('github'))
  
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.listen(3000); 

module.exports = app;
/*
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('in local');
    User.findOne({where: {username: username}}, function (err, user) {
      if (err) { 
        console.log('hi', err);
        return done(err); 
      }
      if (!user) { 
        console.log('not User')
        return done(null, false); 
      }
      if (!user.verifyPassword(password)) { 
        console.log('not password')
        return done(null, false); 
      }
      return done(null, user);
    });
  }
));*/
/*
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/error' }), 
  //test redirect, otherwise Login
  function(req, res) {
    res.redirect('/');
});*/

