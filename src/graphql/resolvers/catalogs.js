import sharp from 'sharp'
import { promisify } from 'util'
import fs, { createWriteStream } from 'fs'

import path from 'path'
const CATALOGS_DIR = path.join(__dirname, '../../../upload/catalogs')


const storeUpload = (catalogPath, originalsPath, thumbnailsPath, { stream, filename }) => {

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
		new Promise((resolve, reject) => {
			if (filename.split('.').shift() !== '1') {
				return resolve()
			}

			const mime = filename.split('.').pop()
			
			stream.pipe(faceTransformer)
				.pipe(createWriteStream(path.join(catalogPath, `face.${mime}`)))
				.on('finish', () => resolve())
				.on('error', reject)
		}),
		new Promise((resolve, reject) => {
			stream.pipe(createWriteStream(path.join(originalsPath, filename)))
				.on('finish', () => resolve())
				.on('error', reject)
		}),
		new Promise((resolve, reject) => {
			stream.pipe(thumbnailTransformer)
				.pipe(createWriteStream(path.join(thumbnailsPath, filename)))
				.on('finish', () => resolve())
				.on('error', reject)
		})
	])
}

export const uploadCatalog = async (parent, { fields, files }) => {
	const { catalog, title, company } = fields
	const catalogPath = path.join(CATALOGS_DIR, `${catalog}-${company}`)
	const originalsPath = path.join(catalogPath, 'originals')
	const thumbnailsPath = path.join(catalogPath, 'thumbnails')

	if (!fs.existsSync(CATALOGS_DIR)) { fs.mkdirSync(CATALOGS_DIR) }
	if (!fs.existsSync(catalogPath)) {
		fs.mkdirSync(catalogPath)
		fs.mkdirSync(originalsPath)
		fs.mkdirSync(thumbnailsPath)
	}

	await Promise.all(files.map(async file => storeUpload(catalogPath, originalsPath, thumbnailsPath, await file)))
	return true
}