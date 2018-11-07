import mongoose from 'mongoose'

const { Schema } = mongoose

const CompanySchema = new Schema({
	name: { type: String, match: /^\d{2}-20\d{2}$/, required: true, unique: true },
	startDate: { type: Number, required: true },
	finishDate: { type: Number, required: true }
})

export default mongoose.model('Company', CompanySchema)