import { removeCatalogDir } from '../../service/upload'

// Queries
export const getAllCatalogs = async (parent, { current }, { Company, Catalog }) => {
	let find = {}

	if (current) {
		const date = Date.now()
		const currentCompany = await Company.findOne({ startDate: { $lte: date }, finishDate: { $gt: date } })
		find = { company: currentCompany ? currentCompany._id : null }
	}
	return Catalog.find(find).populate({ path: 'images', options: { limit: 1 } })
}

export const getCatalog = async (parent, { number, year, name }, { Company, Catalog }) => {
	const company = await Company.findOne({ number, year })
	if (!company) { throw new Error('Неверно указана кампания') }

	return Catalog.findOne({ name, company: company._id })
		.populate({ path: 'images', options: { sort: { catalogIndex: 1 } } })
}

// Mutations
export const addCatalog = async (parent, { name, title, companyId, imagesIds }, { Company, Catalog, Image }) => {
	let [company, catalog, firstImage] = await Promise.all([
		Company.findById(companyId),
		Catalog.findOne({ name, company: companyId }),
		Image.findById(imagesIds[0])
	])

	if (!company) { throw new Error('Неверно указана кампания.') }
	if (catalog) { throw new Error('В этой кампании уже есть такой каталог.') }

	if (imagesIds.length % 2 !== 0) {
		await Promise.all([
			removeCatalogDir(firstImage.path),
			Image.deleteMany({ _id: { $in: imagesIds } })
		])
		throw new Error('Нечётное количество страниц. Картинки не загружены.')
	}

	catalog = await Catalog.create({ name, title, company: companyId, count: imagesIds.length, images: imagesIds })

	company.catalogs.push(catalog._id)
	await company.save()

	catalog.set('company', company)
	catalog.set('images', [firstImage])

	return catalog
}

export const removeCatalog = async (parent, { catalogId, companyId }, { Catalog, Image, Company }) => {
	const [catalog, company] = await Promise.all([
		Catalog.findById(catalogId).populate('images').select('images'),
		Company.findById(companyId)
	])

	if (!catalog) { throw new Error('Нет такого каталога.') }
	if (!company) { throw new Error('Неверно указана кампания.') }

	const imagesIds = catalog.images.map(({ _id }) => _id)
	company.set('catalogs', company.catalogs.filter(id => id != catalogId))
	
	await Promise.all([
		removeCatalogDir(catalog.images[0].path),
		Image.deleteMany({ _id: { $in: imagesIds } }),
		Catalog.deleteOne({ _id: catalogId }),
		company.save()
	])

	return true
}