// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')

const { get } = require('./controllers/exampleController')
const { show } = require('./controllers/exampleController')
const { post } = require('./controllers/exampleController')
const { patch } = require('./controllers/exampleController')
const { destroy } = require('./controllers/exampleController')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

//  Routes for Example CRUD 
router.get('/examples', requireToken, get)
router.get('/examples/:id', requireToken, show)
router.post('/examples', requireToken, post)
router.patch('/examples/:id', requireToken, removeBlanks, patch)
router.delete('/examples/:id', requireToken, destroy)


module.exports = router
