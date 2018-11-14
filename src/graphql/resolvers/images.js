import { makeCatalogDir, splitCatalogImage, makeCatalogImageItem, renameImage } from '../../service/upload'

import sharp from 'sharp'

//Mutations
export const uploadCatalogImage = async (parent, args, { Catalog, Image }) => {
	const { catalogName, companyId, companyName, file, index, length } = args

	if (!index) {
		const catalog = await Catalog.findOne({ name: catalogName, company: companyId })
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