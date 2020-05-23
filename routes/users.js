var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');


/* GET users listing. */
// router.get('/', function(req, res) {
// 	res.send('respond with a resource');
// });

//register user
router.post('/', async (req, res, next) => {
	console.log(req.body.user, "user registration");
	try {
		var user = await User.create(req.body.user);
		var token = await auth.generateJWT(user);
		console.log(user);
		user.token = token;
		res.status(200).json({
			email: user.email,
			username: user.username,
			token,
			// bio: "I work at statefarm",
			image: user.image,
			bio: user.bio,
			following : user.following
		});
		console.log(token, "token");
	} catch (error) {
		next(error);
	}
});


//login user

router.post('/login', async function (req, res, next) {
	var { email, password } = req.body.user;
	if (!email || !password)
		return res.status(400).json({
			success: false,
			error: 'Email/Password Required'
		});
	try {
		var user = await User.findOne({ email });
		if (!user) return res.status(400).json({ success: false, error: 'Email/Password Required' });
		if (!user.verifyPassword(password))
			return res
				.status(400)
				.json({ success: false, error: 'Email/Password Required' });

		var token = await auth.generateJWT(user);
		console.log(token, "generating token");
		res.status(200).json({
			email: user.email,
			username: user.username,
			token,
			image: user.image,
			bio : user.bio,
			following : user.following
		});
	} catch (error) {
		next(error);
	}
});





module.exports = router;


//alot of changes need to be made in this doc. check first