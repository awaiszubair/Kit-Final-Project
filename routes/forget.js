const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const router = require('./users');
const speakeasy = require('speakeasy');
const  jwt = require('jsonwebtoken');


const secret = speakeasy.generateSecret({ length: 20 });
const routes = express.Router();
var mail = '';

console.log("Main file is executing");

var otpFlag = false;


routes.post('/',async(req,res)=>{
    const {email} = req.body;
    console.log(email);
    try {
      const user = await User.findOne({email})
      console.log(user);
      if(!user){
      return  res.json({msg:"Wrong email"})
      }
      mail = email;
      const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
      });
        

          console.log(`Your OTP is: ${otp}`);
         req.otp = otp;
         console.log("Secret key is ",secret.base32);
         console.log(req.otp);
        // const otp = req.otp
        console.log("OTP is", otp);
        // console.log(req.user);
      res.json({otp});
    const transporter = nodemailer.createTransport({
        service:"gmail",
          auth: {
            user: 'kickart11@gmail.com',
            pass: 'iccj tbvg xzlg xckt'
          }
        });
        const mailOptions = {
          from: 'kickart11@gmail.com',
          to: `${email}`,
          subject: 'OTP CODE',
          text: `Your OTP Code is ${otp} don't share this code with anyone`
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
          //   res.send('Mail Error: ', error);
          console.log("Error: ",error);
          } else {
            res.json({link})
            console.log('Email sent:', info.response);
          }
        });

    } catch (error) {
      res.json({msg:error.message})
    }
    // const token = req.tok;
   
})



routes.post('/verify',(req,res)=>{
  const {id ,email} = req.body;
  

  const isValid = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: id,
      window:1,
    });
    req.verify = isValid;
    console.log("Secret key is ",secret.base32);
    console.log("Verify otp is: ",id);
  const verify = req.verify;
  console.log("Verify is ",verify);
  if(!verify){
    return res.json({msg:"Wrong otp code"})
  }

  const token = jwt.sign({verified:true , email} , "secret")

  
  return res.json({msg:"OTP Verified" , token})
})



routes.put('/verify',async(req,res)=>{
//   const {id} = user;
 //const token = req.header
  

    //if(otpFlag){
    //   console.log(id);
      try {

        const {password , token } = req.body;

        const ISverified = jwt.verify(token,"secret")
        if(!ISverified){
            return res.json({msg:"Invalid Token"})
        
        }
        if(!ISverified.verified == true){
            return res.json({msg:"Wrong otp code"})
        }

        const update = {
            password
        }
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(password,salt);
        // const updateUser = await User.findByIdAndUpdate({_id:id},update,{new:true})
        const updateUser = await User.findOneAndUpdate({ email: `${ISverified.email}` }, update, { new: true })
        otpFlag = false;
       return res.status(200).json({updateUser})
    } catch (error) {
        return res.status(500).json({"msg":"Error to update the user"})
    }
    //}
    // console.log(id)
    // res.json({id,token});
})

module.exports = routes;