🎟️ CouponX — Peer-to-Peer Digital Coupon Marketplace

CouponX is a high-performance, full-stack Peer-to-Peer (P2P) Coupon & Voucher Exchange Marketplace. Built on the MERN stack (MongoDB, Express, React, Node.js), it empowers users to list, trade, buy, and manage unredeemed digital gift cards, promo codes, and discount vouchers securely.

🌟 Executive Summary & Key Highlights

Live Demo: https://coupon-exchange.vercel.app

Production API: https://coupon-backend-xwky.onrender.com

Architecture: Client-Server decoupled (React on Vercel Edge + Express on Render Cloud Containers).

Security Protocols: Encrypted voucher token storage (AES-256), JWT session authentication, and granular CORS protection.

UI/UX Design: Fully responsive 3-column dashboard layout with Tailwind CSS / Modern CSS, supporting real-time search, category filtering, and instant preview modal dialogs.

📱 Application Interface & Previews

Marketplace & Discovery

User Dashboard & Analytics

🛠️ Technology Stack

Frontend

Framework: React 18+ (SPA architecture)

Styling: Tailwind CSS / Custom CSS3 (Flexbox/Grid layout systems)

State & Routing: React Router v6, React Context API for global session state

HTTP Client: Axios with custom interceptors for Bearer token authorization

Backend

Runtime: Node.js (v18+)

Framework: Express.js

Database: MongoDB Atlas (Cloud hosted) with Mongoose ODM schemas

Authentication: JSON Web Tokens (jsonwebtoken) & bcryptjs password hashing

Security: AES-256 symmetric encryption for sensitive coupon code storage prior to purchase

Deployment & Infrastructure

Frontend Hosting: Vercel (Global CDN Edge Network)

Backend Hosting: Render Web Service

Database Cluster: MongoDB Atlas (M0 Shared Tier, AWS)





Browse available vouchers by category, discount %, and popularity.

Track active listings, sales analytics, and transaction history.

Encrypted Redemption Flow

Checkout Simulation





AES-256 encrypted claim codes are only revealed upon confirmed purchase.

Seamless card payment gateway interface with instant fulfillment.

(Note: Replace placeholder image links with actual screenshots of your running application).
