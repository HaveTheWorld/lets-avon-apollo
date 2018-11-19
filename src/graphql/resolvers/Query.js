module.exports = {
	currentUser: (parent, args, { user }) => user,
	companies: async (parent, args, { Company }) => await Company.find(),
	currentCompany: async (parent, args, { Company }) => {
		const date = Date.now()
		return await Company.findOne({ startDate: { $lte: date }, finishDate: { $gt: date } })
	},
	catalogs: async (parent, args, { Company, Catalog }) => await Catalog.find(),
	catalog: async (parent, { number, year, name }, { Company, Catalog }) => {
		const company = await Company.findOne({ number, year })
		if (!company) { throw new Error('Неверно указана кампания') }

		return await Catalog.findOne({ name, companyId: company._id })
	}
}