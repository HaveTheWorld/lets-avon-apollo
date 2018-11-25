module.exports = {
	company: async (catalog, args, { Company }) => {
		return await Company.findOne({ _id: catalog.companyId })
	},
	images: async (catalog, { limit }, { Image }) => {
		return await Image.find({ _id: { $in: catalog.imagesIds } }).sort({ catalogIndex: 1 }).limit(limit)
	}
}