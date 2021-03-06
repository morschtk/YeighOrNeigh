var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Horse = mongoose.model('Horse');
var Match = mongoose.model('Match');
var connectMongo = require("connect-mongo");
var fs = require('fs');

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
//Converts to radians
		function toRad(num) {
		  return num * Math.PI / 180;
		}
		//Calculates distance from lat1,lon1 to lat2,lon2 and returns the distance.
		function calculateDistance(lat1, lon1, lat2, lon2) {
		  var R = 3961; //miles		//6371; // km
		  var dLat = toRad((lat2 - lat1));
		  var dLon = toRad((lon2 - lon1));
		  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
		          Math.sin(dLon / 2) * Math.sin(dLon / 2);
		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		  var d = R * c;
		  return d;
		}
				// horseService
router.route('/currHorse')
	//Update users longitude and latitude
	.put(function(req, res){

		Horse.findOneAndUpdate({
			_id: req.body.id
		},{
			$set: {location: [req.body.lon, req.body.lat]}
		},{
			new: true
		}, function(err, ahorse){

			ahorse.miles_away = "1 mile";
			for (var i = 0; i<ahorse.pictures.length; i++){
		    	if(ahorse.pictures[i].path !== "images/default.jpg"){
		    		var orgFileName = ahorse.pictures[i].path;
					var spot = orgFileName.lastIndexOf(".");
				    var fileType = orgFileName.substr(spot);

		    		ahorse.pictures[i].path = 'images/' + ahorse.pictures[i]._id + fileType;
		    	}
		    }

			return res.json(ahorse);
		});
	});

				// potentialService
router.route('/potentialHorses')
//gets all horses that match the current users search criteria
	.put(function(req, res){

		// $maxDistance is in meters, convert to miles
		Horse.find( { $and: [{ location :
		        { $near :
		          { $geometry :
		             { type : "Point" ,
		               coordinates : [  req.body.lon , req.body.lat ] } ,
		        	   $maxDistance : req.body.theDesDist //17702.8
		   		  }
		      	}
	      	},{
	      		_id: {
	      			$nin: req.body.theLikes
	      		}
	      	},{
	      		_id: {
	      			$nin: req.body.theDislikes
	      		}
	      	},{
	      		gender: {
	      			$in: req.body.theDesGender
	      		}
	      	},{
	      		age: {
	      			$lte: req.body.theMaxAge
	      		}
	      	},{
	      		age: {
	      			$gte: req.body.theMinAge
	      		}
	      	}
	    ]} , function(err, result) {
	    	if(err){
	    		console.log(err);
	    		var aError = {
	    			message: "An error occured while finding some users, please try again later."
	    		};
	    		return res.json(aError);
	    	}else if(result == undefined){
	    		var noResults = {
	    			message: "There are no horses in your area at this time..."
	    		};
	    		return res.json(noResults);
	    	}else{
			for(var i = 0; i < result.length; i++){
				var theDistance = calculateDistance(req.body.lat, req.body.lon, result[i].location[1], result[i].location[0]);
				//Round distance
				var distArray = theDistance.toString().split(".");
				if(distArray[0] < 2){
					result[i].miles_away = "1 mile";
				}else{
					result[i].miles_away = distArray[0] + " miles";
				}
				result[i].password = "";

					for (var n = 0; n<result[i].pictures.length; n++){
				    	if(result[i].pictures[n].path !== "images/default.jpg"){
				    		var orgFileName = result[i].pictures[n].path;
							var spot = orgFileName.lastIndexOf(".");
						    var fileType = orgFileName.substr(spot);

				    		result[i].pictures[n].path = 'images/' + result[i].pictures[n]._id + fileType;
				    	}
				    }

			}
			return res.json(result);
		}



		});
	});

		//dislikeService
router.route('/dislike/:id')
	.put(function(req,res){
		//Create likedBy array
		Horse.findOneAndUpdate({
			_id: req.params.id
		},{
			$push: { dislikes: req.body.id }
		},{
			upsert: true
		},
		function(err){
			if(err){
				return res.json(err);
			}
			return res.json("disliked");
		});
	});

		//likeService
