const express = require('express')
const cors = require('cors')
const ports = require('../config/ports')
const app = express()
const errorHandler = require('../lib/error_handler')
const replaceToken = require('../lib/replace_token')
const requestLogger = require('../lib/request_logger')
const auth = require('../lib/auth')
const port = process.env.PORT || ports.serverDevPort

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${ports.clientDevPort}` }))
app.use(replaceToken)
app.use(requestLogger)
app.use(auth)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// require route files
// const exampleRoutes = require('../app/routes/example_routes')
// const userRoutes = require('../app/routes/user_routes')
const routes = require('../app/routes/index.route')

// register route files
// app.use(exampleRoutes)
// app.use(userRoutes)
app.use(routes)

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler)


// app.listen(port, () => {
//     console.log('listening on port ' + port)
//   })

module.exports = {
    app,
    port
}