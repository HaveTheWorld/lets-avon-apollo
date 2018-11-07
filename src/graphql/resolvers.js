import { Kind } from 'graphql/language'
import { GraphQLUpload } from 'graphql-upload'
import { uploadCatalog } from './resolvers/catalogs'
import { user, login } from './resolvers/users'
import { companiesList, addCompany, removeCompany } from './resolvers/companies'

export default {
	Query: {
		user,
		companiesList
	},
	Mutation: {
		uploadCatalog,
		login,
		addCompany,
		removeCompany
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