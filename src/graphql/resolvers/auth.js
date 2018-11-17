const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../../service/config')

// Queries
exports.getCurrentUser = (parent, args, { currentUser }) => {
	return currentUser
}

// Mutations
exports.loginUser = async (parent, { username, password }, { User }) => {
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