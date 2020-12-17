const express = require('express')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')
const bcryptSaltRounds = 10
const crypto = require('crypto')
// pull in error types and the logic to handle them and set status codes
const errors = require('../../../lib/custom_errors')
const User = require('../../models/user')
const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError


const signUp = (req, res, next) => {
    // start a promise chain, so that any errors will pass to `handle`
    Promise.resolve(req.body.credentials)
      // reject any requests where `credentials.password` is not present, or where
      // the password is an empty string
      .then(credentials => {
        if (!credentials ||
            !credentials.password ||
            credentials.password !== credentials.password_confirmation) {
          throw new BadParamsError()
        }
      })
      // generate a hash from the provided password, returning a promise
      .then(() => bcrypt.hash(req.body.credentials.password, bcryptSaltRounds))
      .then(hash => {
        // return necessary params to create a user
        return {
          email: req.body.credentials.email,
          hashedPassword: hash
        }
      })
      // create user with provided email and hashed password
      .then(user => User.create(user))
      // send the new user object back with status 201, but `hashedPassword`
      // won't be send because of the `transform` in the User model
      .then(user => res.status(201).json({ user: user.toObject() }))
      // pass any errors along to the error handler
      .catch(next)
  }

const signIn = (req, res, next) => {
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
}

const changePassword = (req, res, next) => {
  let user
  console.log("this is the request.user", req.user)
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
}

  module.exports = {
      signUp,
      signIn,
      changePassword
  }