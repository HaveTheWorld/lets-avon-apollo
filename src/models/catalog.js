const mongoose = require('mongoose')
const { Schema } = mongoose

const CatalogSchema = new Schema({
	name: { type: String, required: true },
	title: { type: String, required: true },
	companyId: { type: String, required: true },
	count: { type: Number, required: true },
	imagesIds: [
		{ type: String, required: true }
	]
}, {
	versionKey: false
})

module.exports = mongoose.model('Catalog', CatalogSchema)