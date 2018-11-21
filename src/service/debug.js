let colors

exports.debugApollo = (req, user) => {
	colors = colors || require('colors')

	const { operationName } = req.body	
	if (!operationName) { return }

	const role = user ? user.role : 'unauthorized'
	const operationBgColor
		= /Query$/.test(operationName) ? 'bgGreen'
		: /Mutation$/.test(operationName) ? 'bgYellow'
		: 'bgWhite'

	console.log(`${operationName}`[operationBgColor].black, `${role}`.bgWhite.black)
}

exports.debugMongoose = (collectionName, method, query, doc) => {
	colors = colors || require('colors')

	query = JSON.stringify(collapseArrays(query)).cyan	
	console.log(`${'[mongoose]'.magenta} ${collectionName.red}.${method.yellow}(${query})`)
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