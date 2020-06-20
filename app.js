const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const mongoose = require('mongoose')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')


require('dotenv').config()
app.use(cors())

// routers
const feedRouter = require('./routes/feed')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const commentRouter = require('./routes/comment')

app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/feed', feedRouter)
app.use(userRouter)
app.use(commentRouter)
app.use(authRouter)



//////////// error handling /////////////////////////
app.use((req, res, next) => {
    const err = new Error('this page is not found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    console.log(err)
    const status = err.status || 500
    res.status(status).json({
      message : err.message,
      data : err.data
    })
})
//////////////////////////////////////////////////

////////////// server config /////////////////
const port = process.env.PORT || '8080';
mongoose.connect(process.env.MONGOOSE_URL).then(() => {
    app.set('port', port);
    const server = http.createServer(app);
    
    server.listen(port);
})