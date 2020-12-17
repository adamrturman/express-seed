const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const handle404 = require('../../../lib/custom_errors')
const { requireOwnership } = require('../../../lib/custom_errors')
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

const post = (req, res, next) => {
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
  }

  const patch = (req, res, next) => {
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
  }

  module.exports = {
      get,
      show,
      post,
      patch
  }