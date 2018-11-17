const mongoose = require('mongoose')
const { Schema } = mongoose

const ImageSchema = new Schema({
	path: { type: String, required: true, unique: true },
	catalogThumbPath: { type: String },
	catalogFacePath: { type: String },
	catalogIndex: { type: Number }
}, { versionKey: false })

module.exports = mongoose.model('Image', ImageSchema)