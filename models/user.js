const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user' 
        }
    ],
    appendingRequest : [    
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user' 
        }   
    ],
    requests : [    
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user' 
        }   
    ]

})

module.exports = mongoose.model('user', userSchema)