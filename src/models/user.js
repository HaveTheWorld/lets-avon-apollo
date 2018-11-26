const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Schema } = mongoose

const UserSchema = new Schema({
	username: { type: String, match: /^[A-Za-z0-9 \-]{2,15}$/, required: true, unique: true },
	password: { type: String, minLength: 5, maxLength: 32, required: true },
	role: { type: String, enum: ['user', 'editor', 'admin'], default: 'user' },
	isRootAdmin: { type: Boolean },
}, {
	versionKey: false
})

UserSchema.pre('save', async function(next) {
	if (!this.isModified('password')) { return next() }

	try {
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(this.password, salt)
		this.password = hash
		next()
	} catch (error) {
		next(error)
	}
})

UserSchema.methods.comparePassword = async function(password) {
	return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)