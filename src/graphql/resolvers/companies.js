// Queries
export const getAllCompanies = () => {
	return Company.find()
}

// Mutations
export const addCompany = async (parent, { name, startDate, finishDate }, { Company }) => {
	if (!name || !startDate || !finishDate) { throw new Error('Не все поля заполнены корректно.') }

	const company = await Company.findOne({ name })

	if (company) { throw new Error('Такая кампания уже есть в базе данных.') }
	if (startDate >= finishDate) { throw new Error('Дата начала должна быть раньше даты конца кампании.') }

	return Company.create({ name, startDate, finishDate })
}

export const removeCompany = async (parent, { id }, { Company }) => {
	if (!id) { throw new Error('Некорректно передан идентификатор.') }

	await Company.deleteOne({ _id: id })

	return true
}