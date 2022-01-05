const router = require('express').Router()
const imageController = require('../controllers/image.js')

router.route('/')
	.post(imageController.POST)

module.exports = router