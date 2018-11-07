import { GraphQLUpload } from 'graphql-upload'
import { uploadCatalog } from './resolvers/catalogs'
import { user, login } from './resolvers/users'

export default {
	Upload: GraphQLUpload,
	Query: {
		user
	},
	Mutation: {
		uploadCatalog,
		login
	}
}