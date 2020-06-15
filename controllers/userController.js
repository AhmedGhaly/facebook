const User = require('../models/user')
const Post = require('../models/post')
const user = require('../models/user')


exports.postPost = (req, res, next) => {
    const userId = req.userId
    const { content } = req.body
    const newPost = new Post({
        content: content,
        userId: userId
    })
    User.findById(userId).then(user => {
        if(!user) {
            const err = new Error('invalid userId')
            err.status = 403
            throw err
        }
        user.posts.push(newPost)
        return user.save()
    }).then(user => {
        return newPost.save()
    }).then(post => {
        res.status(201).json({
            message: 'done',
            post: post
        })
    })

}

exports.likePost = (req, res, next) => {
    const userId = req.userId
    const { postId } = req.params
    Post.findById(postId).then(post => {
        if(!post) {
            const err = new Error('invalid postId')
            err.status = 403
            throw err
        }
        const likeUser = post.dislikes.find(user => user == userId)
        if(likeUser) {
            console.log('the user make dislike to this post!!')
        }
        const user = post.likes.find(user => user == userId)
        if(!user) {
            post.likes.push(userId)
        }
        return post.save()
    }).then(post => {
        res.status(201).json({
            message: 'done',
            post: post
        })
    })
}

exports.dislike = (req, res, next) => {
    const userId = req.userId
    const { postId } = req.params
    Post.findById(postId).then(post => {
        if(!post) {
            const err = new Error('invalid postId')
            err.status = 403
            throw err
        }
        const likeUser = post.likes.find(user => user == userId)
        if(likeUser) {
            console.log('the user make like to this post!!')
        }
        const user = post.dislikes.find(user => user == userId)
        if(!user) {
            post.dislikes.push(userId)
        }
        return post.save()
    }).then(post => {
        res.status(201).json({
            message: 'done',
            post: post
        })
    })
}