const { GraphQLUpload } = require('graphql-upload')
const DateType = require('./resolvers/Date')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Company = require('./resolvers/Company')
const Catalog = require('./resolvers/Catalog')

module.exports = {
	Upload: GraphQLUpload,
	Date: DateType,
	Query,
	Mutation,
	Company,
	Catalog
}