const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { JWT_SECRET } = require('./config')

function getTokenFromHeader(req) {
	const authHeader = req.headers['authorization']
	if (!authHeader) { return null }

	const token = authHeader.split('Bearer ')[1]
	return token || null
}

exports.authUserMiddleware = async (req, res, next) => {
	const token = getTokenFromHeader(req)
	if (!token) { return next() }

	try {
		const user = await jwt.verify(token, JWT_SECRET)
		if (!await User.countDocuments({ _id: user.id, username: user.username })) {
			return next()
		}
		
		req.currentUser = user
		
		next()
	} catch (error) {
		next()
	}
}