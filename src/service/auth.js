import jwt from 'jsonwebtoken'
import User from '../models/User'
import { JWT_SECRET } from './config'

function getTokenFromHeader(req) {
	const authHeader = req.headers['authorization']
	if (!authHeader) { return null }

	const token = authHeader.split('Bearer ')[1]
	return token || null
}

export const authUserMiddleware = async (req, res, next) => {
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