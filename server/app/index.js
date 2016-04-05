'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session')
var User = require('../api/users/user.model');

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(session({
    secret: 'secrets'
}));

app.use(function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

app.use(function (req, res, next) {
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
            req.session.userId = user._id;
            console.log("req.session ID is now made!!!", req.session.userId )
            res.status(200).send(user);
        }
    })
    .then(null, next);
});

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