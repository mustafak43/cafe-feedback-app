// const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
	// const token = req.cookies.jwt;
	
	// // check if json web token exists & is verified
	// if (token) {
		// jwt.verify(token, 'most secret key ever produced %32768', (err, decodedToken) => {
			// if (err) {
				// console.log(err.message);
				// res.send( {errObject} );
			// } else {
				// console.log(decodedToken);
				// res.send( {authGranted} );
			// }
		// });
	// }
	// else {
		// res.redirect( {errObject} );
	// }
	
	// --------------------------------
	
	// here, instead of cookies being retrieved and processed for verification
	// you'll parse the req for token field's existence and authenticity.
	// - you can have a similar structure like above to check if token exists
	// - else you res.send( {errObject} ) errObject indicating the error, which 
	// later in the application will redirect the user to login page
	// the action that will be taken in the app (redirecting to certain pages)
	// will depend on the response, if there's an error (depending on the error as well, perhaps)
	// it will carry on its action of redirecting to certain page or not 
	// (like redirect to login if its an authentication error etc.)
	
}

// Might not need below middleware
// - you could just save the user credentials when first logged in and display them in Profile page
// check current user
const checkUser = async (req, res, next) => {
	// const token = req.cookies.jwt;
	
	// // check if json web token exists & is verified
	// if (token) {
		// jwt.verify(token, 'most secret key ever produced %32768', async (err, decodedToken) => {
			// if (err) {
				// console.log(err.message);
				// next(); // might need to res.send errObject to continue in the app
			// } else {
				// console.log(decodedToken);
				let user = await User.findById(decodedToken.id);
				// next(); // might need to send res.send authGranted to continue in the app
			// }
		// });
	// }
	// else {
		// 
	// }
}

module.exports = { requireAuth };