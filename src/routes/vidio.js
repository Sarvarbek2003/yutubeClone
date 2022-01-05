const router = require('express').Router()
const vidioController = require('../controllers/vidio.js')
const validator = require('../middlewares/validator.js')
const authTokenMiddleware = require('../middlewares/authToken.js')


router.route('/')
    .get(vidioController.GET)
	.post(authTokenMiddleware,validator.vidioValidation, vidioController.POST)
    .put(authTokenMiddleware,vidioController.PUT)
    .delete(authTokenMiddleware,vidioController.DELETE)
    
module.exports = router