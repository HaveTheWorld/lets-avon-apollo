import jwt from 'jsonwebtoken'
import User from '../models/User'
import { JWT_SECRET } from './config'

function getTokenFromBearer(req) {
	const authHeader = req.headers['authorization']
	if (!authHeader) { return null }

	const token = authHeader.split('Bearer ')[1]
	return token || null
}

export const putUserToReq = async (req, res, next) => {
	console.log(req.headers)
	const token = getTokenFromBearer(req)
	if (!token) { return next() }

	try {
		const user = await jwt.verify(token, JWT_SECRET)
		if (!await User.countDocuments({ _id: user.id, username: user.username })) { return next() }
		
		req.user = user
		next()
	} catch (error) {
		next()
	}
}