import User from '../../models/user'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRE } from '../../service/config'

// Queries
export const user = (parent, args, { req }) => {
	return req.user
}

// Mutations
export const login = async (parent, { username, password }, { req }) => {
	if (!username || !password) { throw new Error('Не все поля заполнены корректно.') }

	const user = await User.findOne({ username })	
	if (!user || !await user.comparePassword(password)) { throw new Error('Неверные имя пользователя или пароль.') }
	
	const payload = { id: user.id, username, isAdmin: user.isAdmin }
	const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE })

	req.user = user
	
	return token
}