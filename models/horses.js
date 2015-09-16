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
	pictures: {type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 6']},
	age: Number,
	likes: [{type: Schema.Types.ObjectId, ref: 'Horse', unique: true}],
	dislike: [{type: Schema.Types.ObjectId, ref: 'Horse', unique: true}],
	settings: {
		desired_distance: Number,
		desired_gender: String,
		desired_age_min: Number,
		desired_age_max: Number,
	}
});

function arrayLimit(val) {
  return val.length <= 6;
}

mongoose.model('Horse', horseSchema);