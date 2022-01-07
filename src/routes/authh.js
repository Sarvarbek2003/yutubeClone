const router = require('express').Router()
const authTokenMiddleware = require('../middlewares/authToken.js')
const userController = require('../controllers/user.js')


router.route('/')
	.get(authTokenMiddleware,userController.GET)


module.exports = router
