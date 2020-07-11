const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')
const NestedComment = require('../models/nestcomment')
exports.postPost = (req, res, next) => {
    const userId = req.userId
    const { content } = req.body
    const newPost = new Post({
        content: content,
        userId: userId,
        postedAt: Date.now()
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
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })

}

exports.deletePost = (req, res, next) => {
    const {userId} = req
    const {postId} = req.params
    Post.findById(postId).then(post => {
        if(!post) {
            const err = new Error('invalid post id')
            err.status = 403
            throw err
        }
        if(post.userId != userId) {
            const err = new Error('you not allow to do that')
            err.status = 403
            throw err
        }
        return Post.findByIdAndDelete(postId)
    }).then(post => {
        res.status(200).json({
            message: 'deleted'
        })
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}

exports.editePost = (req, res, next) => {
    const {userId} = req
    const {postId} = req.params
    const {content} = req.body
    Post.findById(postId).then(post => {
        if(!post) {
            const err = new Error('invalid post id')
            err.status = 403
            throw err
        }
        if(post.userId != userId) {
            const err = new Error('you not allow to do that')
            err.status = 403
            throw err
        }
        if(content)
            post.content = content
        return post.save()
    }).then(post => {
        res.status(200).json({
            message: 'done',
            post: post
        })
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
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
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
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
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}


exports.friendRequesst = (req, res, next) => {
    const userId = req.userId
    const frinedId = req.params.userId
    User.findById(userId).then(user => {
        if(!user) {
            const err = new Error('invalid userId')
            err.status = 403
            throw err
        }
        user.requests.push(frinedId)
        return user.save()
    }).then(user => {
        return User.findById(frinedId)
    }).then(user => {
        if(!user) {
            const err = new Error('invalid userId')
            err.status = 403
            throw err
        }
        user.appendingRequest.push(userId)
        return user.save()
    }).then(user => {
        res.status(200).json({
            message: 'done',
            user: user
        })
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}

exports.acceptRequest = (req, res, next) => {
    const userId = req.userId
    const frinedId = req.params.userId
    User.findById(userId).then(user => {
        if(!user) {
            const err = new Error('invalid userId')
            err.status = 403
            throw err
        }
        const requestsUser = user.appendingRequest.map(user => user == frinedId)
        if(requestsUser.length === 0) {
            const err = new Error('this user is not send a request to you')
            err.status = 403
            throw err
        }
        user.appendingRequest.map((u, i) => {
            if(u == frinedId) {
                user.appendingRequest.splice(i, 1)
            }
        })
        user.friends.push(frinedId)
        return user.save()
    }).then(user => {
        return User.findById(frinedId)
    }).then(user => {
        if(!user) {
            const err = new Error('invalid userId')
            err.status = 403
            throw err
        }
        const acceptsUser = user.requests.map(user => user == frinedId)
        if(acceptsUser.length === 0) {
            const err = new Error('this user is not send a request to you')
            err.status = 403
            throw err
        }
        user.requests.map((u, i) => {
            if(u == userId) {
                user.requests.splice(i, 1)
            }
        })
        user.friends.push(userId)
        return user.save()
    }).then(user => {
        res.status(200).json({
            message: 'done',
            user: user
        })
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })

}

exports.commentPost = (req, res, next) => {
    const {postId} = req.params
    const {userId} = req
    const {comment} = req.body
    let postComment
    const newComment = new Comment({
        userId: userId,
        comment: comment
    })
    newComment.save().then(comment => {
        postComment = comment
        return Post.findById(postId)
    }).then(post => {
        if(!post) {
            const err = new Error('invalid postId')
            err.status = 403
            throw err
        }
        post.comments.push(postComment)
        return post.save()
    }).then(post => {
        res.status(200).json({
            message: 'done',
            comment: postComment
        })
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}


exports.profile = (req, res, next) => {
    const {userId} = req
    User.findById(userId).populate({
        path: 'friends',
        populate: {path: 'friends'}
    }).then(user => {
        if(!user) {
            const err = new Error('invalid userId')
            err.status = 404
            throw err
        }
        res.status(201).json({
            message: 'done',
            user: user
        })
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}

exports.nestedComment = (req, res, next) => {
    const {userId} = req
    const {commentId} = req.params
    const {commentText} = req.body
    let newComment
    Comment.findById(commentId).then(comment => {
        if(!comment) {
            const err = new Error('invalid commentId')
            err.status = 404
            throw err
        }
        newComment = new NestedComment({
            comment: commentText,
            userId: userId
        })
        comment.comments.push(newComment)
        return comment.save()
    }).then(comment => {
        return newComment.save()
       
    }).then(comment => {
        res.status(200).json({
            message: 'done',
            comment: comment
        })
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}

exports.likeComment = (req, res, next) => {
    const {commentId} = req.params
    const {userId} = req
    Comment.findById(commentId).then(comment => {
        if(!comment) {
            const err = new Error('invalid commentId')
            err.status = 404
            throw err
        }
        const user = comment.likes.map(u => u == userId )
        const likes = comment.dislikes.map(u => u == userId)
        if(likes.length !== 0) {
            const err = new Error('this user is make dislikes before')
            err.status = 403
            throw err
        }
        if(user.length === 0) {
            comment.likes.push(userId)
        }
        return comment.save()
    }).then(comment => {
        res.status(201).json({
            message: 'done',
            comment: comment
        })
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}

exports.disLikeComment = (req, res, next) => {
    const {commentId} = req.params
    const {userId} = req
    Comment.findById(commentId).then(comment => {
        if(!comment) {
            const err = new Error('invalid commentId')
            err.status = 404
            throw err
        }
        const user = comment.dislikes.map(u => u == userId)
        const likes = comment.likes.map(u => u == userId)
        if(likes.length !== 0) {
            const err = new Error('this user is make likes before')
            err.status = 403
            throw err
        }
        if(user.length === 0) {
            comment.dislikes.push(userId)
        }
        return comment.save()
    }).then(comment => {
        res.status(201).json({
            message: 'done',
            comment: comment
        })
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}