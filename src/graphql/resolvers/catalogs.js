import sharp from 'sharp'
import fs, { createWriteStream } from 'fs'
import Image from '../../models/image'
import Company from '../../models/company'
import Catalog from '../../models/catalog'

const CATALOGS_DIR = 'upload/catalogs'

const storeUpload = (paths, index, { stream, filename }) => {
	const { catalogPath, originalsPath, thumbnailsPath } = paths

	const faceTransformer = sharp()
		.resize({
			width: 850,
			height: 1120,
			fit: 'cover',
			position: 'right top'
		})

	const thumbnailTransformer = sharp()
		.resize({
			width: 150
		})
	
	return Promise.all([
		// Face
		new Promise((resolve, reject) => {
			if (index) { return resolve() }

			const mime = filename.split('.').pop()
			const path = `${catalogPath}/face.${mime}`

			stream.pipe(faceTransformer)
				.pipe(createWriteStream(path))
				.on('finish', async () => {
					const image = await Image.create({ path })
					resolve(image._id)
				})
				.on('error', reject)
		}),
		// Original
		new Promise((resolve, reject) => {
			const path = `${originalsPath}/${filename}`

			stream.pipe(createWriteStream(path))
				.on('finish', async () => {
					const image = await Image.create({ path })
					resolve(image._id)
				})
				.on('error', reject)
		}),
		// Thumbnail
		new Promise((resolve, reject) => {
			const path = `${thumbnailsPath}/${filename}`

			stream.pipe(thumbnailTransformer)
				.pipe(createWriteStream(path))
				.on('finish', async () => {
					const image = await Image.create({ path })
					resolve(image._id)
				})
				.on('error', reject)
		})
	])
}

export const uploadCatalog = async (parent, { fields, files }) => {
	let { catalog, title, company } = fields
	
	if (!catalog || !title || !company) { throw new Error('Не все поля заполнены корректно.') }

	const { _id: companyId } = await Company.findOne({ name: company })
	const existedCatalog = await Catalog.findOne({ name: catalog, company: companyId })
	
	if (existedCatalog) { throw new Error('В этой кампании уже есть такой каталог.') }

	catalog = catalog.trim().toLowerCase()

	const catalogPath = `${CATALOGS_DIR}/${catalog}-${company}`
	const originalsPath = `${catalogPath}/originals`
	const thumbnailsPath = `${catalogPath}/thumbnails`

	if (!fs.existsSync(CATALOGS_DIR)) { fs.mkdirSync(CATALOGS_DIR) }
	if (!fs.existsSync(catalogPath)) {
		fs.mkdirSync(catalogPath)
		fs.mkdirSync(originalsPath)
		fs.mkdirSync(thumbnailsPath)
	}
	
	const paths = { catalogPath, originalsPath, thumbnailsPath }

	const images = await Promise.all(
		files.map(async (file, index) => {
			return storeUpload(paths, index, await file)
		})
	)

	const sortedImages = images.reduce((acc, [face, orig, thumb], index) => {
		if (!index) { acc['face'] = face }
		acc.originals.push(orig)
		acc.thumbnails.push(thumb)
		return acc
	}, { face: '', originals: [], thumbnails: [] })	

	await Catalog.create({
		name: catalog,
		title: title.trim().replace(/^[а-я]/, l => l.toUpperCase()),
		company: companyId,
		images: sortedImages
	})

	return true
}