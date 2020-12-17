// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// const getMethod = require('./exampleRoutes/get')
const { get } = require('./controllers/exampleController')
const postMethod = require('./exampleRoutes/post')
const showMethod = require('./exampleRoutes/show')
const patchMethod = require('./exampleRoutes/patch')
const destroyMethod = require('./exampleRoutes/destroy')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

//  Routes for Example CRUD 
// router.use(getMethod.getAll)
router.get('/examples', requireToken, get)
router.use(postMethod.post)
router.use(showMethod.show)
router.use(patchMethod.patch)
router.use(destroyMethod.destroy)


module.exports = router
