const express = require('express');
const routes = express.Router();
const Product = require('../models/Products');
const user = require('../models/User');
const auth = require('../middlewares/auth');
const Order = require('../models/Orders');


routes.get('/',async(req,res)=>{
    try {
        const orders = await Order.find();
        res.status(200).json(orders)
    } catch (error) {
        res.json(500).json(orders)
    }
})

routes.get('/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        const orders = await Order.findOne({_id:`${id}`})
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
})


// Post Customer's Orders into Database
routes.post('/:pid',auth,async(req,res)=>{
    // const id = req.user.id;
    const {pid} = req.params;
    const {shippingAddress,paymentMethod,amount} = req.body;
    console.log(pid);
    const data = {
        productId:pid,
        customerId:req.user.id,
        shippingAddress,
        paymentMethod,
        amount
    }
    try {
        const Orders = await Order.create(data)
        res.status(200).json(Orders);
     
      } catch (err) {
        // Handle error
        res.json({ msg: err.message });
      }



})

module.exports = routes;

