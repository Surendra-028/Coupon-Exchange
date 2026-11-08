const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Coupon = require('./models/Coupon');
const { encrypt, decrypt } = require('./utils/crypto');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/users/me', authenticate, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

app.put('/api/users/settings', authenticate, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { username, email }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/coupons', async (req, res) => {
  try {
    const { search, category, maxPrice } = req.query;
    let query = { status: 'active' };
    
    if (search) query.brand = { $regex: search,$options: 'i' };
    if (category) query.category = category;
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    
    const coupons = await Coupon.find(query).populate('seller', 'username avatar').select('-encryptedCode -iv');
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/coupons', authenticate, async (req, res) => {
  try {
    const { brand, category, faceValue, price, expiryDate, code } = req.body;
    const { encryptedCode, iv } = encrypt(code);
    
    const newCoupon = await Coupon.create({
      seller: req.userId,
      brand,
      category,
      faceValue,
      price,
      expiryDate,
      encryptedCode,
      iv
    });
    
    res.status(201).json(newCoupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/coupons/my-listings', authenticate, async (req, res) => {
  try {
    const listings = await Coupon.find({ seller: req.userId }).select('-encryptedCode -iv');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/coupons/my-purchases', authenticate, async (req, res) => {
  try {
    const purchases = await Coupon.find({ buyer: req.userId, status: 'sold' });
    const result = purchases.map((coupon) => {
      const code = decrypt(coupon.encryptedCode, coupon.iv);
      return {
        _id: coupon._id,
        brand: coupon.brand,
        category: coupon.category,
        price: coupon.price,
        faceValue: coupon.faceValue,
        expiryDate: coupon.expiryDate,
        code: code
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/coupons/:id/buy', authenticate, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon || coupon.status === 'sold') {
      return res.status(400).json({ message: 'Coupon unavailable' });
    }
    
    coupon.status = 'sold';
    coupon.buyer = req.userId;
    await coupon.save();
    
    const decryptedCode = decrypt(coupon.encryptedCode, coupon.iv);
    res.json({ message: 'Purchase successful', code: decryptedCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});