import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';

const API_BASE = 'https://coupon-backend-xwky.onrender.com';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('purchases');
  const [listings, setListings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    brand: '', category: 'Food', faceValue: '', price: '', expiryDate: '', code: ''
  });

  useEffect(() => {
    fetchListings();
    fetchPurchases();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/coupons/my-listings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/coupons/my-purchases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/coupons`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ brand: '', category: 'Food', faceValue: '', price: '', expiryDate: '', code: '' });
      fetchListings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to list coupon');
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Dashboard</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage your active sales and view your unlocked purchases</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="primary-btn"
          style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <PlusCircle size={16} />
          <span>New Listing</span>
        </button>
      </div>

      <div className="tabs-nav">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`tab-btn ${activeTab === 'purchases' ? 'active' : ''}`}
        >
          My Purchased Codes ({purchases.length})
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
        >
          My Listings for Sale ({listings.length})
        </button>
      </div>

      {activeTab === 'purchases' ? (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Category</th>
                <th>Paid</th>
                <th>Unlocked Coupon Code</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{item.brand}</td>
                  <td>{item.category}</td>
                  <td style={{ color: '#34d399', fontWeight: 600 }}>${item.price}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', background: '#1e293b', color: '#818cf8', border: '1px solid #334155', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', userSelect: 'all' }}>
                      {item.code}
                    </span>
                  </td>
                  <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No purchases yet. Visit the Marketplace to buy your first token!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Category</th>
                <th>Face Value</th>
                <th>Listing Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{item.brand}</td>
                  <td>{item.category}</td>
                  <td>${item.faceValue}</td>
                  <td style={{ color: '#34d399', fontWeight: 600 }}>${item.price}</td>
                  <td>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: item.status === 'active' ? 'rgba(52, 211, 153, 0.1)' : '#1e293b', color: item.status === 'active' ? '#34d399' : '#94a3b8' }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>List New Token</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Brand Name (e.g. Amazon)"
                  required
                  className="form-input"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
              <div className="form-group">
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Food">Food & Dining</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="number"
                  placeholder="Face Value ($)"
                  required
                  className="form-input"
                  value={formData.faceValue}
                  onChange={(e) => setFormData({ ...formData, faceValue: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Selling Price ($)"
                  required
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  required
                  className="form-input"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Secret Coupon Code / Voucher"
                  required
                  className="form-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="primary-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}