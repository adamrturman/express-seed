const express = require('express')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')
// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
// instantiate a router (mini app that only handles routes)
// pull in error types and the logic to handle them and set status codes
const errors = require('../../../lib/custom_errors')
const User = require('../../models/user')
const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError
const requireToken = passport.authenticate('bearer', { session: false })


const router = express.Router()

// CHANGE password
// PATCH /change-password
const changePassword = router.patch('/change-password', requireToken, (req, res, next) => {
    let user
    // `req.user` will be determined by decoding the token payload
    User.findById(req.user.id)
      // save user outside the promise chain
      .then(record => { user = record })
      // check that the old password is correct
      .then(() => bcrypt.compare(req.body.passwords.old, user.hashedPassword))
      // `correctPassword` will be true if hashing the old password ends up the
      // same as `user.hashedPassword`
      .then(correctPassword => {
        // throw an error if the new password is missing, an empty string,
        // or the old password was wrong
        if (!req.body.passwords.new || !correctPassword) {
          throw new BadParamsError()
        }
      })
      // hash the new password
      .then(() => bcrypt.hash(req.body.passwords.new, bcryptSaltRounds))
      .then(hash => {
        // set and save the new hashed password in the DB
        user.hashedPassword = hash
        return user.save()
      })
      // respond with no content and status 200
      .then(() => res.sendStatus(204))
      // pass any errors along to the error handler
      .catch(next)
  })

module.exports = {
    changePassword
}