import { ApolloServer } from 'apollo-server-express'
import schema from '../graphql/schema.gql'
import resolvers from '../graphql/resolvers'
import { IS_DEV, ENDPOINT_PATH } from '../service/config'

export default app => {
	const server = new ApolloServer({
		typeDefs: schema,
		resolvers,
		playground: IS_DEV
	})
	server.applyMiddleware({ app, path: ENDPOINT_PATH })
}