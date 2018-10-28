import express from 'express'

import logger from 'morgan'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import './service/mongoose'
import initApollo from './service/apollo'

const app = express()

app.use(logger('dev'))
app.use(helmet())
app.use(bodyParser.json())

initApollo(app)

export default app