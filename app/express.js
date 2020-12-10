const express = require('express')
const cors = require('cors')
const ports = require('../config/ports')
const lib = require('../lib/index.lib')
const routes = require('../app/routes/index.route')

const app = express()
const port = process.env.PORT || ports.serverDevPort

app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${ports.clientDevPort}` }))
app.use(lib.replaceToken)
app.use(lib.requestLogger)
app.use(lib.errorHandler)
app.use(lib.auth)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes)

module.exports = {
    app,
    port
}