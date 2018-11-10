import path from 'path'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import './service/mongoose'
import initApollo from './service/apollo'
import { authUserMiddleware } from './service/auth'

const app = express()

app.use(logger('dev'))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(helmet())
app.use(bodyParser.json())

app.use(authUserMiddleware)
initApollo(app)
app.use('/upload', express.static(path.join(__dirname, '../upload')))

export default app