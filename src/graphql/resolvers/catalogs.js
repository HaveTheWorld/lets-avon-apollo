import sharp from 'sharp'
import fs, { createWriteStream } from 'fs'
import Image from '../../models/Image'
import Company from '../../models/Company'
import Catalog from '../../models/Catalog'
import { CATALOGS_DIR } from '../../service/config'

// Queries
export const getAllCatalogs = () => {
	return Catalog.find().populate('face').populate('company')
}

// Mutations
export const addCatalog = async (parent, { catalog, title, company, images }) => {
	catalog = catalog.trim().toLowerCase()

	const existedCatalog = await Catalog.findOne({ name: catalog, company: company.id })	
	if (existedCatalog) { throw new Error('В этой кампании уже есть такой каталог.') }

	await Catalog.create({
		name: catalog,
		title: title.trim().replace(/^[a-zа-я]/, l => l.toUpperCase()),
		company: company.id,
		...images
	})

	return true
}