module.exports = {
	catalogs: async (company, args, { Catalog }) => await Catalog.find({ _id: { $in: company.catalogsIds } })
}