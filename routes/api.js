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
			for (var i = 0; i<ahorse.pictures.length; i++){
		    	if(ahorse.pictures[i].path !== "images/default.jpg"){
		    		var orgFileName = ahorse.pictures[i].path;
					var spot = orgFileName.lastIndexOf(".");
				    var fileType = orgFileName.substr(spot);
				    console.log(fileType);

		    		ahorse.pictures[i].path = 'images/' + ahorse.pictures[i]._id + fileType;
		    		console.log(ahorse.pictures[i].path);
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
	    console.log( req.body.pos)
		var myName = 'images/' + req.body.theUser + "_" + req.body.pos + fileType;
		
		myName = {
			path:  myName,
			pos: req.body.pos
		};
		console.log(myName);

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
	    	console.log(doc.pictures[req.body.pos]._id);
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
						    console.log(fileType);

				    		doc.pictures[i].path = 'images/' + doc.pictures[i]._id + fileType;
				    		console.log(doc.pictures[i].path);
				    	}
				    }
				    return res.json(doc.pictures);
				}
		    );
	    	
	    });

		

		// fs.rename(
		// 	req.files.file.path,
		// 	relPath,
		// 	function(error) {
	 //            if(error) {
		// 	        return res.json("it broke");
		// 	    }

		// 	    Horse.findOneAndUpdate({
		// 	    	_id: req.body.theUser
		// 	    },{
		// 	    	$push: {
		// 	    		pictures:{ 
		// 	    			$each:[myName],
		// 	    			$position: Math.abs(req.body.pos)
		// 	    		}
		// 	    	}
		// 	    },{
		// 	    	new: true
		// 	    }, function(err, doc){
		// 	    	if(err){
		// 	    		console.log(err)
		// 	    		return res.json("There was an error uploading your document");
		// 	    		//TODO: delete file from server.
		// 	    	}
		// 	    	console.log(doc);
		// 	    	return res.json(doc.pictures);
		// 	    });
		// 	}
	 //    );

	})

	.put(function(req, res){
		console.log(req.body);
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
		    	console.log("Check 1");
		    	console.log(doc.pictures);
		    	for(var i = 0; i < doc.pictures.length; i++){
		    		if(req.body.pos < doc.pictures[i].pos){
		    			doc.pictures[i].pos--;
		    			var str = doc.pictures[i].path;
						var n = str.lastIndexOf(".") - 1;
					    var first = str.substr(0,n);
					    var num = Math.abs(str.substr(n,1)) - 1;
					    var last = str.substr(n+1);
					    doc.pictures[i].path = first + num + last;
					    // var oldPath = './public/' + str;
					    // var newPath = './public/' + doc.pictures[i].path;

					  //   fs.rename(oldPath, newPath, function(err){
					  //   	if(err) {
							//     return res.json("it broke changing other files");
							// }
							// console.log(i);
					  //   });
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
						    console.log(fileType);

				    		aDoc.pictures[i].path = 'images/' + aDoc.pictures[i]._id + fileType;
				    		console.log(aDoc.pictures[i].path);
				    	}
				    }
					
					console.log(aDoc.pictures);
					return res.json(aDoc.pictures);
				});
			});
		});
	});


module.exports = router;


