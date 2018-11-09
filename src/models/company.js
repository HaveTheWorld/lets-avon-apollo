import mongoose from 'mongoose'

const { Schema } = mongoose

const CompanySchema = new Schema({
	name: { type: String, match: /^\d{2}-20\d{2}$/, required: true, unique: true },
	startDate: { type: Date, required: true },
	finishDate: { type: Date, required: true },
	catalogs: [
		{ type: Schema.Types.ObjectId, ref: 'Catalog' }
	]
})

export default mongoose.model('Company', CompanySchema)