const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../../service/config')
const { uploadCatalogImage, removeCatalogDir } = require('../../service/upload-catalog-image')

module.exports = {
	loginUser: async (parent, { username, password }, { User }) => {
		const user = await User.findOne({ username })
		if (!user || !await user.comparePassword(password)) {
			throw new Error('Неверные имя пользователя или пароль.')
		}

		const loginData = {
			user,
			token: await jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE }),
			expires: Date.now() + JWT_EXPIRE * 1000
		}
		
		return loginData
	},
	addCompany: async (parent, { input }, { Company }) => {
		const { number, year, startDate, finishDate } = input
		const company = await Company.findOne({ number, year })

		if (company) { throw new Error('Такая кампания уже существует.') }
		if (startDate >= finishDate) { throw new Error('Дата начала должна быть раньше даты конца кампании.') }

		return await Company.create({ number, year, startDate, finishDate })
	},
	removeCompany: async (parent, { id }, { Company }) => {
		await Company.deleteOne({ _id: id })
		return true
	},
	uploadCatalogImage: async (parent, { input }, { Catalog, Image }) => {
		return await uploadCatalogImage(input, Catalog, Image)	
	},
	addCatalog: async (parent, { input }, { Company, Catalog, Image }) => {
		const { name, title, companyId, imagesIds } = input

		let [company, catalog, images] = await Promise.all([
			Company.findById(companyId),
			Catalog.findOne({ name, companyId }),
			Image.find({ _id: { $in: imagesIds } })
		])
		
		if (!company) { throw new Error('Неверно указана кампания.') }
		if (catalog) { throw new Error('В этой кампании уже есть такой каталог.') }

		if (images.length % 2 !== 0) {
			await Promise.all([
				removeCatalogDir(images[0].path),
				Image.deleteMany({ _id: { $in: imagesIds } })
			])
			throw new Error('Нечётное количество страниц. Картинки не загружены.')
		}

		catalog = await Catalog.create({ name, title, companyId, count: images.length, imagesIds })

		company.catalogsIds.push(catalog._id)
		await company.save()

		return catalog
	},
	removeCatalog: async (parent, { catalogId, companyId }, { Catalog, Image, Company }) => {
		const [catalog, company] = await Promise.all([
			Catalog.findById(catalogId),
			Company.findById(companyId)
		])

		if (!catalog) { throw new Error('Нет такого каталога.') }
		if (!company) { throw new Error('Неверно указана кампания.') }

		const { path } = await Image.findById(catalog.imagesIds[0]).select('path')
		company.set('catalogsIds', company.catalogsIds.filter(id => id != catalogId))
		
		await Promise.all([
			removeCatalogDir(path),
			Image.deleteMany({ _id: { $in: catalog.imagesIds } }),
			Catalog.deleteOne({ _id: catalogId }),
			company.save()
		])

		return true
	}
}