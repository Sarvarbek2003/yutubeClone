const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	try {
		const { userId, agent } = jwt.verify(req.headers.token, 'SECRET_KEY')

		if(req['headers']['user-agent'] != agent) {
			throw new Error("Token is sent from wrong device!")
		}

		req.userId = userId

		return next()

	} catch(error) {
		res.status(401).json({ message: error.message })
	}
}