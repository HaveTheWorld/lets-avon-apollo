const { CLIENT_ORIGIN, JWT_SECRET, UPLOAD_DIR, CATALOGS_DIR } = require('./service/config')
const path = require('path')
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const expressJwt = require('express-jwt')
require('./service/mongoose')
const initApollo = require('./service/apollo')

const app = express()

app.use(`/${CATALOGS_DIR}`, express.static(path.join(__dirname, '..', UPLOAD_DIR, CATALOGS_DIR)))
app.use(logger('dev', { skip: (req, res) => res.statusCode < 400 }))
app.use(helmet())
app.use(bodyParser.json())
app.use(expressJwt({ secret: JWT_SECRET, credentialsRequired: false }))
initApollo(app)

module.exports = app