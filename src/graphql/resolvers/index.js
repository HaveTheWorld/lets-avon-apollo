const { GraphQLUpload } = require('graphql-upload')
const DateType = require('./Date')
const Query = require('./Query')
const Mutation = require('./Mutation')
const Company = require('./Company')
const Catalog = require('./Catalog')

module.exports = {
	Upload: GraphQLUpload,
	Date: DateType,
	Query,
	Mutation,
	Company,
	Catalog
}