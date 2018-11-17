const app = require('./app')
const fs = require('fs')
const { HOST, PORT, ENDPOINT_PATH, UPLOAD_DIR, CATALOGS_DIR } = require('./service/config')

!fs.existsSync(UPLOAD_DIR) && fs.mkdirSync(UPLOAD_DIR)
!fs.existsSync(`${UPLOAD_DIR}/${CATALOGS_DIR}`) && fs.mkdirSync(`${UPLOAD_DIR}/${CATALOGS_DIR}`)

app.listen(PORT, () => console.log(`[express] Listening @ ${HOST}:${PORT}${ENDPOINT_PATH}`))