const router = require('express').Router()

const feedController = require('../controllers/feedControllers')
const isAuth = require('../middleware/isAuth')
// make the home page
router.get('/', isAuth, feedController.home)

module.exports = router