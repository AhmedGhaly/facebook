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
    res.status(404).json({
        err: 'this page is not found'
    })
})
//////////////////////////////////////////////////

////////////// server config /////////////////
const port = process.env.PORT;
mongoose.connect(process.env.MONGOOSE_URL).then(() => {
    app.set('port', port);
    const server = http.createServer(app);
    
    server.listen(port);
})