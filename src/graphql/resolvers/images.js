import { makeCatalogDirs, storeCatalogImage } from '../../service/upload'
import Catalog from '../../models/Catalog'

//Mutations
export const uploadCatalogImage = async (parent, { catalog, company, file, withFace }) => {
	catalog = catalog.trim().toLowerCase()
	
	if (withFace) {
		const existedCatalog = await Catalog.findOne({ name: catalog, company: company.id })
		if (existedCatalog) { throw new Error('В этой кампании уже есть такой каталог.') }
	}

	const { catalogDir, originalsDir, thumbnailsDir } = makeCatalogDirs(catalog, company.name)

	file = await file

	const uploads = [
		storeCatalogImage({ dir: originalsDir, ...file }),
		storeCatalogImage({ dir: thumbnailsDir, isThumb: true, ...file })
	]
	withFace && uploads.push(storeCatalogImage({ dir: catalogDir, isFace: true, ...file }))

	const images = await Promise.all(uploads)

	const sorted = images.reduce((acc, image, index) => {
		const types = ['original', 'thumbnail', 'face']
		acc[types[index]] = image
		return acc
	}, {})

	return sorted
}