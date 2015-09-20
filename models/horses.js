var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var horseSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true}, //hash created from password
	created_at: {type: Date, default: Date.now},
	last_logged: {type: Date, default: Date.now},
	latitude: String,
	longitude: String,
	bio: String,
	pictures: {
		picture_one: {type: String, default: 'images/default.jpg'},
		picture_two: {type: String, default: null},
		picture_three: {type: String, default: null},
		picture_four: {type: String, default: null},
		picture_five: {type: String, default: null},
		picture_six: {type: String, default: null}
	},
	birthday: Date,
	likes: [{type: Schema.Types.ObjectId, ref: 'Horse', unique: true}],
	dislike: [{type: Schema.Types.ObjectId, ref: 'Horse', unique: true}],
	settings: {
		desired_distance: {type: Number, default: 25},
		desired_gender: {type: String, default: 'both'},
		desired_age_min: {type: Number, default: 18},
		desired_age_max: {type: Number, default: 25}
	}
});

function arrayLimit(val) {
  return val.length <= 6;
}

mongoose.model('Horse', horseSchema);