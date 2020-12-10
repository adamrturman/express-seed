// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../../lib/remove_blank_fields')

const Example = require('../../models/example')

const router = express.Router()

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
const patch = router.patch('/examples/:id', requireToken, removeBlanks, (req, res, next) => {
    // if the client attempts to change the `owner` property by including a new
    // owner, prevent that by deleting that key/value pair
    delete req.body.example.owner
  
    Example.findById(req.params.id)
      .then(handle404)
      .then(example => {
        // pass the `req` object and the Mongoose record to `requireOwnership`
        // it will throw an error if the current user isn't the owner
        requireOwnership(req, example)
  
        // pass the result of Mongoose's `.update` to the next `.then`
        return example.updateOne(req.body.example)
      })
      // if that succeeded, return 204 and no JSON
      .then(() => res.sendStatus(204))
      // if an error occurs, pass it to the handler
      .catch(next)
  })

  module.exports = {
      patch
  }