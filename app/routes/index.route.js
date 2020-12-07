import express from 'express'
const exampleRoutes = require('./example_routes')
const userRoutes = require('./user_routes')

const router = express.Router()

router.use(exampleRoutes)
router.use(userRoutes)


export default router