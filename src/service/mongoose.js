const colors = require('colors')
const mongoose = require('mongoose')
const User = require('../models/User')
const { MONGO_URL, ADMIN_USERNAME, ADMIN_PASSWORD, IS_DEV } = require('./config')

const params = {
	useNewUrlParser: true,
	useCreateIndex: true
}

function collapseArrays(query) {
	return Object.entries(query).reduce((acc, [key, value]) => {
		if (value.constructor.name === 'Object') {
			acc[key] = collapseArrays(value)
		} else if (Array.isArray(value) && value.every(item => {
			return item.toString().length === 24 && /^[a-z0-9]+$/.test(item)
		})) {
			const replaced = 
			acc[key] = [`ObjectIds: ${value.length}`]
		} else {
			acc[key] = value
		}
		return acc
	}, {})
}

mongoose.connect(MONGO_URL, params)
	.then(async (info) => {
		try {
			// Check or create first admin user
			const admin = await User.findOne({ role: 'admin' })
			if (!admin) {
				await User.create({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD, role: 'admin' })
			}

			const { name } = info.connections[0]
			console.log(`[mongoose] Connencted to db @ ${name}`)
			
			// Development debugging
			IS_DEV && mongoose.set('debug', function (collectionName, method, query, doc) {
				query = JSON.stringify(collapseArrays(query)).cyan
				console.log(`${'[mongoose]'.magenta} ${collectionName.red}.${method.yellow}(${query})`)
			})
		} catch (error) {
			// Handle error
			console.log(error.message)
		}
	})