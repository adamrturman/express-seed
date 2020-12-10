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
const User = require('../../models/user')
const requireToken = passport.authenticate('bearer', { session: false })


const router = express.Router()

// SIGN OUT
// DELETE /sign-out
const signOut = router.delete('/sign-out', requireToken, (req, res, next) => {
    // create a new random token for the user, invalidating the current one
    req.user.token = crypto.randomBytes(16)
    // save the token and respond with 204
    req.user.save()
      .then(() => res.sendStatus(204))
      .catch(next)
  })

module.exports = {
    signOut
}