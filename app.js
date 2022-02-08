//app config env
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan')
const mongooseClient = require('mongoose');
const userRoute = require('./routes/user');
const app = express();

//setup connect mongodb by mongoose

mongooseClient.connect('mongodb://localhost/nodejsapistarter', {
    // useNewUrlParse: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true


})
    .then(() => console.log('Connect database success.'))
    .catch((error) => console.error(`Connect database error is ${error}`));

//Middlewares Chạy trước khi các hàm xử lý
app.use(logger('dev'));
app.use(bodyParser.json());



// Routes 
app.use('/users', userRoute);

//Rourtes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Sever is Ok123123123'
    })
})

//Catch 404 Error

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;

    next(err);
});


//Error trả lỗi cho client

app.use((err, req, res, next) => {
    const error = app.get("env") === "development" ? err : {};
    const status = err.status || 500;
  
    // response to client
    return res.status(status).json({
      error: {
        message: error.message,
      },
    });
  });

//Start the Sever

const port = app.get('port') || 3000;

app.listen(port, () => console.log(`Sever is listening on port ${port}`))