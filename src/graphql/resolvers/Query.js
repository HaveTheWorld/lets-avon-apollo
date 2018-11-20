const { requireRole } = require('../../service/require-role')

module.exports = {
	currentUser: (parent, args, { user }) => {
		return user
	},
	users: async (parent, args, { User, user }) => {
		requireRole(user, 'admin')
		return await User.find()
	},
	user: async (parent, { username }, { User, user }) => {
		requireRole(user, 'admin')
		return await User.findOne({ username })
	},
	companies: async (parent, args, { Company }) => {
		return await Company.find()
	},
	currentCompany: async (parent, args, { Company }) => {
		const date = Date.now()
		return await Company.findOne({ startDate: { $lte: date }, finishDate: { $gt: date } })
	},
	catalogs: async (parent, args, { Company, Catalog }) => {
		return await Catalog.find()
	},
	catalog: async (parent, { number, year, name }, { Company, Catalog }) => {
		const company = await Company.findOne({ number, year })
		if (!company) { throw new Error('Неверно указана кампания') }

		return await Catalog.findOne({ name, companyId: company._id })
	}
}