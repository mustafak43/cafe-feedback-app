const mongoose = require('mongoose');
// const ObjectId = require('mongodb').ObjectId;

const commentSchema = new mongoose.Schema({
	_userId: {
		type: String,
		required: [true, "Missing user id"]
	},
	_productId: {
		type: String,
		required: [true, "Missing product id"]
	},
	updated: {
		type: Date,
		default: Date.now
	},
	text: {
		type: String,
		required: [true, "Missing comment"]
	},
	rate: {
		type: Number,
		required: [true, "Missig rating"],
		min: 1,
		max: 5
	}
},
/*{
	timestamps: true
}*/);

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
