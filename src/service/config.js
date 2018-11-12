import path from 'path'
import dotenv from 'dotenv'

const root = path.join.bind(this, __dirname, '../../')
dotenv.config({ path: root('.env') })

export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_DEV = !IS_PROD

export const HOST = process.env.HOST
export const PORT = process.env.PORT
export const ENDPOINT_PATH = process.env.ENDPOINT_PATH
export const MONGO_URL = process.env.MONGO_URL
export const COOKIE_SECRET = process.env.COOKIE_SECRET
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRE = IS_PROD ? process.env.JWT_EXPIRE : '365 days'
export const UPLOAD_DIR = process.env.UPLOAD_DIR
export const CATALOGS_DIR = process.env.CATALOGS_DIR