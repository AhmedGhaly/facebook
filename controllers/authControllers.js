const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

exports.login = (req, res, next) => {
    const {email, password } = req.body
    let logUser
    User.findOne({email: email}).then(user => {
        if(!user) {
            const err = new Error('this email dose not exist in the data base')
            err.status = 404
            throw (err)
        }
        logUser = user
        return bcrypt.compare(password, user.password)
    }).then(isMatched => {
        if(!isMatched) {
            const err = new Error('wrong password')
            err.status = 401
            throw err
        }
        const token = jwt.sign({id: logUser._id}, process.env.JWT_TOKEN)
        res.status(200).json({
            message: 'done',
            token: token
        })
    }).catch(err => {
        if(!err.statusCode)
            err.statusCode = 500
        next(err)
    })
}

exports.signup = (req, res, next) => {
    const { email, password, name } = req.body
    User.findOne({email: email}).then(user => {
        if(user) {
            const err = new Error('this is is aleady exist')
            err.status = 401
            throw(err)
        }
        return bcrypt.hash(password, 12)
    }).then(hashPass => {
        const user = new User({
            email: email,
            password: hashPass,
            name: name
        })
        return user.save()
    }).then(user => {
        res.status(200).json({
            message: 'done',
            user: user
        })
    }).catch(err => {
        if(!err.statusCode)
            err.statusCode = 500
        next(err)
    })
}