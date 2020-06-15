const router = require('express').Router()


const isAuth = require('../middleware/isAuth')
const userController = require('../controllers/userController')


// post a post
router.post('/post', isAuth, userController.postPost)

router.post('/like/:postId', isAuth, userController.likePost)

router.post('/dislike/:postId', isAuth, userController.dislike)


module.exports = router

/*
    send request to anther user to make a friends
    share post

*/