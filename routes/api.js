var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Horse = mongoose.model('Horse');
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
		//Add the current user to the likedBy array of the liked user
		Horse.findOneAndUpdate({
			_id: req.body.id
		},{
			$push: { likedBy: req.params.id }
		},{
			upsert: true
		},
		function(err){
			if(err){
				return res.json(err);
			}
			return res.json("liked")
		});
	});

router.route('/settings/:id')
	.put(function(req, res){
		Horse.findOneAndUpdate({
			_id: req.params.id
		},{
			$set:{
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
		console.log("HERE!!!!!");
		console.log(req.body);
		console.log(req.files);

		var str = req.files.file.originalFilename;
		var n = str.lastIndexOf(".");
	    var fileType = str.substr(n);

		var myName = 'images/' + req.body.theUser + "_" + req.body.pos + fileType;
		var relPath = './public/' + myName;
		console.log(myName);

		fs.rename(
			req.files.file.path,
			relPath,
			function(error) {
	            if(error) {
			        return res.json("it broke");
			    }

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
			    		//TODO: delete file from server.
			    	}
			    	console.log(doc);
			    	return res.json("Your picture has been uploaded succesfully!");
			    });
			}
	    );
	});

module.exports = router;


