const router = require('express').Router()
const userController = require('../controllers/user.js')

router.route('/')
	.get(userController.GET)


module.exports = router
