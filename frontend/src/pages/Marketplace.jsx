import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Clock, CheckCircle2, CreditCard, Lock, X } from 'lucide-react';

const API_BASE = 'https://coupon-backend-xwky.onrender.com';

export default function Marketplace() {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [purchasedCode, setPurchasedCode] = useState(null);
  
  // Stripe Checkout Modal States
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/coupons`, {
        params: { search, category }
      });
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [search, category]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchCoupons();
  }, [search, category, fetchCoupons]);

  const handleOpenCheckout = (coupon) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to buy items');
    setSelectedCoupon(coupon);
  };

  const handleStripePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const token = localStorage.getItem('token');

    try {
      // Simulate secure Stripe payment network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await axios.post(`${API_BASE}/coupons/${selectedCoupon._id}/buy`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPurchasedCode(res.data.code);
      setSelectedCoupon(null);
      setCardDetails({ number: '', expiry: '', cvc: '' });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase & payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-container">
      {purchasedCode && (
        <div className="success-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={24} color="#34d399" />
            <div>
              <h4 style={{ fontWeight: 600, color: '#34d399' }}>Payment Successful & Token Unlocked!</h4>
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
                Your unlocked code: <span style={{ fontFamily: 'monospace', background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#fff', userSelect: 'all' }}>{purchasedCode}</span>
              </p>
            </div>
          </div>
          <button onClick={() => setPurchasedCode(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}

      <div className="marketplace-header">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Marketplace</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>Discover verified unused tokens and coupons</p>
        </div>
        
        <div className="filter-bar">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search store or brand..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Food">Food & Dining</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>
      </div>

      <div className="coupons-grid">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="coupon-card">
            <div>
              <div className="coupon-top">
                <span className="category-badge">{coupon.category}</span>
                <span className="expiry-text">
                  <Clock size={12} />
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{coupon.brand}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Face Value: <span style={{ textDecoration: 'line-through', color: '#64748b' }}>${coupon.faceValue}</span>
              </p>
            </div>

            <div className="coupon-footer">
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Price</span>
                <span className="price-tag">${coupon.price}</span>
              </div>
              <button onClick={() => handleOpenCheckout(coupon)} className="buy-btn">
                Buy Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stripe Checkout Modal */}
      {selectedCoupon && (
        <div className="modal-backdrop">
          <div className="stripe-modal">
            <div className="stripe-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="stripe-logo">Stripe</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', borderLeft: '1px solid #334155', paddingLeft: '0.5rem' }}>Checkout</span>
              </div>
              <button onClick={() => setSelectedCoupon(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{selectedCoupon.brand} Token</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Verified escrow unlock</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>${selectedCoupon.price}</div>
            </div>

            <form onSubmit={handleStripePayment}>
              <div className="form-group">
                <label className="form-label">Card Information</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={16} style={{ position: 'absolute', left: '0.75rem', top: '0.85rem', color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    required
                    maxLength="19"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Expiration</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    maxLength="5"
                    className="form-input"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">CVC</label>
                  <input
                    type="password"
                    placeholder="123"
                    required
                    maxLength="4"
                    className="form-input"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" disabled={isProcessing} className="primary-btn" style={{ backgroundColor: '#635bff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={14} />
                <span>{isProcessing ? 'Processing Payment...' : `Pay $${selectedCoupon.price}`}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}>
                <Lock size={12} /> Payments secured by Stripe Connect
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}