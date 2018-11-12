// Queries
export const getAllCompanies = (parent, args, { Company }) => {
	return Company.find()
}

// Mutations
export const addCompany = async (parent, { number, year, startDate, finishDate }, { Company }) => {
	// const company = await Company.findOne({ number, year })

	// if (company) { throw new Error('Такая кампания уже есть в базе данных.') }
	if (startDate >= finishDate) { throw new Error('Дата начала должна быть раньше даты конца кампании.') }

	return Company.create({ number, year, startDate, finishDate })
}

export const removeCompany = async (parent, { id }, { Company }) => {
	if (!id) { throw new Error('Некорректно передан идентификатор.') }

	await Company.deleteOne({ _id: id })

	return true
}