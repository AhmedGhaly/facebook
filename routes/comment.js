const router = require('express').Router()
const body = require('express-validator').body

const isAuth = require('../middleware/isAuth')
const userController = require('../controllers/userController')



router.post('/comment/:postId'
    , isAuth
    ,body('comment').not().isEmpty()
    , userController.commentPost)

router.post('/likecomment/:commentId', isAuth, userController.likeComment)

router.post('/dislikecomment/:commentId', isAuth, userController.disLikeComment)

router.post('/nestedcomment/:commentId'
    , isAuth
    ,body('commentText').not().isEmpty()
    , userController.nestedComment)

module.exports = router
