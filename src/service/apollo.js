import { ApolloServer } from 'apollo-server-express'
import schema from '../graphql/schema.gql'
import resolvers from '../graphql/resolvers'
import { IS_DEV, ENDPOINT_PATH } from '../service/config'

import User from '../models/User'
import Company from '../models/Company'
import Catalog from '../models/Catalog'
import Image from '../models/Image'

export default app => {
	const server = new ApolloServer({
		typeDefs: schema,
		resolvers,
		context: ({ req }) => ({
			currentUser: req.currentUser,
			User,
			Company,
			Catalog,
			Image
		}),
		playground: IS_DEV
	})
	server.applyMiddleware({ app, path: ENDPOINT_PATH })
}