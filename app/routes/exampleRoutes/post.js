// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const Example = require('../../models/example')

const router = express.Router()

// INDEX
// GET /examples
const post = router.post('/examples', requireToken, (req, res, next) => {
    // set owner of new example to be current user
    req.body.example.owner = req.user.id
  
    Example.create(req.body.example)
      // respond to succesful `create` with status 201 and JSON of new "example"
      .then(example => {
        res.status(201).json({ example: example.toObject() })
      })
      // if an error occurs, pass it off to our error handler
      // the error handler needs the error message and the `res` object so that it
      // can send an error message back to the client
      .catch(next)
  })

  module.exports = {
      post
  }