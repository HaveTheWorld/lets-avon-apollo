import del from 'del'
import { UPLOAD_DIR } from '../../service/config'

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

export const getCatalog = async (parent, { company, name }, { Company, Catalog }) => {
	const existedCompany = await Company.findOne({ name: company })

	if (!existedCompany) { throw new Error('Неверно указана кампания') }

	return Catalog.findOne({ name, company: existedCompany._id }).populate('originals thumbnails')
}

// Mutations
export const addCatalog = async (parent, { name, title, companyId, images }, { Company, Catalog, Image }) => {
	let [company, catalog] = await Promise.all([
		Company.findById(companyId),
		Catalog.findOne({ name, company: companyId })
	])

	if (!company) { throw new Error('Неверно указана кампания.') }
	if (catalog) { throw new Error('В этой кампании уже есть такой каталог.') }

	const [newCatalog, faceImage] = await Promise.all([
		Catalog.create({ name, title, company: companyId, images }),
		Image.findById(images[0])
	])
	company.catalogs.push(newCatalog._id)
	await company.save()

	newCatalog.set('company', company)
	newCatalog.set('images', [faceImage])

	return newCatalog
}

export const removeCatalog = async (parent, { catalogId, companyId }, { Catalog, Image, Company }) => {
	const [catalog, company] = await Promise.all([
		Catalog.findById(catalogId).populate('images').select('images'),
		Company.findById(companyId)
	])

	if (!catalog) { throw new Error('Нет такого каталога.') }
	if (!company) { throw new Error('Неверно указана кампания.') }

	const catalogPath = catalog.images[0].path.split('/').slice(0, -1).join('/')	
	const imagesIds = catalog.images.map(({ _id }) => _id)
	company.set('catalogs', company.catalogs.filter(id => id != catalogId))
	
	await Promise.all([
		del(`${UPLOAD_DIR}/${catalogPath}`),
		Image.deleteMany({ _id: { $in: imagesIds } }),
		Catalog.deleteOne({ _id: catalogId }),
		company.save()
	])

	return true
}