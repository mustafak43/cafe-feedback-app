const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter a name'],
		minLength: [3, 'Minimum name is 3 characters long'],
		max: [20, 'Maximum name is 20 characters long']
	},
	nickname:  {
		type: String,
		required: [true, 'Please enter a nickname'],
		unique: true,
		lowercase: true,
		min: [3, 'Minimum nickname is 3 characters long'],
		max: [20, 'Maximum nickname is 20 characters long']
	},
	email: {
		type: String,
		required: [true, 'Please enter an email'],
		unique: true,
		lowercase: true,
		validate: [isEmail, 'Please enter a valid email']
	},
	password: {
		type: String,
		required: [true, 'Please enter a password'],
		minLength: [6, 'Minimum password is 6 characters long'],
		maxLength: [32, 'Maximum password is 32 characters long']
	},
});

// fire a function before doc is saved to db
userSchema.pre('save', async function (next) {
	// hash the password
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	
	next();
});

// static method to login user
userSchema.statics.login = async function(nickname, password) {
	const user = await this.findOne({ nickname });
	
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		
		if(auth) {
			return user;
		}
		throw Error('Incorrect password');
	}
	throw Error('Incorrect nickname');
}

const User = mongoose.model('users', userSchema);

module.exports = User;