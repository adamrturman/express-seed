const express = require('express')
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })


// instantiate a router (mini app that only handles routes)
const router = express.Router()


const { signUp } = require('./controllers/userController')
const { signIn } = require('./controllers/userController')
const { changePassword } = require('./controllers/userController')
const { signOut } = require('./controllers/userController')
// const changePasswordMethod = require('./userRoutes/changePassword')
const signOutMethod = require('./userRoutes/signOut')

// router.use(signUpMethod.signUp)
router.post('/sign-up', signUp)
// router.use(signInMethod.signIn)
router.post('/sign-in', signIn)
// router.use(changePasswordMethod.changePassword)
router.patch('/change-password', requireToken, changePassword)
// router.use(signOutMethod.signOut)
router.delete('/sign-out', requireToken, signOut)

module.exports = router
