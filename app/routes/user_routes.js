const express = require('express')
// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10

// pull in error types and the logic to handle them and set status codes
const errors = require('../../lib/index.lib')

const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError

const User = require('../models/user')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes
const router = express.Router()

const signUpMethod = require('./userRoutes/signUp')
const signInMethod = require('./userRoutes/signIn')
const changePasswordMethod = require('./userRoutes/changePassword')
const signOutMethod = require('./userRoutes/signOut')

router.use(signUpMethod.signUp)
router.use(signInMethod.signIn)
router.use(changePasswordMethod.changePassword)
router.use(signOutMethod.signOut)

module.exports = router
