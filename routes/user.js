const router = require('express').Router()
const body = require('express-validator').body

const isAuth = require('../middleware/isAuth')
const userController = require('../controllers/userController')


///////////////////// posts /////////////////////////////////////////
router.post('/post'
    , isAuth
    , body('content').not().isEmpty()
    , userController.postPost)

router.put('/post/:postId', isAuth, userController.editePost)

router.post('/like/:postId', isAuth, userController.likePost)

router.post('/dislike/:postId', isAuth, userController.dislike)

router.delete('/post/:postId', isAuth, userController.deletePost)

////////////////////////////////////////////////////////////////////////

router.post('/friendrequest/:userId', isAuth, userController.friendRequesst)

router.post('/acceptrequest/:userId', isAuth, userController.acceptRequest)

router.get('/profile', isAuth, userController.profile)

module.exports = router

/*
    block
    share post
    validation
*/