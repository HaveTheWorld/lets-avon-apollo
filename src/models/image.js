const mongoose = require('mongoose')
const { Schema } = mongoose

const ImageSchema = new Schema({
	path: { type: String, required: true, unique: true }
})

module.exports = mongoose.model('Image', ImageSchema)