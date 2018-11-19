const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../../service/config')

// Queries
exports.currentUser = (parent, args, { user }) => {
	return user
}

// Mutations
exports.loginUser = async (parent, { username, password }, { User }) => {
	const user = await User.findOne({ username })
	if (!user || !await user.comparePassword(password)) {
		throw new Error('Неверные имя пользователя или пароль.')
	}

	const loginData = {
		user,
		token: await jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE }),
		expires: Date.now() + JWT_EXPIRE * 1000
	}
	
	return loginData
}