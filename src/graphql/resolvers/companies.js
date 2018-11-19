// Queries
exports.companies = async (parent, args, { Company }) => {
	return await Company.find()
}

// Mutations
exports.addCompany = async (parent, { input }, { Company }) => {
	const { number, year, startDate, finishDate } = input
	const company = await Company.findOne({ number, year })

	if (company) { throw new Error('Такая кампания уже существует.') }
	if (startDate >= finishDate) { throw new Error('Дата начала должна быть раньше даты конца кампании.') }

	return await Company.create({ number, year, startDate, finishDate })
}

exports.removeCompany = async (parent, { id }, { Company }) => {
	await Company.deleteOne({ _id: id })
	return true
}