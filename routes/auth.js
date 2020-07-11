const router = require('express').Router()
const body = require('express-validator').body

const authController = require('../controllers/authControllers')

router.post('/login'
    , body('email').not().isEmpty().withMessage('email is required')
        .isEmail().withMessage('please enter a valid email')
        .isLength({min: 5}).withMessage('password must be strong and must be greater that 5 chrachter')
    , authController.login)

router.post('/signup'
    , body('email').not().isEmpty().withMessage('email is required')
        .isEmail().withMessage('please enter a valid email')
        .isLength({min: 5}).withMessage('password must be strong and must be greater that 5 chrachter')
    , body('name').not().isEmpty().withMessage('name is required')
    , body('confirmPassword').custom((value, {req}) => {
        return (value === req.body.password)
    })
    , authController.signup)



module.exports = router