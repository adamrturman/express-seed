// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')
// const getMethod = require('./exampleRoutes/get')
const { get } = require('./controllers/exampleController')
const { show } = require('./controllers/exampleController')
const { post } = require('./controllers/exampleController')
const { patch } = require('./controllers/exampleController')
// const postMethod = require('./exampleRoutes/post')
// const showMethod = require('./exampleRoutes/show')
// const patchMethod = require('./exampleRoutes/patch')
const destroyMethod = require('./exampleRoutes/destroy')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

//  Routes for Example CRUD 
// router.use(getMethod.getAll)
router.get('/examples', requireToken, get)
// router.use(postMethod.post)
// router.use(showMethod.show)
router.get('/examples/:id', requireToken, show)
router.post('/examples', requireToken, post)
// router.use(patchMethod.patch)
router.patch('/examples/:id', requireToken, removeBlanks, patch)
router.use(destroyMethod.destroy)


module.exports = router