router.route('/like/:id')
	.put(function(req,res){
		//Add the liked user to the current users liked array
		Horse.findOneAndUpdate({
			_id: req.params.id
		},{
			$push: { likes: req.body.id }
		},{
			upsert: true
		},
		function(err){
			if(err){
				return res.json(err);
			}
		});

		Horse.find({
			$and: [
				{ _id: req.body.id},
				{ likes: req.params.id}
			]
		}, function(err, doc){
			if(err){
				console.log("Error liking the user");
				console.log(err);
			}
			if (doc.length == 0) {
				var matchStats = {
					message: false
				};
				return res.json(matchStats);

			} else if (doc.length == 1) {
				//insert into match collection
				var aMatch = new Match();
				aMatch.users = [req.params.id, req.body.id];

				aMatch.save(function(err){
					if(err){
						console.log("There was an error creating the match");
						console.log(err);
						return res.json("error creating match");
					}

					var matchedOther = {
						_horse: req.params.id,
						_match: aMatch._id,
					}
//push matched object to other user
					Horse.findOneAndUpdate({
						_id: req.body.id
					},{
						$push:{ matched: matchedOther }
					},function(err, aDoc){
						if(err){
							console.log("There was an error pushing matched object to other user");
						}
					});

					var matchedCurr = {
						_horse: req.body.id,
						_match: aMatch._id,
					}

					Horse.findOneAndUpdate({
						_id: req.params.id
					},{
						$push:{ matched: matchedCurr }
					},{
						new: true
					},function(err, currHorse){
						if(err){
							console.log("There was an error pushing matched object to current user");
						}

						var matchStats = {
							message: true,
							horse: currHorse
						};
						return res.json(matchStats);
					});
				});
			}
		});
	});

router.route('/settings/:id')
	.put(function(req, res){
		Horse.findOneAndUpdate({
			_id: req.params.id
		},{
			$set:{
				bio: req.body.bio,
				'settings.desired_distance': req.body.maxDistance,
				'settings.desired_gender': req.body.desGender,
				'settings.desired_age_min': req.body.minAge,
				'settings.desired_age_max': req.body.maxAge
			}
		}, function(err, ahorse){
			if(err){
				console.log('error updating users settings: ' + err);
			}
			return res.json(ahorse.username + " settings have been changed.");
		});
	});

router.route('/images')
	.post(function(req, res){
		var str = req.files.file.originalFilename;
		var n = str.lastIndexOf(".");
	    var fileType = str.substr(n);
		var myName = 'images/' + req.body.theUser + "_" + req.body.pos + fileType;

		myName = {
			path:  myName,
			pos: req.body.pos
		};

		Horse.findOneAndUpdate({
	    	_id: req.body.theUser
	    },{
	    	$push: {
	    		pictures:{
	    			$each:[myName],
	    			$position: Math.abs(req.body.pos)
	    		}
	    	}
	    },{
	    	new: true
	    }, function(err, doc){
	    	if(err){
	    		console.log(err)
	    		return res.json("There was an error uploading your document");
	    	}
	    	var theFile = 'images/' + doc.pictures[req.body.pos]._id + fileType;
	    	var relPath = './public/' + theFile;
	    	fs.rename(
				req.files.file.path,
				relPath,
				function(error) {
		            if(error) {
				        return res.json("it broke");
				    }
				    for (var i = 0; i<doc.pictures.length; i++){
				    	if(doc.pictures[i].path !== "images/default.jpg"){
				    		var orgFileName = doc.pictures[i].path;
							var spot = orgFileName.lastIndexOf(".");
						    var fileType = orgFileName.substr(spot);
				    		doc.pictures[i].path = 'images/' + doc.pictures[i]._id + fileType;
				    	}
				    }
				    return res.json(doc.pictures);
				}
		    );

	    });

	})

	.put(function(req, res){
		var relPath = './public/' + req.body.path;

		var idAsPath = req.body.path;
		var spot = idAsPath.lastIndexOf(".");
	    var withOut_FileType = idAsPath.substr(0, spot);
	    var spot = withOut_FileType.lastIndexOf("/");
	    var justID = withOut_FileType.substr(spot+1);

		fs.unlink(relPath, function(error){
			if(error) {
			    return res.json("it broke");
			}

			Horse.findOneAndUpdate({
				_id: req.body.user
			},{
				$pull: {pictures: {_id: justID}}
			},{
				new: true
			}, function(err, doc){
				if(err){
		    		console.log(err)
		    		return res.json("There was an error uploading your document");
		    		//TODO: delete file from server.
		    	}
		    	for(var i = 0; i < doc.pictures.length; i++){
		    		if(req.body.pos < doc.pictures[i].pos){
		    			doc.pictures[i].pos--;
		    			var str = doc.pictures[i].path;
						var n = str.lastIndexOf(".") - 1;
					    var first = str.substr(0,n);
					    var num = Math.abs(str.substr(n,1)) - 1;
					    var last = str.substr(n+1);
					    doc.pictures[i].path = first + num + last;
		    		}
		    	}
		    	Horse.findOneAndUpdate({
					_id: doc._id
				},{
					pictures: doc.pictures
				},{
					new: true
				},function(aError, aDoc){
					if(aError){
						console.log("There is some error going on");
						console.log(aError);
						return res.json("There was an error changing other documents")
					}

			    for (var i = 0; i<aDoc.pictures.length; i++){
			    	if(aDoc.pictures[i].path !== "images/default.jpg"){
			    		var orgFileName = aDoc.pictures[i].path;
						var spot = orgFileName.lastIndexOf(".");
					    var fileType = orgFileName.substr(spot);
			    		aDoc.pictures[i].path = 'images/' + aDoc.pictures[i]._id + fileType;
			    	}
			    }

					return res.json(aDoc.pictures);
				});
			});
		});
	});


