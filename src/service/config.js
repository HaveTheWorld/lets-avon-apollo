const path = require('path')
const dotenv = require('dotenv')

const root = path.join.bind(this, __dirname, '../../')
dotenv.config({ path: root('.env') })

const isProd = process.env.NODE_ENV === 'production'

exports.IS_DEV = !isProd
exports.HOST = process.env.HOST
exports.PORT = process.env.PORT
exports.ENDPOINT_PATH = process.env.ENDPOINT_PATH
exports.MONGO_URL = process.env.MONGO_URL
exports.COOKIE_SECRET = process.env.COOKIE_SECRET
exports.ADMIN_USERNAME = process.env.ADMIN_USERNAME
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
exports.JWT_SECRET = process.env.JWT_SECRET
exports.JWT_EXPIRE = isProd ? +process.env.JWT_EXPIRE : 60 * 60 * 24 * 365
exports.UPLOAD_DIR = process.env.UPLOAD_DIR
exports.CATALOGS_DIR = process.env.CATALOGS_DIR