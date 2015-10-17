var mongoose = require('mongoose');   
var Horse = mongoose.model('Horse');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.username);
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		Horse.findById(id, function(err, user) {
			// console.log('deserializing user:', user.username);
			done(err, user);
		});
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			username = username.toLowerCase();
			// check in mongo if a user with username exists or not
			Horse.findOne({ 'username' :  username }, 
				function(err, user) {
					// In case of any error, return using the done method
					if (err)
						return done(err);
					// Username does not exist, log the error and redirect back
					if (!user){
						console.log('Horse Not Found with username '+ username);
						return done(err, false);                 
					}
					// Horse exists but wrong password, log the error 
					if (!isValidPassword(user, password)){
						console.log('Invalid Password');
						return done(null, false); // redirect back to login page
					}
					// Horse and password both match, 
					// Update the Horse's last logged in time, latitude, and longitude
					
					Horse.findOneAndUpdate({
						'_id': user._id
					},{
						$set: {
							last_logged: Date.now(),
							location: [req.body.lon, req.body.lat]
						}
					},{
						new: true
					},
						function(err, doc){
							if(err){
								console.log("Error while logging in " + err);
								return done(err);
							}
							// return user from done method
							// which will be treated like success
							return done(null, doc);
						});
				});
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {
			username = username.toLowerCase();
			
			// find a user in mongo with provided username
			Horse.findOne({ 'username' :  username }, function(err, horse) {
				// In case of any error, return using the done method
				if (err){
					console.log('Error in SignUp: '+ err);
					return done(err);
				}
				// already exists
				if (horse) {
					console.log('Horse already exists with username: '+ username);
					return done(done, null);
				} else {
					// if there is no user, create the user
					var newHorse = new Horse();

					var coords = [req.body.lon, req.body.lat];
					// var coords = [118.3333, 34.1000];

					// set the user's local credentials
					newHorse.username = username;
					newHorse.password = createHash(password);
					newHorse.birthday = req.body.birthday;
					// newHorse.settings.desired_distance = 40233.6;
					newHorse.location = coords;
					newHorse.gender = req.body.gender;
					newHorse.age = req.body.age;

					// save the user
					newHorse.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+ err);  
							throw err;  
						}
						console.log(newHorse.username + ' Registration succesful');    

						Horse.findOneAndUpdate({
							_id: newHorse._id
						},{
							$push: { likes: newHorse._id }
						},{
							upsert: true
						},
						function(err){
							if(err){
								console.log("Error with $push to likes array on Sign up: " + err);
								return done(err);
							}
						});

						Horse.findOneAndUpdate({
							_id: newHorse._id
						},{
							$push: { dislikes: newHorse._id }
						},{
							upsert: true
						},
						function(err){
							if(err){
								console.log("Error with $push to dislikes array on Sign up: " + err);
								return done(err);
							}
						});
						
						return done(null, newHorse);
					});
				}
			});
		})
	);
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};