import { Kind } from 'graphql/language'
import { GraphQLUpload } from 'graphql-upload'
import { getCurrentUser, login } from './resolvers/auth'
import { getAllCompanies, addCompany, removeCompany } from './resolvers/companies'
import { uploadCatalogImage } from './resolvers/images'
import { getAllCatalogs, addCatalog, removeCatalog } from './resolvers/catalogs'

export default {
	Query: {
		getCurrentUser,
		getAllCompanies,
		getAllCatalogs
	},
	Mutation: {
		login,
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