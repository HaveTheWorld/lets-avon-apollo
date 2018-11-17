const path = require('path')
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const loginRoute = require('./service/login')
const expressJwt = require('express-jwt')
require('./service/mongoose')
const initApollo = require('./service/apollo')
const { JWT_SECRET, UPLOAD_DIR, CATALOGS_DIR } = require('./service/config')

const app = express()

app.use(logger('dev', {
	skip: (req, res) => res.statusCode < 400
}))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(helmet())
app.use(bodyParser.json())
app.use(`/catalogs`, express.static(path.join(__dirname, '..', UPLOAD_DIR, CATALOGS_DIR)))
app.post('/login', loginRoute)
app.use(expressJwt({ secret: JWT_SECRET, credentialsRequired: false }))
initApollo(app)

module.exports = app