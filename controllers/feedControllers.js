const User = require("../models/user")
const { populate } = require("../models/user")

exports.home = (req, res, next) => {
    const {userId} = req
    User.findById(userId).populate({
        path: 'friends',
        select: 'posts',
        populate: 'posts'
    }).then(user => {
        res.status(200).json({
            message: 'done',
            user: user.friends
        })
    })
}