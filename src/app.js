import express from 'express'
import logger from 'morgan'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import './service/mongoose'
import initApollo from './service/apollo'
import { putUserToReq } from './service/auth'

const app = express()

app.use(logger('dev'))
app.use(helmet())
app.use(bodyParser.json())

app.use(putUserToReq)
import path from 'path'
initApollo(app)
app.use('/upload', express.static(path.join(__dirname, '../upload')))

export default app