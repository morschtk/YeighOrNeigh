var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var horseSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true}, //hash created from password
	gender: {type: String, default: null},
	age: {type: Number, default: 18},
	created_at: {type: Date, default: Date.now},
	last_logged: {type: Date, default: Date.now},
	location: {
		index: '2dsphere',
		type: [Number]
	},
	miles_away: String,
	bio: String,
	pictures: {
		type: [{
			path: String,
			pos: Number
		}], 
		validate: arrayLimit
	},
	birthday: Date,
	likes: [{type: Schema.Types.ObjectId, ref: 'Horse', unique: true}],
	dislikes: [{type: Schema.Types.ObjectId, ref: 'Horse', unique: true}],
	settings: {
		desired_distance: {type: Number, default: 40233.67719716111},
		desired_gender: {type: String, default: 'both'},
		desired_age_min: {type: Number, default: 18},
		desired_age_max: {type: Number, default: 25}
	},
	matched: [{
		_horse: {type: Schema.Types.ObjectId, ref: 'Horse'},
		_match: {type: Schema.Types.ObjectId, ref: 'Match'},
		created_at: {type: Date, default: Date.now}
	}]
});

var matchSchema = new Schema({
	users: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Horse'
		}],
		validate: userMessageLimit
	},
	messages:[{
		created_by: {type: Schema.Types.ObjectId, ref: 'Horse'},
		created_at: {type: Date, default: Date.now},
		message: {type: String, default: null},
	}]
});

function arrayLimit(val) {
  return val.length <= 6;
}

function userMessageLimit(val) {
  return val.length <= 2;
}

mongoose.model('Match', matchSchema);
mongoose.model('Horse', horseSchema);