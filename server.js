const mongoose = require('mongoose')
const express = require('./app/express')
const db = require('./config/db')

// establish database connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true
})

// run API on designated port (4741 in this case)
express.app.listen(express.port, () => {
  console.log('listening on port ' + express.port)
})

// needed for testing
module.exports = express
