import User from '../../models/user'

// Queries
export const users = () => {
	return User.find()
}