const express = require('express')
const cors = require('cors')
const ports = require('../config/ports')
const requestLogger = require('../lib/request_logger')
const replaceToken = require('../lib/replace_token')
const errorHandler = require('../lib/error_handler')
const auth = require('../lib/auth')
const routes = require('../app/routes/index.route')

const app = express()
const port = process.env.PORT || ports.serverDevPort

app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${ports.clientDevPort}` }))
app.use(replaceToken)
app.use(requestLogger)
app.use(errorHandler)
app.use(auth)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes)

module.exports = {
    app,
    port
}