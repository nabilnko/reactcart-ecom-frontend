import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrdersContext';
import axios from 'axios';
import { API_URL } from '../../config/api';
import './CustomerLayout.css';

const CustomerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useOrders();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-new')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="customer-layout-new">
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
      <header className="customer-header-new">
        <div className="header-content-new">
          {/* Logo */}
          <Link to="/" className="brand-new">
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
          <form onSubmit={handleSearch} className="header-search">
            <input 
              type="text" 
              placeholder="Search for products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="search-btn"
              disabled={!searchQuery.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </form>

          {/* Header Actions */}
          <div className="header-actions-new">
            {/* Cart Button */}
            <button 
              className="icon-btn-new cart-btn"
              onClick={() => navigate('/my-orders')}
              title="View Cart"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
            </button>

            {/* User Menu */}
            <div className="user-menu-new">
              <button 
                className="icon-btn-new user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="user-name">{user?.name || 'Account'}</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <p className="user-email">{user?.email}</p>
                    <span className="user-badge">Customer</span>
                  </div>
                  
                  <Link to="/my-orders" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                      <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
                    </svg>
                    My Orders
                  </Link>
                  
                  <Link to="/profile-settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Profile Settings
                  </Link>
                  
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="main-nav">
          <div className="nav-content">
            <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
              Home
            </Link>
            <Link to="/shop" className={isActive('/shop') ? 'nav-link active' : 'nav-link'}>
              All Products
            </Link>
            
            {/* Dynamic Categories */}
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/shop?category=${encodeURIComponent(category.name)}`} 
                className="nav-link"
              >
                {category.name}
              </Link>
            ))}
            
            <Link to="/my-orders" className={isActive('/my-orders') ? 'nav-link active' : 'nav-link'}>
              My Orders
            </Link>
            <Link to="/shop?sale=true" className="nav-link sale-link">
              Sale 🔥
            </Link>
          </div>
        </nav>
      </header>

      <main className="customer-main-new">
        {children}
      </main>

      {/* Footer */}
      <footer className="customer-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About KiaRa Lifestyle</h4>
            <p>Your trusted destination for elegant fashion and quality lifestyle products.</p>
            <div className="social-links">
              <a href="#" className="social-icon">📘</a>
              <a href="#" className="social-icon">📷</a>
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">▶️</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/shop">Shop All</Link></li>
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">Best Sellers</a></li>
              <li><a href="#">Sale</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Subscribe to get special offers and updates</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 KiaRa Lifestyle. All rights reserved.</p>
          <div className="payment-methods">
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

export default CustomerLayout;
