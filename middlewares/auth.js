var jwt = require('jsonwebtoken');

exports.generateJWT = async (user) => {
	try {
		var token = await jwt.sign({ userId: user.id }, 'keyboardcat');
		return token;
	} catch (error) {
		return error;
	}
};

exports.verifyToken = async (req, res, next) => {
	var token = req.headers.authorization || '';
	try {
		if (token) {
			var payload = await jwt.verify(token, 'keyboardcat');
            console.log(payload);
            var user = {
                userId : payload.userId, 
                token: token
            }
			req.user = user;
			next();
		} else {
			res.status(401).json({ success: false, error: 'Unauthorized' }); //403 not logged in
		}
	} catch (error) {
		next(error);
	}
};