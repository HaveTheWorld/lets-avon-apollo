const { Kind } = require('graphql/language')

module.exports = {
	__parseValue(value) {
		return value // value from the client
	},
	__serialize(value) {
		return value // value sent to the client
	},
	__parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
			return parseInt(ast.value, 10) // ast value is always in string format
		}
		return null
	}
}