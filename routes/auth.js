const router = require('express').Router()
const body = require('express-validator').body

const authController = require('../controllers/authControllers')

router.post('/login'
    , body('email').not().isEmpty().withMessage('email is required')
        .isEmail().withMessage('please enter a valid email')
    , body('password').not().isEmpty().withMessage('password is required')
        .isLength({min: 5}).withMessage('password must be strong')
    , authController.login)

router.post('/signup'
    , body('email').not().isEmpty().withMessage('email is required')
        .isEmail().withMessage('please enter a valid email')
    , body('password').not().isEmpty().withMessage('password is required')
        .isLength({min: 5}).withMessage('password must be strong')
    , body('name').not().isEmpty().withMessage('name is required')
    , body('confirmPassword').custom((value, {req}) => {
        return (value === req.body.password)
    }).withMessage('password not matched')
    , authController.signup)

/*
    reset password
    confirm email
    forget pass
    reset email
    
*/

module.exports = router