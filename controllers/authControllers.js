const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validationResult = require('express-validator').validationResult

const User = require('../models/user')

exports.login = (req, res, next) => {
    const {email, password } = req.body
    let logUser
    const err = validationResult(req)
    if(!err.isEmpty()) {
        err.status = 400
        res.status(500).json({
            err: err.array()
        })
    }
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
            token: token,
            userId: logUser._id,
            userName: logUser.name
        })
    }).catch(err => {
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}

exports.signup = (req, res, next) => {
    const { email, password, name } = req.body
    const err = validationResult(req)
    if(!err.isEmpty()) {
        err.status = 400
        res.status(500).json({
            err: err.array()
        })
    }
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
        if(!err.status)
            err.status = 500
        res.status(err.status).json({
            err: err.message
        })
    })
}