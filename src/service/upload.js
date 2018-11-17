const sharp = require('sharp')
const fs = require('fs')
const del = require('del')
const { UPLOAD_DIR, CATALOGS_DIR } = require('./config')

exports.makeCatalogDir = (catalogName, companyName, index) => {
	const catalogDir = `${CATALOGS_DIR}/${catalogName}-${companyName}`

	!index && !fs.existsSync(`${UPLOAD_DIR}/${catalogDir}`) && fs.mkdirSync(`${UPLOAD_DIR}/${catalogDir}`)

	return catalogDir
}

exports.removeCatalogDir = (someImagePath) => {
	const catalogDir = someImagePath.split('/').slice(0, -1).join('/')
	return del(`${UPLOAD_DIR}/${catalogDir}`)
}

exports.splitCatalogImage = async (dir, mime, index, length, fileStream) => {
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

exports.makeCatalogImageItem = (dir, name, mime, item, fileStream) => {
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

exports.renameImage = (oldPath, newPath) => {
	return new Promise((resolve, reject) => {
		fs.rename(`${UPLOAD_DIR}/${oldPath}`, `${UPLOAD_DIR}/${newPath}`, err => {
			err ? reject() : resolve()
		})
	})
}