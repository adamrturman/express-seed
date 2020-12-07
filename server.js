const express = require('./app/express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = require('./app/express')
const port = require('./app/express')
const db = require('./config/db')


// require database configuration logic
// `db` will be the actual Mongo URI as a string


// establish database connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true
})

// needed for testing
module.exports = app
