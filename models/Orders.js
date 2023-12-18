const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },

  shippingAddress:{
    type:String,
    required:true
  },
  paymentMethod:{
    type:String,
    required:true
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;