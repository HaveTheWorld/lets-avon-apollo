const mongoose = require('mongoose')
const User = require('../models/User')
const { MONGO_URL, ADMIN_USERNAME, ADMIN_PASSWORD } = require('./config')

const params = {
	useNewUrlParser: true,
	useCreateIndex: true
}

mongoose.connect(MONGO_URL, params)
	.then(async (info) => {
		try {
			const admin = await User.findOne({ isAdmin: true })
			if (!admin) {
				await User.create({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD, isAdmin: true })
			}
			const { name } = info.connections[0]
			console.log(`[mongoose] Connencted to db @ ${name}`)
		} catch (error) {
			// Handle error
			console.log(error.message)
		}
	})