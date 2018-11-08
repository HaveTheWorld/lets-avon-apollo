const mongoose = require('mongoose')
const { Schema } = mongoose

const CatalogSchema = new Schema({
	name: { type: String, match: /^[a-z]+$/, required: true },
	title: { type: String, match: /^[A-Za-zА-Яа-я ]+$/, required: true },
	company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
	face: { type: Schema.Types.ObjectId, ref: 'Image', required: true },
	thumbnails: [
		{ type: Schema.Types.ObjectId, ref: 'Image' }
	],
	originals: [
		{ type: Schema.Types.ObjectId, ref: 'Image' }
	]
})

module.exports = mongoose.model('Catalog', CatalogSchema)