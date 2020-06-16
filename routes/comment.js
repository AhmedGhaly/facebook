const router = require('express').Router()


const isAuth = require('../middleware/isAuth')
const userController = require('../controllers/userController')



router.post('/comment/:postId', isAuth, userController.commentPost)

router.post('/likecomment/:commentId', isAuth, userController.likeComment)

router.post('/dislikecomment/:commentId', isAuth, userController.disLikeComment)

router.post('/nestedcomment/:commentId', isAuth, userController.nestedComment)

module.exports = router
