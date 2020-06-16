const router = require('express').Router()


const isAuth = require('../middleware/isAuth')
const userController = require('../controllers/userController')



router.post('/post', isAuth, userController.postPost)

router.post('/like/:postId', isAuth, userController.likePost)

router.post('/dislike/:postId', isAuth, userController.dislike)

router.post('/friendrequest/:userId', isAuth, userController.friendRequesst)

router.post('/acceptrequest/:userId', isAuth, userController.acceptRequest)

router.get('/profile', isAuth, userController.profile)

module.exports = router

/*
    block
    share post
*/