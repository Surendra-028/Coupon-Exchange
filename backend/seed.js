const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Coupon = require('./models/Coupon');
const { encrypt } = require('./utils/crypto');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing records
    await User.deleteMany({});
    await Coupon.deleteMany({});

    // 1. Create Multiple Dummy Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user1 = await User.create({
      username: 'AliceTrader',
      email: 'alice@example.com',
      password: hashedPassword
    });

    const user2 = await User.create({
      username: 'TokenMaster',
      email: 'master@example.com',
      password: hashedPassword
    });

    const user3 = await User.create({
      username: 'CouponQueen',
      email: 'queen@example.com',
      password: hashedPassword
    });

    const user4 = await User.create({
      username: 'DealHunter',
      email: 'hunter@example.com',
      password: hashedPassword
    });

    // 2. Create a Rich Set of Dummy Coupons
    const sampleCoupons = [
      {
        seller: user1._id,
        brand: 'Amazon',
        category: 'Shopping',
        faceValue: 100,
        price: 85,
        expiryDate: new Date('2027-12-31'),
        code: 'AMZN-100-PROMO-9921'
      },
      {
        seller: user1._id,
        brand: 'Netflix',
        category: 'Gaming',
        faceValue: 45,
        price: 35,
        expiryDate: new Date('2027-06-15'),
        code: 'NFLX-PREM-4421-2027'
      },
      {
        seller: user2._id,
        brand: 'Uber Eats',
        category: 'Food',
        faceValue: 30,
        price: 22,
        expiryDate: new Date('2026-11-30'),
        code: 'EATS-DELI-8819-FAST'
      },
      {
        seller: user2._id,
        brand: 'Steam',
        category: 'Gaming',
        faceValue: 60,
        price: 50,
        expiryDate: new Date('2028-01-01'),
        code: 'STEAM-60-GMR-3342'
      },
      {
        seller: user3._id,
        brand: 'Airbnb',
        category: 'Travel',
        faceValue: 200,
        price: 165,
        expiryDate: new Date('2027-09-20'),
        code: 'BNB-TRVL-7782-WRLD'
      },
      {
        seller: user3._id,
        brand: 'Starbucks',
        category: 'Food',
        faceValue: 25,
        price: 18,
        expiryDate: new Date('2026-12-10'),
        code: 'SBUX-COFFEE-5510-BREW'
      },
      {
        seller: user4._id,
        brand: 'Apple App Store',
        category: 'Shopping',
        faceValue: 50,
        price: 42,
        expiryDate: new Date('2027-04-12'),
        code: 'AAPL-APP-9912-STORE'
      },
      {
        seller: user4._id,
        brand: 'Nike',
        category: 'Shopping',
        faceValue: 120,
        price: 95,
        expiryDate: new Date('2027-08-19'),
        code: 'NIKE-SWOOSH-3321-KICKS'
      },
      {
        seller: user1._id,
        brand: 'PlayStation Store',
        category: 'Gaming',
        faceValue: 75,
        price: 60,
        expiryDate: new Date('2028-03-30'),
        code: 'PSN-GIFT-1123-GAME'
      },
      {
        seller: user2._id,
        brand: 'Delta Airlines',
        category: 'Travel',
        faceValue: 300,
        price: 245,
        expiryDate: new Date('2027-11-15'),
        code: 'DLTA-FLY-8821-SKY'
      },
      {
        seller: user3._id,
        brand: 'Spotify',
        category: 'Gaming',
        faceValue: 60,
        price: 48,
        expiryDate: new Date('2027-05-25'),
        code: 'SPTFY-PREM-9943-MUSIC'
      },
      {
        seller: user4._id,
        brand: 'Target',
        category: 'Shopping',
        faceValue: 80,
        price: 68,
        expiryDate: new Date('2027-10-05'),
        code: 'TRGT-DEAL-4451-CART'
      }
    ];

    for (const item of sampleCoupons) {
      const { encryptedCode, iv } = encrypt(item.code);
      await Coupon.create({
        seller: item.seller,
        brand: item.brand,
        category: item.category,
        faceValue: item.faceValue,
        price: item.price,
        expiryDate: item.expiryDate,
        encryptedCode,
        iv,
        status: 'active'
      });
    }

    console.log('Database successfully seeded with 4 users and 12 marketplace coupons!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();