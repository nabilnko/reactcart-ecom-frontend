import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrdersContext';
import axios from 'axios';
import { API_URL } from '../../config/api';
import './PublicLayout.css';

const PublicLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getCartCount } = useOrders();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]); // NEW

  const role = (user?.role || '').toString().toUpperCase();
  const isAdmin = role.includes('ADMIN');
  const isCustomer = role.includes('CUSTOMER');

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="public-layout">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-left">
            <span>📞 Hotline: +880 1234-567890</span>
            <span>📧 support@kiaralifestyle.com</span>
          </div>
          <div className="top-bar-right">
            <span>Free shipping on orders over ৳1000</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="public-header">
        <div className="header-content-public">
          {/* Logo */}
          <Link to="/" className="brand-public">
            <img 
              src="/logo.png" 
              alt="KiaRa Lifestyle" 
              style={{ 
                height: '55px',
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="header-search-public">
            <input 
              type="text" 
              placeholder="Search for products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="search-btn-public"
              disabled={!searchQuery.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </form>

          {/* Header Actions */}
          <div className="header-actions-public">
            {/* Cart */}
            <button 
              className="icon-btn-public cart-btn-public"
              onClick={() => navigate('/cart')}
              title="View Cart"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {getCartCount() > 0 && <span className="cart-badge-public">{getCartCount()}</span>}
            </button>

            {/* Login/Signup or User Menu */}
            {user ? (
              <div className="user-menu-public">
                <button 
                  className="user-btn-public"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{user.name}</span>
                </button>

                {showUserMenu && (
  <div className="user-dropdown-public">
    <div className="dropdown-header-public">
      <p>{user.email}</p>
      <span className="role-badge">{user.role}</span>
    </div>
    {isCustomer && (
      <>
        <Link to="/my-orders" className="dropdown-item-public" onClick={() => setShowUserMenu(false)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
          </svg>
          My Orders
        </Link>
        <Link to="/profile-settings" className="dropdown-item-public" onClick={() => setShowUserMenu(false)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Profile Settings
        </Link>
      </>
    )}
    {isAdmin && (
      <>
        <Link to="/admin/dashboard" className="dropdown-item-public" onClick={() => setShowUserMenu(false)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
          </svg>
          Admin Dashboard
        </Link>
        <Link to="/admin/profile-settings" className="dropdown-item-public" onClick={() => setShowUserMenu(false)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Profile Settings
        </Link>
      </>
    )}
    <button onClick={handleLogout} className="dropdown-item-public logout-item-public">

                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <button onClick={() => navigate('/login')} className="btn-login">
                  Login
                </button>
                <button onClick={() => navigate('/register')} className="btn-signup">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation - DYNAMIC CATEGORIES */}
        <nav className="main-nav-public">
          <div className="nav-content-public">
            <Link to="/" className="nav-link-public">Home</Link>
            <Link to="/shop" className="nav-link-public">All Products</Link>
            
            {/* DYNAMIC CATEGORIES FROM BACKEND */}
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/shop?category=${encodeURIComponent(category.name)}`} 
                className="nav-link-public"
              >
                {category.name}
              </Link>
            ))}
            
            <Link to="/shop?sale=true" className="nav-link-public sale-link-public">
              Sale 🔥
            </Link>
          </div>
        </nav>
      </header>

      <main className="public-main">
        {children}
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-content-public">
          <div className="footer-section-public">
            <h4>About KiaRa Lifestyle</h4>
            <p>Your trusted destination for elegant fashion and quality lifestyle products.</p>
          </div>

          <div className="footer-section-public">
            <h4>Customer Service</h4>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/shipping-returns">Shipping & Returns</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
            </ul>
          </div>

          <div className="footer-section-public">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/shop">Shop All</Link></li>
              <li><Link to="/shop?sale=true">Sale</Link></li>
            </ul>
          </div>

          <div className="footer-section-public">
            <h4>Newsletter</h4>
            <p>Subscribe to get special offers</p>
            <div className="newsletter-form-public">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom-public">
          <p>&copy; 2025 KiaRa Lifestyle. All rights reserved.</p>
          <div className="payment-methods-public">
            <span>💳 Visa</span>
            <span>💳 Mastercard</span>
            <span>💰 bKash</span>
            <span>💰 Nagad</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
