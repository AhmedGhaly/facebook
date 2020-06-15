const jwt = require('jsonwebtoken')

module.exports = (req ,res, next) => {
    const authentication = req.get('Authorization')
    if(!authentication){
        const err = new Error("not authenticate")
        err.statusCode = 401
        throw err
    }
    const token = authentication
    let decodeToken;
    try {
        decodeToken = jwt.verify(token, process.env.JWT_TOKEN)
    } catch (err) {
        err.statusCode = 500
        throw err
    }
    if(!decodeToken){
        const err = new Error("not authenticate")
        err.statusCode = 401
        throw err
    }
    req.userId = decodeToken.id
    next()
}