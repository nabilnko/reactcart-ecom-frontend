import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductsContext';
import { useOrders } from '../../contexts/OrdersContext';
import { API_URL } from '../../config/api';
import { authFetch } from '../../config/apiClient';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useProducts();
  const { orders } = useOrders();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate new orders count (pending status)
  const newOrdersCount = orders.filter(order => order.status === 'pending').length;
  
  // Total notifications count
  const totalNotifications = newOrdersCount + unreadCount;

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await authFetch(`${API_URL}/contact-messages/unread-count`);
        if (response.ok) {
          const count = await response.json();
          setUnreadCount(count);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.admin-user-menu')) {
        setShowUserMenu(false);
      }
      if (showNotifications && !event.target.closest('.notifications-wrapper')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const currentPath = location.pathname;
    
    if (currentPath.includes('/admin/products')) {
      navigate(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else if (currentPath.includes('/admin/orders')) {
      navigate(`/admin/orders?search=${encodeURIComponent(searchQuery.trim())}`);
    } else if (currentPath.includes('/admin/customers')) {
      navigate(`/admin/customers?search=${encodeURIComponent(searchQuery.trim())}`);
    } else if (currentPath.includes('/admin/messages')) {
      navigate(`/admin/messages?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Dashboard',
      badge: null
    },
    {
      path: '/admin/products',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10m0-10L4 7m0 0v10l8 4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Products',
      badge: products.length.toString()
    },
    {
      path: '/admin/categories',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Categories',
      badge: null
    },
    {
      path: '/admin/orders',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Orders',
      badge: null
    },
    {
      path: '/admin/messages',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Messages',
      badge: unreadCount > 0 ? unreadCount.toString() : null
    },
    {
      path: '/admin/customers',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Customers',
      badge: null
    },
    {
      path: '/admin/analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Analytics',
      badge: null
    }
  ];

  return (
    <div className="admin-layout-modern">
      {/* Top Header */}
      <header className="admin-header-modern">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>

          <div className="admin-brand">
            <img 
              src="/logo.png" 
              alt="KiaRa Lifestyle" 
              style={{ 
                height: '55px',
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
            <div className="brand-text">
              <span className="brand-name">KiaRa</span>
              <span className="brand-subtitle">Admin Panel</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          {/* Search */}
          <form onSubmit={handleSearch} className="header-search-admin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Notifications */}
          <div className="notifications-wrapper">
            <button 
              className="header-icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {totalNotifications > 0 && (
                <span className="notification-badge">{totalNotifications}</span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <span className="notifications-count">{totalNotifications} new</span>
                </div>

                <div className="notifications-list">
                  {totalNotifications === 0 ? (
                    <div className="notification-empty">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#d1d5db" strokeWidth="2"/>
                      </svg>
                      <p>No new notifications</p>
                    </div>
                  ) : (
                    <>
                      {/* New Orders Notifications */}
                      {newOrdersCount > 0 && (
                        <div 
                          className="notification-item"
                          onClick={() => {
                            setShowNotifications(false);
                            navigate('/admin/orders');
                          }}
                        >
                          <div className="notification-icon" style={{ background: '#fef3c7' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="#f59e0b" strokeWidth="2"/>
                            </svg>
                          </div>
                          <div className="notification-content">
                            <h4>{newOrdersCount} New Order{newOrdersCount > 1 ? 's' : ''}</h4>
                            <p>You have pending orders waiting for processing</p>
                            <span className="notification-time">Just now</span>
                          </div>
                        </div>
                      )}

                      {/* Unread Messages Notifications */}
                      {unreadCount > 0 && (
                        <div 
                          className="notification-item"
                          onClick={() => {
                            setShowNotifications(false);
                            navigate('/admin/messages');
                          }}
                        >
                          <div className="notification-icon" style={{ background: '#dbeafe' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#3b82f6" strokeWidth="2"/>
                            </svg>
                          </div>
                          <div className="notification-content">
                            <h4>{unreadCount} New Message{unreadCount > 1 ? 's' : ''}</h4>
                            <p>You have unread customer inquiries</p>
                            <span className="notification-time">Recent</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {totalNotifications > 0 && (
                  <div className="notifications-footer">
                    <button onClick={() => setShowNotifications(false)}>
                      Close Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="admin-user-menu">
            <button 
              className="user-btn-admin"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="user-info-admin">
                <span className="user-name-admin">{user?.name || 'Admin'}</span>
                <span className="user-role">Administrator</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>

            {showUserMenu && (
              <div className="user-dropdown-admin">
                <div className="dropdown-header-admin">
                  <p className="user-email-admin">{user?.email}</p>
                  <span className="admin-badge-dropdown">Admin</span>
                </div>
                <Link 
                  to="/admin/profile-settings"
                  className="dropdown-item-admin"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setShowUserMenu(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Profile Settings
                </Link>
                <button className="dropdown-item-admin">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Security
                </button>
                <button onClick={handleLogout} className="dropdown-item-admin logout-item-admin">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <aside className={`admin-sidebar-modern ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item-modern ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main-modern">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
