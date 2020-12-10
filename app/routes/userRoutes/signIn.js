const express = require('express')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')
// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
// instantiate a router (mini app that only handles routes)
// pull in error types and the logic to handle them and set status codes
const errors = require('../../../lib/index.lib')
const User = require('../../models/user')
const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError

const router = express.Router()

// SIGN IN
// // POST /sign-in
const signIn = router.post('/sign-in', (req, res, next) => {
  const pw = req.body.credentials.password
  let user

  // find a user based on the email that was passed
  User.findOne({ email: req.body.credentials.email })
    .then(record => {
      // if we didn't find a user with that email, send 401
      if (!record) {
        throw new BadCredentialsError()
      }
      // save the found user outside the promise chain
      user = record
      // `bcrypt.compare` will return true if the result of hashing `pw`
      // is exactly equal to the hashed password stored in the DB
      return bcrypt.compare(pw, user.hashedPassword)
    })
    .then(correctPassword => {
      // if the passwords matched
      if (correctPassword) {
        // the token will be a 16 byte random hex string
        const token = crypto.randomBytes(16).toString('hex')
        user.token = token
        // save the token to the DB as a property on user
        return user.save()
      } else {
        // throw an error to trigger the error handler and end the promise chain
        // this will send back 401 and a message about sending wrong parameters
        throw new BadCredentialsError()
      }
    })
    .then(user => {
      // return status 201, the email, and the new token
      res.status(201).json({ user: user.toObject() })
    })
    .catch(next)
})

module.exports = {
    signIn
}