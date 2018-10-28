import app from './app'
import { HOST, PORT, ENDPOINT_PATH } from './service/config'

app.listen(PORT, () => console.log(`[express] Listening @ ${HOST}:${PORT}${ENDPOINT_PATH}`))