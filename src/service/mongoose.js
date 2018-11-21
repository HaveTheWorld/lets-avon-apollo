const { MONGO_URL, ADMIN_USERNAME, ADMIN_PASSWORD, IS_DEV } = require('./config')
const mongoose = require('mongoose')
const User = require('../models/User')
const { debugMongoose } = require('./debug')

const params = {
	useNewUrlParser: true,
	useCreateIndex: true
}

mongoose.connect(MONGO_URL, params)
	.then(async (info) => {
		try {
			// Check or create first admin user
			if (!await User.findOne({ role: 'admin' })) {
				await User.create({
					username: ADMIN_USERNAME,
					password: ADMIN_PASSWORD,
					role: 'admin',
					canBeRemoved: false
				})
			}

			const { name } = info.connections[0]
			console.log(`[mongoose] Connencted to db @ ${name}`)
			
			IS_DEV && mongoose.set('debug', debugMongoose)
		} catch (error) {
			// Handle error
			console.log(error.message)
		}
	})