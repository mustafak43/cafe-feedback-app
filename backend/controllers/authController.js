const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
	console.log(err.message, err.code);
	
	let errors = { email: '', password: '' };
	
	// incorrect email
	if (err.message === 'Incorrect email') {
		errors.email = 'Email does not exist';
	}
	
	// incorrect password
	if (err.message === 'Incorrect password') {
		errors.password = 'Password is incorrect';
	}
	
	// duplicate error code
	if (err.code === 11000) {
		errors.email = 'Email already exists';
		return errors;
	}
	
	// validation errors
	if (err.message.includes('app validation failed')) {
		Object.values(err.errors).forEach( ({properties}) => {
			errors[properties.path] = properties.message;
		});
	}
	
	return errors;
}

// jwt expiration date, not valid anymore when expires
const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const createToken = (id) => {
	return jwt.sign({ id }, 'most secret key ever produced %32768', {
		expiresIn: maxAge
	});
}

module.exports.signup_post = async (req, res) => {
	const { name, nickname, email, password} = req.body;
	
	try {
		
		const user = await User.create({name, nickname, email, password});
		
		const token = createToken(user._id);
		// here, send the token to the client so that it saves the token to the local storage
		// also giving the token a max age so that it is erased from the local storage when expires
		res.status(201).json({jwt: token, expiresIn: maxAge});
	} 
	catch(err) {
		const errors = handleErrors(err);
		res.status(400).json( {errors} );
	}
}

module.exports.login_post = async (req, res) => {
	const { nickname, password} = req.body;
	
	try {
		const user = await User.login(nickname, password);
		
		const token = createToken(user._id);
		// here, send the token to the client so that it saves the token to the local storage
		// also giving the token a max age so that it is erased from the local storage when expires
		res.status(200).json(user); // {jwt: token, expiresIn: maxAge}
	}
	catch (err) {
		const errors = handleErrors(err);
		
		res.status(400).json( {errors} );
	}
}

module.exports.logout_get = (req, res) => {
	// res.cookie('jwt', '', {maxAge: 1});
	// res.redirect('/'); // homepage
	
	// I guess when you log out you probably don't need this function here
	// to my thinking, you should only delete the cookie stored in secure
	// local storage in flutter and that's it, also redirect to homepage
	// maybe there's more to it than that? try it out
}