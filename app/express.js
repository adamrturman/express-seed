// require necessary NPM packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ports = require('../config/ports')
console.log('We are here')
// instantiate express application object
const app = express()


// define port for API to run on
const port = process.env.PORT || ports.serverDevPort

// require middleware
const errorHandler = require('../lib/error_handler')
const replaceToken = require('../lib/replace_token')
const requestLogger = require('../lib/request_logger')

// require configured passport authentication middleware
const auth = require('../lib/auth')

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${ports.clientDevPort}` }))

// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token token=<token>` OR the Express convention of
// `Authorization: Bearer <token>`
app.use(replaceToken)

// register passport authentication middleware
app.use(auth)

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(express.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }))

// log each request as it comes in for debugging
app.use(requestLogger)

// require route files
const exampleRoutes = require('../app/routes/example_routes')
const userRoutes = require('../app/routes/user_routes')


// register route files
app.use(exampleRoutes)
app.use(userRoutes)

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler)

// run API on designated port (4741 in this case)
app.listen(port, () => {
  console.log('listening on port ' + port)
})

module.exports = {
    app,
    port
}