module.exports = {
	catalogs: async (company, args, { Catalog }) => {
		return await Catalog.find({ _id: { $in: company.catalogsIds } })
	}
}