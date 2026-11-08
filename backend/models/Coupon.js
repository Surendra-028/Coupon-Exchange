const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  faceValue: { type: Number, required: true },
  price: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  encryptedCode: { type: String, required: true },
  iv: { type: String, required: true },
  status: { type: String, enum: ['active', 'sold'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);