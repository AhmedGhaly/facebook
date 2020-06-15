const router = require('express').Router()

const authController = require('../controllers/authControllers')

router.post('/login', authController.login)

router.post('/signup', authController.signup)

/*
    reset password
    confirm email
    forget pass
    reset email
    
*/

module.exports = router