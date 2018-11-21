const { IS_DEV, ENDPOINT_PATH } = require('./config')
const { ApolloServer } = require('apollo-server-express')
const fs = require('fs')
const typeDefs = fs.readFileSync('src/graphql/schema.gql', { encoding: 'utf-8' })
const resolvers = require('../graphql/resolvers')
const models = require('../models')
const { requireRole } = require('./require-role')
const { debugApollo } = require('./debug')

module.exports = app => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req, res }) => {
			const user = req.user && await models.User.findById(req.user.id)

			IS_DEV && debugApollo(req, user)

			return {
				user,
				setCookie: (...args) => res.cookie(...args),
				requireRole: requireRole(user),
				...models
			}
		},
		playground: IS_DEV
	})
	server.applyMiddleware({ app, path: ENDPOINT_PATH })
}