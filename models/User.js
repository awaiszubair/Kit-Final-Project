const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum:[0,1 ,2],
    default: 0
  },
  gender: {
    type: String,
    // require: true
    default: null
  },
  city: {
    type: mongoose.Types.ObjectId,
    ref:'City',
    default: null
  },
  cnic: {
    type: String,
    // require: true
    default:null
  },
  password: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('user', userSchema);