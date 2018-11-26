const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../../service/config')
const { uploadCatalogImage, removeCatalogDir } = require('../../service/upload-catalog-image')

module.exports = {
	loginUser: async (parent, { username, password }, { User, setCookie }) => {
		setCookie('token', '', { maxAge: -1 })

		const user = await User.findOne({ username })
		if (!user || !await user.comparePassword(password)) {
			throw new Error('Неверные имя пользователя или пароль.')
		}

		const token = await jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE })
		setCookie('token', token, { maxAge: JWT_EXPIRE * 1000 })
		
		return user
	},
	logoutUser: (parent, args, { setCookie }) => {
		setCookie('token', '', { maxAge: -1 })
		return true
	},
	addUser: async (parent, { username, password, role }, { User, requireRole }) => {
		requireRole('admin')
		
		if (role && !['user', 'editor', 'admin'].includes(role)) {
			throw new Error('Неверно указана роль пользователя.')
		}

		const user = await User.findOne({ username })
		if (user) { throw new Error('Пользователь с таким именем уже существует.') }

		return await User.create({ username, password, role })
	},
	removeUser: async (parent, { id }, { User, user, requireRole }) => {
		requireRole('admin')

		if (id == user.id) { throw new Error('Аккаунт, с которого выполнен вход, удалить нельзя.') }
		
		const userToRemove = await User.findById(id)
		if (!userToRemove) { throw new Error('Неверно указан пользователь.') }
		if (userToRemove.isRootAdmin) { throw new Error('Аккаунт главного администратора удалить нельзя.') }

		const { n } = await User.deleteOne({ _id: id })
		if (!n) { throw new Error('Пользователь не был удалён.') }

		return true
	},
	editUser: async (parent, { id, username, password, role }, { User, user, requireRole }) => {
		requireRole('admin')
		
		const [userToEdit, busyUsername] = await Promise.all([
			User.findById(id),
			User.findOne({ username })
		])

		if (!userToEdit) { throw new Error('Неверно указан пользователь.') }
		if (userToEdit.isRootAdmin && !user.isRootAdmin) {
			throw new Error('Недостаточно прав для данного аккаунта')
		}
		if (username !== userToEdit.username && busyUsername) {
			throw new Error('Пользователь с таким именем уже существует.')
		}

		username && userToEdit.set('username', username)
		password && userToEdit.set('password', password)
		role && userToEdit.set('role', role)

		return await userToEdit.save()
	},
	addCompany: async (parent, { input }, { Company, requireRole }) => {
		requireRole(['editor', 'admin'])

		const { number, year, startDate, finishDate } = input
		const company = await Company.findOne({ number, year })

		if (company) { throw new Error('Такая кампания уже существует.') }
		if (startDate >= finishDate) { throw new Error('Дата начала должна быть раньше даты конца кампании.') }

		return await Company.create({ number, year, startDate, finishDate })
	},
	removeCompany: async (parent, { id }, { Company, requireRole }) => {
		requireRole(['editor', 'admin'])
		
		const { n } = await Company.deleteOne({ _id: id })
		if (!n) { throw new Error('Кампания не была удалена.') }
		
		return true
	},
	uploadCatalogImage: async (parent, { input }, { Catalog, Image, requireRole }) => {
		requireRole(['editor', 'admin'])
		
		return await uploadCatalogImage(input, Catalog, Image)	
	},
	addCatalog: async (parent, { input }, { Company, Catalog, Image, requireRole }) => {
		requireRole(['editor', 'admin'])
		
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
	removeCatalog: async (parent, { catalogId, companyId }, { Catalog, Image, Company, requireRole }) => {
		requireRole(['editor', 'admin'])

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