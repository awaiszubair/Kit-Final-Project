const express = require('express');
const connectDB = require('./db/db');
const jwt = require('jsonwebtoken');
const { cityModel } = require('./models/cities');
require('dotenv').config();

var app = express();
connectDB();
app.use('/uploads', express.static('uploads'))

var port = process.env.PORT || 5000;


app.use(express.json({extended:false}))

//controller

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reset',require('./routes/reset'));
app.use('/api/forget',require('./routes/forget'));
// app.use('api/vendor/products', require('./routes/products'))

app.use('/api/products',require('./routes/products'))
app.use('/api/orders',require('./routes/order'))


// const data = {id:1 , name:"owais"}
// const token = jwt.sign(data , "secret")
// console.log("The token is" , token)
// const decrypt = jwt.verify(token , "secret")
// console.log("The token is" , decrypt)

app.listen(port,()=>{
    console.log("Server Started on Port: ",port);
})
