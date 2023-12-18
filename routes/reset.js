const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const router = require('./users');
const speakeasy = require('speakeasy');


const secret = speakeasy.generateSecret({ length: 20 });
const routes = express.Router();

console.log("Main file is executing");

var otpFlag = false;


routes.post('/',[auth],async(req,res)=>{
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
  });
      console.log(`Your OTP is: ${otp}`);
     req.otp = otp;
     console.log("Secret key is ",secret.base32);
     console.log(req.otp);
  const {email} = req.body;
    // const otp = req.otp
    console.log("OTP is", otp);
    console.log(req.user);
    try {
      const user = await User.findOne({email})
      if(!user){
      return  res.json({msg:"Wrong email"})
      }
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
          to: `${user.email}`,
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



routes.post('/verify',[auth],(req,res)=>{
  const {id} = req.body;
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
  otpFlag = true;
  return res.json({verify})
})



routes.put('/verify',[auth],async(req,res)=>{
  const user = req.user;
  const {id} = user;
  const {password} = req.body;
  if(!id){
    return res.json({msg: "User not found"})
  }
    if(otpFlag){
      console.log(id);
      try {
        const update = {
            password
        }
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(password,salt);
        const updateUser = await User.findByIdAndUpdate({_id:id},update,{new:true})
        otpFlag = false;
       return res.status(200).json({updateUser})
    } catch (error) {
        return res.status(500).json({"msg":"Error to update the user"})
    }
    }
   return res.json({msg:"wrong otp code"})
    // console.log(id)
    // res.json({id,token});
})

module.exports = routes