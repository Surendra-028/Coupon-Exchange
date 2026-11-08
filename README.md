# 🎟️ CouponX — Peer-to-Peer Digital Coupon Marketplace

![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

---

## 📌 Overview

**CouponX** solves a common everyday problem: unredeemed discount vouchers and promo codes going to waste. It provides a secure, modern marketplace where sellers can monetize unused gift cards and buyers can grab instant savings across top brands.

---

## 🚀 Live Links

| Component | Platform | URL |
| :--- | :--- | :--- |
| **🌐 Frontend Application** | **Vercel** | [https://coupon-exchange.vercel.app](https://coupon-exchange.vercel.app) |
| **⚙️ Backend API Base** | **Render** | [https://coupon-backend-xwky.onrender.com/api](https://coupon-backend-xwky.onrender.com/api) |

---

## ✨ Key Features

* 🔐 **Secure Authentication**: JWT-based user login & registration with encrypted session persistence.
* 🛍️ **Coupon Marketplace**: Dynamic browsing grid with real-time category filtering & instant search.
* 🛡️ **AES-256 Code Encryption**: Sensitive coupon codes remain encrypted until a verified transaction completes.
* 💳 **Simulated Checkout**: Seamless, friction-free purchase workflow for instant coupon code retrieval.
* 📊 **User Dashboard**: Track active listings, view sales history, and manage account credentials.
* 📱 **Mobile-Responsive**: Fully optimized for seamless browsing across desktops, tablets, and smartphones.

---

## 🛠️ Tech Stack & Architecture

### 💻 System Workflow
  
  ┌─────────────────┐       HTTPS / REST       ┌─────────────────┐
│  React Frontend │ ───────────────────────> │ Express Backend │
│   (via Vercel)  │ <─────────────────────── │  (via Render)   │
└─────────────────┘      Bearer JWT Token    └────────┬────────┘
│
│ Mongoose ODM
▼
┌─────────────────┐
│  MongoDB Atlas  │
│ (Cloud Database)│
└─────────────────┘
### 🛠️ Core Technologies

| Category | Technology |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, CSS3 Flexbox/Grid, Axios |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js |
| **Database** | MongoDB Atlas (Cloud Hosted) with Mongoose ODM |
| **Security** | AES-256 Symmetric Encryption for unpurchased codes |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📸 Application Preview

| Marketplace & Discovery | User Dashboard & Listings |
| :---: | :---: |
| ![Marketplace Preview](https://via.placeholder.com/400x220?text=Marketplace+Browse+UI) | ![Dashboard Preview](https://via.placeholder.com/400x220?text=User+Dashboard+UI) |

---

## ⚡ Quick Start & Local Setup

Follow these steps to run the application locally on your machine:

### 1️⃣ Clone the Repository
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/coupon-exchange.git](https://github.com/YOUR_GITHUB_USERNAME/coupon-exchange.git)
cd coupon-exchange

2️⃣ Configure & Start Backend
Bash
cd backend

Create a .env file in the backend/ folder:
Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_32_character_encryption_key
npm install

Start the backend server:
Bash
npm start

3️⃣ Configure & Start Frontend
Open a new terminal window:

Bash
cd frontend
npm install
npm start
The application will open automatically in your browser at http://localhost:3000.

📝 Seed Demo Data
To populate your database with initial users and coupons for testing:

Bash
cd backend
node seed.js
📜 License
Distributed under the MIT License. See LICENSE for more information.
