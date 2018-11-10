import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRE } from '../../service/config'

// Queries
export const getCurrentUser = (parent, args, { currentUser }) => {
	return currentUser
}

// Mutations
export const loginUser = async (parent, { username, password }, { User }) => {
	if (!username || !password) { throw new Error('Не все поля заполнены корректно.') }

	const user = await User.findOne({ username })	
	if (!user || !await user.comparePassword(password)) {
		throw new Error('Неверные имя пользователя или пароль.')
	}

	const payload = {
		id: user.id,
		username,
		isAdmin: user.isAdmin,
		__typename: 'UserType'
	}
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE })

	return { token }
}