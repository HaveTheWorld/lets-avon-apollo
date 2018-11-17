const path = require('path')
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
require('./service/mongoose')
const initApollo = require('./service/apollo')
const { authUserMiddleware } = require('./service/auth')
const { UPLOAD_DIR, CATALOGS_DIR } = require('./service/config')

const app = express()

app.use(logger('dev'))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(helmet())
app.use(bodyParser.json())

app.use(authUserMiddleware)
initApollo(app)
app.use(`/catalogs`, express.static(path.join(__dirname, '..', UPLOAD_DIR, CATALOGS_DIR)))

module.exports = app