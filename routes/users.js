const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {cityModel } = require('../models/cities');

const router = express.Router();

router.get('/',async (req,res)=>{
    try {
        const users = await User.find().populate('city');
        res.json(users);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
})


router.post('/addcity' , async(req , res)=>{

const {Cityname} = req.body

    const addCity = await cityModel.create({Cityname})
  return res.send(addCity)
  
  })



router.post('/',[
    check('name','enter valid name').not().isEmpty(),
    check('email','enter valid mail address').isEmail(),
    check('phone', 'contact should be in standard format').isLength({min:11}),
    check('password','please enter pass with length 6').isLength({min:6})
],async (req,res)=>{
    // res.send(req.body);
    const result = validationResult(req);
    const {phone} = req.body;
    console.log(phone);
    if (!result.isEmpty()) {
        console.log(result.array());
        return res.status(400).json({errors: result.array()})
        
    }
    const {name, email, password, gender, cnic, role,city} = req.body;
    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg:'User already Exists'});
            
        }
        user = new User({
            name,
            email,
            phone,
            gender,
            cnic,
            role,
            city,
            password
        })
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        const payload = {
            user:{
                id:user.id
            },
        }
        jwt.sign(
            payload,
            process.env.JWTSECRET || 'mySecretKey',
            {
                expiresIn: 3600000,
            },
            (err, token) => {
                if(err) throw err.message;
                res.json({token})
            }
        )
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;
