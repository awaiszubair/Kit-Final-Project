const express = require('express');
const auth = require('../middlewares/auth');
const Product = require('../models/Products');
const multer  = require('multer');
const path = require('path');
///const upload = multer({ dest: 'uploads' });
const routes = express.Router();


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage })



routes.get('/',async(req,res)=>{
    try {
        const product = await Product.find()
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
})


routes.get("/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id); // Find product by ID in the database
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// POST : ADD PRODUCTS

routes.post('/',[auth, upload.single('image')],async(req,res)=>{
const {name, description, price, category,brand, quantity} = req.body;
console.log(req.file);
const image = req.file.filename
console.log("The image is: ",image);
const id = req.user.id;
try {
    const data = {
        name,
        description,
        price,
        category,
        brand,
        quantity,
        postedBy:id,
        img:image
    }
    const productCreate = await Product.create(data);
    res.status(201).json(productCreate)    
} catch (error) {
    res.status(400).json({msg:"Error to create Product"})
}



})



routes.put('/:pid',auth,async(req,res)=>{
    const {pid} = req.params
    const {name, description, price, category, quantity} = req.body;
    const id = req.user.id;
    console.log("PUT API")
   // const {pid} = req.params
    try {
        const data = {
            name,
            description,
            price,
            category,
            quantity,
            postedBy:id
        }
        const productCreate = await Product.findByIdAndUpdate(pid,data,{new:true});
        res.status(201).json(productCreate)    
    } catch (error) {
        res.status(400).json({msg:"Error to create Product"})
    }
    
    })


    routes.delete('/:pid',auth,async(req,res)=>{
        console.log("PUT API")
       const {pid} = req.params
        try {
            const productDelete = await Product.findByIdAndDelete(pid);
            res.status(201).json({msg:"Product Deleted Succesfully"})    
        } catch (error) {
            res.status(400).json({msg:error.message})
        }
        
        })
        



module.exports = routes;