import sharp from 'sharp'
import fs, { createWriteStream } from 'fs'
import Image from '../models/Image'
import { CATALOGS_DIR } from './config'

export function makeCatalogDirs(catalog, company) {
	const catalogDir = `${CATALOGS_DIR}/${catalog}-${company}`
	const originalsDir = `${catalogDir}/originals`
	const thumbnailsDir = `${catalogDir}/thumbnails`

	if (!fs.existsSync(CATALOGS_DIR)) { fs.mkdirSync(CATALOGS_DIR) }
	if (!fs.existsSync(catalogDir)) {
		fs.mkdirSync(catalogDir)
		fs.mkdirSync(originalsDir)
		fs.mkdirSync(thumbnailsDir)
	}

	return { catalogDir, originalsDir, thumbnailsDir }
}

export async function storeCatalogImage ({ dir, isFace, isThumb, stream, filename }) {	
	if (isFace) {
		const faceTransformer = sharp()
			.resize({ width: 350, height: 461, fit: 'cover', position: 'right top'	})
		const mime = filename.split('.').pop()
		filename = `face.${mime}`
		stream = stream.pipe(faceTransformer)
	}

	if (isThumb) {
		const thumbnailTransformer = sharp().resize({ width: 150 })
		stream = stream.pipe(thumbnailTransformer)
	}

	const path = `${dir}/${filename}`

	return new Promise((resolve, reject) => {
		stream.pipe(createWriteStream(path))
			.on('finish', async () => {
				let image = await Image.findOne({ path })
				if (!image) {
					image = await Image.create({ path })					
				}
				resolve(image)
			})
			.on('error', reject)
	})
}