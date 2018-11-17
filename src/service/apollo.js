const { ApolloServer } = require('apollo-server-express')
const fs = require('fs')
const typeDefs = fs.readFileSync('src/graphql/schema.gql', { encoding: 'utf-8' })
const resolvers = require('../graphql/resolvers')
const { IS_DEV, ENDPOINT_PATH } = require('../service/config')

const User = require('../models/User')
const Company = require('../models/Company')
const Catalog = require('../models/Catalog')
const Image = require('../models/Image')

module.exports = app => {
	const server = new ApolloServer({
		typeDefs,
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