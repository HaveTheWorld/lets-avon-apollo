const { Kind } = require('graphql/language')
const { GraphQLUpload } = require('graphql-upload')
const { currentUser } = require('./resolvers/auth')
const { getAllCompanies, addCompany, removeCompany } = require('./resolvers/companies')
const { uploadCatalogImage } = require('./resolvers/images')
const { getAllCatalogs, getCatalog, addCatalog, removeCatalog } = require('./resolvers/catalogs')

module.exports = {
	Query: {
		currentUser,
		getAllCompanies,
		getAllCatalogs,
		getCatalog
	},
	Mutation: {
		addCompany,
		removeCompany,
		uploadCatalogImage,
		addCatalog,
		removeCatalog
	},
	Upload: GraphQLUpload,
	Date: {
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
}