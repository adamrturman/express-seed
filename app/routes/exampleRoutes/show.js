// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const Example = require('../../models/example')

const router = express.Router()

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
const show = router.get('/examples/:id', requireToken, (req, res, next) => {
    // req.params.id will be set based on the `:id` in the route
    Example.findById(req.params.id)
      .then(handle404)
      // if `findById` is succesful, respond with 200 and "example" JSON
      .then(example => res.status(200).json({ example: example.toObject() }))
      // if an error occurs, pass it to the handler
      .catch(next)
  })

  module.exports = {
      show
  }