const User = require("../models/user")

function compare(a, b) {
    if (new Date(a.postedAt) < new Date(b.postedAt)) return 1
    return -1
}


let posts = []
const post = users => {
    const user = users.map(use => {
        posts = posts.concat(use.posts)
    })
}


exports.home = (req, res, next) => {
    const {userId} = req
    User.findById(userId)
    .populate({
        path: 'posts',
        populate:{path: 'userId comments', select: 'name comments  userId comment', populate: {path: 'userId comments', select: 'name comments userId comment'}},
        
    })
    .populate({
        path: 'friends',
        select: 'posts',
        populate: {
            path: 'posts',
            populate:{path: 'userId comments', select: 'name comments  userId comment', populate: {path: 'userId comments', select: 'name comments userId comment'}},
        },

    }).then(user => {
        post(user.friends)
        posts = posts.concat(user.posts)
        posts.sort(compare)
        console.log(posts)
        res.status(200).json({
            message: 'done',
            posts: posts
        })
        posts = []
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}