const path = require('path')
const dotenv = require('dotenv')

const root = path.join.bind(this, __dirname, '../../')
dotenv.config({ path: root('.env') })

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
	IS_DEV: !isProd,
	HOST: process.env.HOST,
	PORT: process.env.PORT,
	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
	ENDPOINT_PATH: process.env.ENDPOINT_PATH,
	MONGO_URL: process.env.MONGO_URL,
	COOKIE_SECRET: process.env.COOKIE_SECRET,
	ADMIN_USERNAME: process.env.ADMIN_USERNAME,
	ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRE: isProd ? +process.env.JWT_EXPIRE : 60 * 60 * 24 * 365,
	UPLOAD_DIR: process.env.UPLOAD_DIR,
	CATALOGS_DIR: process.env.CATALOGS_DIR
}