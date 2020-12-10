// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const Example = require('../../models/example')

const router = express.Router()

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
const destroy = router.delete('/examples/:id', requireToken, (req, res, next) => {
    Example.findById(req.params.id)
      .then(handle404)
      .then(example => {
        // throw an error if current user doesn't own `example`
        requireOwnership(req, example)
        // delete the example ONLY IF the above didn't throw
        example.deleteOne()
      })
      // send back 204 and no content if the deletion succeeded
      .then(() => res.sendStatus(204))
      // if an error occurs, pass it to the handler
      .catch(next)
  })

  module.exports = {
      destroy
  }