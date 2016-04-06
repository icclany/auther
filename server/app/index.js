'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session')
var User = require('../api/users/user.model');
var passport = require('passport')

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(session({
    secret: 'secrets'
}));

app.use(passport.initialize());
app.use(passport.session());

// Google authentication and login 
app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after Google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/', // or wherever
    failureRedirect : '/login' // or wherever
  })
);

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
    new GoogleStrategy({
        clientID: '436807213556-r1lford0gffkfh3v3v095h3cfagqqu76.apps.googleusercontent.com',
        clientSecret: 'FLW8xaYAhrozdT92Xi9AUVD8',
        callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
    },
    // Google will send back the token and profile
    function (token, refreshToken, profile, done) {
        User.findOne({ 'google.id' : profile.id }, function (err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err) return done(err);
            // if the user is found, then log them in
            if (user) {
                console.log('found user')
                console.log(user)
                // User has account
                return done(null, user); 
            } else {
                console.log("making new user")
                 // Make new user
                var newUser = new User();
                // Set Google info
                newUser.google.id = profile.id;                  
                newUser.google.token = token;       
                newUser.google.name = profile.displayName; 
                newUser.google.email = profile.emails[0].value; 
                // Set User info
                newUser.email = newUser.google.email; 
                newUser.name = newUser.google.name; 
                newUser.photo = profile.photos[0].value; 

                return newUser.save(function(err) {
                    if (err) done(err);
                    else done(null, newUser);
                })
                }
        })
    })
    )

passport.serializeUser(function(user, done) {
    done(null, user._id);
})

passport.deserializeUser(function(id, done) {
    User.findById(id, done);
})
// --- in verification callback { id: '108932850528318006845',
//   displayName: 'Laura Weiner',
//   name: { familyName: 'Weiner', givenName: 'Laura' },
//   emails: [ { value: 'lw62886@gmail.com', type: 'account' } ],
//   photos: [ { value: 'https://lh4.googleusercontent.com/-uTUvFZZXb30/AAAAAAAAAAI/AAAAAAAAAEw/mydOh9Jbwlk/photo.jpg?sz=50' } ],
//   gender: 'female',
//   provider: 'google',



app.use(function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

app.use(function (req, res, next) {
    console.log("REQ.USER IS HEREEEEEEEEEEEEEEEEEEEEEE")
    console.log(req.user)
    console.log('session', req.session);
    next();
});

app.use(require('./statics.middleware'));


app.post('/login', function (req, res, next) {
    User.findOne({
        email: req.body.email,
        password: req.body.password
    })
    .exec()
    .then(function (user) {
        if (!user) {
            res.sendStatus(401);
        } else {
            req.session.user = user;
            console.log("req.session ID is now made!!!", req.session.user )
            res.status(200).send(user);
        }
    })
    .then(null, next);
});

app.use('/auth/me', function (req, res, next){
    if (req.session.user){
        res.status(200).json(req.session.user) 
    }
    else if (req.user){
        res.status(200).json(req.user)       
    } else {
        res.sendStatus(404)
    }
    next();
})

app.use('/logout', function(req, res, next) {
	console.log("printing req.session")
	console.log(req.session)
		// End the current session
	req.session.destroy();
	console.log("logging out")
	// Set key to null/undefined
	req.session = null;
	// Delete a key?
	console.log(req.session)
	res.sendStatus(200);
})

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

module.exports = app;