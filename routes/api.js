var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Horse = mongoose.model('Horse');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/register');
};

//Register the authentication middleware
router.use('/horses', isAuthenticated);

router.route('/horses')
	//gets all horses
	.get(function(req, res){
		Horse.find(function(err, horses){
			if(err){
				return res.json(err);
			}
			return res.json(horses);
		});
	});

module.exports = router;
