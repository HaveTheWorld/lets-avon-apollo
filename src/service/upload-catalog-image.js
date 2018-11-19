const sharp = require('sharp')
const fs = require('fs')
const del = require('del')
const { UPLOAD_DIR, CATALOGS_DIR } = require('./config')

exports.uploadCatalogImage = async (input, Catalog, Image) => {
	const { catalogName, companyId, companyName, file, index, length } = input

	if (!index) {
		const catalog = await Catalog.findOne({ name: catalogName, companyId })
		if (catalog) { throw new Error('В этой кампании уже есть такой каталог.') }
	}

	const { stream, filename } = await file
	const [name, mime] = filename.split('.')

	const dir = makeCatalogDir(catalogName, companyName, index)

	let tasks = [splitCatalogImage(dir, mime, index, length, stream)]
	if (!index) {
		tasks = tasks.concat(
			Promise.all([
				makeCatalogImageItem(dir, '1', mime, 'face', stream),
				makeCatalogImageItem(dir, '1', mime, 'thumb', stream)
			])
		)
	}

	const result = await Promise.all(tasks)
	const [left, right] = result[0].sort((a, b) => a === b ? 0 : a > b)
	const [face, thumb] = result[1] ? result[1] : []

	const images = [createImage(Image, left, face, thumb)]
	right && images.push(createImage(Image, right))

	return Promise.all(images)
}

exports.removeCatalogDir = (someImagePath) => {
	const catalogDir = someImagePath.split('/').slice(0, -1).join('/')
	return del(`${UPLOAD_DIR}/${catalogDir}`)
}

async function createImage(Image, path, face, thumb) {
	const index = +path.split('/').pop().split('.')[0]
	let image = await Image.findOne({ path })

	if (image) {
		image.set('catalogIndex', index)
		image.set('catalogFacePath', face)
		image.set('catalogThumbPath', thumb)
		image.save()
	} else {
		image = Image.create({
			path,
			catalogIndex: index,
			catalogFacePath: face,
			catalogThumbPath: thumb
		})
	}

	return image
}

function makeCatalogDir (catalogName, companyName, index) {
	const catalogDir = `${CATALOGS_DIR}/${catalogName}-${companyName}`
	!index && !fs.existsSync(`${UPLOAD_DIR}/${catalogDir}`) && fs.mkdirSync(`${UPLOAD_DIR}/${catalogDir}`)
	return catalogDir
}

async function splitCatalogImage (dir, mime, index, length, fileStream) {
	const writableStream = sharp()
	fileStream.pipe(writableStream)

	const { width, height } = await writableStream.metadata()
	const resizeParams = { width: 850, height: 1120, fit: 'cover', position: 'left top' }

	if (width > height) {
		const leftName = index ? index * 2 : length * 2
		const rightName = index ? index * 2 + 1 : 1
		const leftPath = `${dir}/${leftName}.${mime}`
		const rightPath = `${dir}/${rightName}.${mime}`
		return Promise.all([
			storeSplittedImage(writableStream, leftPath, resizeParams),
			storeSplittedImage(writableStream, rightPath, { ...resizeParams, position: 'right top' })
		])
	} else {
		const name = index ? length * 2 - 2 : 1
		const path = `${dir}/${name}.${mime}`
		writableStream.resize(resizeParams)

		return new Promise((resolve, reject) => {
			writableStream
				.pipe(fs.createWriteStream(`${UPLOAD_DIR}/${path}`))
				.on('finish', () => resolve([path]))
				.on('error', reject)
		})
	}
}

function storeSplittedImage(writableStream, path, resizeParams) {
	return new Promise((resolve, reject) => {
		writableStream
			.clone()
			.resize(resizeParams)
			.pipe(fs.createWriteStream(`${UPLOAD_DIR}/${path}`))
			.on('finish', () => resolve(path))
			.on('error', reject)
	})
}

function makeCatalogImageItem (dir, name, mime, item, fileStream) {
	return new Promise((resolve, reject) => {
		const filename = `${name}-${item}.${mime}`
		const path = `${dir}/${filename}`
		
		const params = {
			face: { width: 350, height: 461 },
			thumb: { width: 75, height: 98 }
		}
		const writableStream = sharp()
		fileStream.pipe(writableStream)
		writableStream
			.clone()
			.resize({ ...params[item], fit: 'cover', position: 'right top'	})
			.pipe(fs.createWriteStream(`${UPLOAD_DIR}/${path}`))
			.on('finish', () => resolve(path))
			.on('error', reject)
	})
}