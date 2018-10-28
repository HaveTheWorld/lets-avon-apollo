import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const { Schema } = mongoose

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false }
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

export default mongoose.model('User', UserSchema)