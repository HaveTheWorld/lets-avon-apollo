import del from 'del'

// Queries
export const getAllCatalogs = async (parent, { current }, { Company, Catalog }) => {
	let find = {}

	if (current) {
		const date = Date.now()
		const currentCompany = await Company.findOne({ startDate: { $lte: date }, finishDate: { $gt: date } })
		find = { company: currentCompany._id }
	}

	return Catalog.find(find)
}

export const getCatalog = async (parent, { company, name }, { Company, Catalog }) => {
	const existedCompany = await Company.findOne({ name: company })

	if (!existedCompany) { throw new Error('Неверно указана кампания') }

	return Catalog.findOne({ name, company: existedCompany._id }).populate('originals thumbnails')
}

// Mutations
export const addCatalog = async (parent, { catalog, title, company, images }, { Company, Catalog }) => {
	catalog = catalog.trim().toLowerCase()

	const [existedCompany, existedCatalog] = await Promise.all([
		Company.findById(company.id),
		Catalog.findOne({ name: catalog, company: company.id })
	])

	if (!existedCompany) { throw new Error('Неверно указана кампания.') }
	if (existedCatalog) { throw new Error('В этой кампании уже есть такой каталог.') }

	const newCatalog = await Catalog.create({
		name: catalog,
		title: title.trim().replace(/^[a-zа-я]/, l => l.toUpperCase()),
		company: company.id,
		...images
	})
	
	existedCompany.catalogs.push(newCatalog._id)
	await existedCompany.save()

	return newCatalog
}

export const removeCatalog = async (parent, { id }, { Catalog, Image }) => {
	const catalog = await Catalog.findById(id).populate('face thumbnails originals').select('face thumbnails originals')

	if (!catalog) { throw new Error('Невозможно найти такой каталог.') }

	const catalogPath = catalog.face.path.split('/').slice(0, -1).join('/')	
	const imagesIds = [
		catalog.face._id,
		...catalog.originals.map(({ _id }) => _id),
		...catalog.thumbnails.map(({ _id }) => _id)
	]

	await Promise.all([
		del(catalogPath),
		Image.deleteMany({ _id: { $in: imagesIds } }),
		Catalog.deleteOne({ _id: id })
	])

	return true
}