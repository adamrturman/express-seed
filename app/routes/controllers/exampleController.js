const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const handle404 = require('../../../lib/custom_errors')
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const Example = require('../../models/example')

const get = (req, res, next) => {
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
  }

  const show = (req, res, next) => {
    // req.params.id will be set based on the `:id` in the route
    Example.findById(req.params.id)
      .then(handle404)
      // if `findById` is succesful, respond with 200 and "example" JSON
      .then(example => res.status(200).json({ example: example.toObject() }))
      // if an error occurs, pass it to the handler
      .catch(next)
  }

  module.exports = {
      get,
      show
  }