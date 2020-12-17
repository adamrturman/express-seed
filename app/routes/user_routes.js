const express = require('express')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

const { signUp } = require('./controllers/userController')
const signInMethod = require('./userRoutes/signIn')
const changePasswordMethod = require('./userRoutes/changePassword')
const signOutMethod = require('./userRoutes/signOut')

// router.use(signUpMethod.signUp)
router.post('/sign-up', signUp)
router.use(signInMethod.signIn)
router.use(changePasswordMethod.changePassword)
router.use(signOutMethod.signOut)

module.exports = router
