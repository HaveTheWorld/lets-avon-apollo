import { makeCatalogDirs, storeCatalogImage } from '../../service/upload'

//Mutations
export const uploadCatalogImage = async (parent, { catalogName, companyId, companyName, file, index }, { Catalog, Image }) => {
	if (!index) {
		const catalog = await Catalog.findOne({ name: catalogName, company: companyId })
		if (catalog) { throw new Error('В этой кампании уже есть такой каталог.') }
	}

	const catalogDir = makeCatalogDirs(catalogName, companyName, index)
	const [path, catalogFacePath, catalogThumbPath] = await storeCatalogImage(catalogDir, index, await file)

	let image = await Image.findOne({ path })

	if (image) {
		image.set('catalogIndex', index)
		image.set('catalogFacePath', catalogFacePath)
		image.set('catalogThumbPath', catalogThumbPath)
		image.save()
	} else {
		image = Image.create({ path, catalogIndex: index, catalogFacePath, catalogThumbPath })
	}

	return image
}