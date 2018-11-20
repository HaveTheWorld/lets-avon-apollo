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
		context: async ({ req }) => {

			// Development debugging
			if (IS_DEV) {
				const colors = require('colors')
				const { operationName } = req.body
				
				if (!operationName) { return }

				const bgcolor
					= /Query$/.test(operationName) ? 'bgGreen'
					: /Mutation$/.test(operationName) ? 'bgYellow'
					: 'bgWhite'

				console.log(`operation: ${req.body.operationName}`[bgcolor].black)
			}

			return {
				user: req.user && await User.findById(req.user.id)/* : null*/,
				User,
				Company,
				Catalog,
				Image				
			}
		},
		playground: IS_DEV
	})
	server.applyMiddleware({ app, path: ENDPOINT_PATH })
}