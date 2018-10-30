import express from 'express'

import logger from 'morgan'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import './service/mongoose'
import initApollo from './service/apollo'

import { getUserFromBearer } from './service/auth'

const app = express()

app.use(logger('dev'))
app.use(helmet())
app.use(bodyParser.json())

app.use(getUserFromBearer)
initApollo(app)

export default app