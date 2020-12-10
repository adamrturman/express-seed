// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const Example = require('../../models/example')

const router = express.Router()

// INDEX
// GET /examples
const getAll = router.get('/examples', requireToken, (req, res, next) => {
    Example.find()
      .then(examples => {
        // `examples` will be an array of Mongoose documents
        // we want to convert each one to a POJO, so we use `.map` to
        // apply `.toObject` to each one
        return examples.map(example => example.toObject())
      })
      // respond with status 200 and JSON of the examples
      .then(examples => res.status(200).json({ examples: examples }))
      // if an error occurs, pass it to the handler
      .catch(next)
  })

  module.exports = {
      getAll
  }