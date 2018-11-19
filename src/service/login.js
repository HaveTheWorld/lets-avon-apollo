const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { JWT_SECRET, JWT_EXPIRE } = require('./config')

module.exports = async (req, res) => {
	const { username, password } = req.body
	if (!username || !password) {
		return res.status(400).send({ error: { message: 'Не все поля заполнены корректно.' } })
	}

	const user = await User.findOne({ username })
	if (!user || !await user.comparePassword(password)) {
		return res.status(401).send({ error: { message: 'Неверные имя пользователя или пароль.' } })
	}

	const authData = {
		token: await jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE }),
		expires: Date.now() + JWT_EXPIRE * 1000
	}
	
	res.send(authData)
}