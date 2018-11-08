const mongoose = require('mongoose')
const { Schema } = mongoose

const ImageSchema = new Schema({
	path: { type: String, required: true }
})

module.exports = mongoose.model('Image', ImageSchema)