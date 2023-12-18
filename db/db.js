const mongoose = require('mongoose');

const connectDB = ()=>{
    mongoose.connect(process.env.mongoURI)
    .then(()=>{ console.log("Db connected")})
    .catch((err)=>{console.error("Error is: ",err.message)})
}

module.exports = connectDB;