router.route('/matches/:id')
	.get(function(req,res){
		Horse.findOne({
			_id: req.params.id
		}).populate('matched._horse')
		.populate('matched._match')
		.exec(function(err, currHorse){
			if(err){
				console.log(err);
				return "There was an error getting your matches";
			}
		    for (var i = 0; i< currHorse.matched.length; i++){
		    	if(currHorse.matched[i]._horse.pictures[0].path !== "images/default.jpg"){
		    		var orgFileName = currHorse.matched[i]._horse.pictures[0].path;
					var spot = orgFileName.lastIndexOf(".");
				    var fileType = orgFileName.substr(spot);

		    		currHorse.matched[i]._horse.pictures.path = 'images/' + currHorse.matched[i]._horse.pictures[0]._id + fileType;
		    	}else{
		    		currHorse.matched[i]._horse.pictures.path = "images/default.jpg";
		    	}
		    }
			return res.json(currHorse);
		})
	});

router.route('/messages/:id')
	.get(function(req, res) {
		Match.findOne({
			_id: req.params.id
		}).populate('users')
		.exec(function(err, theMatch) {
			if (err) {
				console.log(err);
				return "There was an error getting this match";
			}
			var theMessages = [];
			for (var i = 0; i < theMatch.messages.length; i++) {
				if (theMatch.messages[i].created_by.toString() == theMatch.users[0]._id.toString()) {
					var aMessage = {
						id: theMatch.messages[i]._id,
						createdAt: theMatch.messages[i].created_at,
						createdBy: theMatch.messages[i].created_by,
						text: theMatch.messages[i].message,
						displayName: theMatch.users[0].username,
						picture: theMatch.users[0].pictures[0].path
					};
				} else {
					var aMessage = {
						id: theMatch.messages[i]._id,
						createdAt: theMatch.messages[i].created_at,
						createdBy: theMatch.messages[i].created_by,
						text: theMatch.messages[i].message,
						displayName: theMatch.users[1].username,
						picture: theMatch.users[1].pictures[0].path
					};
				}
				theMessages.push(aMessage);
			}
			return res.json(theMessages);
		})
	})
	.post(function(req, res) {
		Match.findOneAndUpdate({
			_id: req.params.id
		},{
			$push: {messages: req.body}
		},{
			upsert: true
		}, function(err) {
			if (err) {
				console.log(err);
				return "There was an error posting this message";
			}
			res.json('Created message');
		});
	})


module.exports = router;
