import path from 'path'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import './service/mongoose'
import initApollo from './service/apollo'
import { authUserMiddleware } from './service/auth'
import { UPLOAD_DIR, CATALOGS_DIR } from './service/config'

const app = express()

app.use(logger('dev'))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(helmet())
app.use(bodyParser.json())

app.use(authUserMiddleware)
initApollo(app)
app.use(`/catalogs`, express.static(path.join(__dirname, '..', UPLOAD_DIR, CATALOGS_DIR)))

export default app