import sharp from 'sharp'
import fs from 'fs'
import { UPLOAD_DIR, CATALOGS_DIR } from './config'

export function makeCatalogDirs(catalogName, companyName, index) {
	const catalogDir = `${CATALOGS_DIR}/${catalogName}-${companyName}`

	!index && !fs.existsSync(`${UPLOAD_DIR}/${catalogDir}`) && fs.mkdirSync(`${UPLOAD_DIR}/${catalogDir}`)

	return catalogDir
}

export async function storeCatalogImage (dir, index, { stream, filename }) {
	const original = new Promise((resolve, reject) => {
		const path = `${dir}/${filename}`
		stream.pipe(fs.createWriteStream(`${UPLOAD_DIR}/${path}`))
			.on('finish', () => resolve(path))
			.on('error', reject)
	})

	let imageItems = [original]

	if (!index) {
		const [name, mime] = filename.split('.')
		const face = new Promise((resolve, reject) => {
			filename = `${name}-catalog-face.${mime}`
			const path = `${dir}/${filename}`

			const transformer = sharp()
				.resize({ width: 350, height: 461, fit: 'cover', position: 'right top'	})

			stream.pipe(transformer)
				.pipe(fs.createWriteStream(`${UPLOAD_DIR}/${path}`))
				.on('finish', () => resolve(path))
				.on('error', reject)
		})

		const thumb = new Promise((resolve, reject) => {
			filename = `${name}-catalog-thumb.${mime}`
			const path = `${dir}/${filename}`

			const transformer = sharp()
				.resize({ width: 75, height: 98, fit: 'cover', position: 'right top'	})

			stream.pipe(transformer)
				.pipe(fs.createWriteStream(`${UPLOAD_DIR}/${path}`))
				.on('finish', () => resolve(path))
				.on('error', reject)
		})
		imageItems = [...imageItems, face, thumb]
	}

	return Promise.all(imageItems)	
}