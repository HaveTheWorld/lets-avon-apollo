const mongoose = require('mongoose')

const { Schema } = mongoose

const CompanySchema = new Schema({
	number: { type: Number, match: /^\d{2}$/, required: true },
	year: { type: Number, match: /^\d{4}$/, required: true },
	startDate: { type: Date, required: true },
	finishDate: { type: Date, required: true },
	catalogs: [
		{ type: Schema.Types.ObjectId, ref: 'Catalog' }
	]
}, { versionKey: false })

CompanySchema.index({number: 1, year: 1}, { unique: true })

module.exports = mongoose.model('Company', CompanySchema)