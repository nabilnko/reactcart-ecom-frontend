import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../contexts/ProductsContext';
import { useOrders } from '../../contexts/OrdersContext';
import './Dashboard.css';

const Dashboard = () => {
  const { products } = useProducts();
  const { orders } = useOrders();
  const [totalCustomers, setTotalCustomers] = useState(0);

  // NEW: Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Fetch real customer count from backend
  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/users/count', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const count = await response.json();
          setTotalCustomers(count);
        }
      } catch (error) {
        console.error('Error fetching customer count:', error);
        // Fallback to counting from orders
        setTotalCustomers(new Set(orders.map(o => o.userId)).size);
      }
    };
    
    fetchCustomerCount();
  }, [orders]);

  // Calculate stats from real data
  const stats = {
totalRevenue: orders.reduce((sum, order) => sum + (order.total - (order.deliveryCharge || 0)), 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: totalCustomers,
    revenueGrowth: orders.length > 0 ? '+12.5%' : '0%',
    ordersGrowth: orders.length > 0 ? `+${orders.length}` : '0',
    productsGrowth: `+${products.length}`,
    customersGrowth: totalCustomers > 0 ? `+${totalCustomers}` : '0'
  };

  // Get recent activity from real data
  const recentActivity = [
    ...orders.slice(0, 3).map(order => ({
      id: order.id,
      type: 'order',
      message: `New order ${order.id} from ${order.userName}`,
      time: new Date(order.createdAt).toLocaleString(),
      icon: '🛒'
    })),
    ...products.slice(0, 1).map(product => ({
      id: product.id,
      type: 'product',
      message: `Product in stock: ${product.name}`,
      time: 'Today',
      icon: '📦'
    }))
  ].slice(0, 3);

  // Get low stock products
  const lowStockProducts = products
    .filter(p => p.stock < 50)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      threshold: 50,
      status: p.stock < 30 ? 'critical' : 'warning'
    }));

  // NEW: Export functions
  const handleExport = () => {
    setShowExportModal(true);
  };

  const exportToCSV = () => {
    let filteredOrders = [...orders];

    // Filter based on export type
    if (exportType === 'dateRange' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    } else if (exportType === 'month' && selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === parseInt(year) && 
               orderDate.getMonth() === parseInt(month) - 1;
      });
    } else if (exportType === 'year' && selectedYear) {
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === parseInt(selectedYear);
      });
    }

    if (filteredOrders.length === 0) {
      alert('No orders found for the selected period');
      return;
    }

    // Create CSV content
    const headers = ['Order ID', 'Customer', 'Email', 'Order Date', 'Items', 'Payment Method', 'Delivery Method', 'Status', 'Total'];
    const csvRows = [headers.join(',')];

    filteredOrders.forEach(order => {
      const row = [
        order.id,
        `"${order.userName || order.firstName + ' ' + order.lastName}"`,
        order.userEmail || order.email,
        new Date(order.createdAt).toLocaleDateString(),
        order.items.length,
        `"${order.paymentMethod || 'N/A'}"`,
        `"${order.deliveryMethod || 'N/A'}"`,
        order.status,
        order.total.toFixed(2)
      ];
      csvRows.push(row.join(','));
    });

    // Download CSV
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const fileName = exportType === 'all' 
      ? 'all_orders.csv'
      : exportType === 'dateRange'
      ? `orders_${startDate}_to_${endDate}.csv`
      : exportType === 'month'
      ? `orders_${selectedMonth}.csv`
      : `orders_${selectedYear}.csv`;
    
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
    
    setShowExportModal(false);
    alert(`${filteredOrders.length} orders exported successfully!`);
  };

  return (
    <AdminLayout>
      <div className="dashboard-modern">
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className="header-actions">
            <button className="btn-outline" onClick={handleExport}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Export Data
            </button>
            <Link to="/admin/products" className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-modern">
          <div className="stat-card-modern revenue">
            <div className="stat-header">
              <div className="stat-icon-modern">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="stat-badge growth">{stats.revenueGrowth}</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Revenue</p>
              <h2 className="stat-value">৳{stats.totalRevenue.toFixed(2)}</h2>
            </div>
            <div className="stat-footer">
              <span className="stat-subtext">From {stats.totalOrders} orders</span>
            </div>
          </div>

          <div className="stat-card-modern orders">
            <div className="stat-header">
              <div className="stat-icon-modern">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="stat-badge growth">{stats.ordersGrowth}</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Orders</p>
              <h2 className="stat-value">{stats.totalOrders}</h2>
            </div>
            <div className="stat-footer">
              <span className="stat-subtext">{stats.totalOrders === 0 ? 'No orders yet' : 'All time orders'}</span>
            </div>
          </div>

          <div className="stat-card-modern products">
            <div className="stat-header">
              <div className="stat-icon-modern">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10m0-10L4 7m0 0v10l8 4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="stat-badge growth">{stats.productsGrowth}</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Products</p>
              <h2 className="stat-value">{stats.totalProducts}</h2>
            </div>
            <div className="stat-footer">
              <span className="stat-subtext">Active in inventory</span>
            </div>
          </div>

          <div className="stat-card-modern customers">
            <div className="stat-header">
              <div className="stat-icon-modern">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="stat-badge growth">{stats.customersGrowth}</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Customers</p>
              <h2 className="stat-value">{stats.totalCustomers}</h2>
            </div>
            <div className="stat-footer">
              <span className="stat-subtext">Registered users</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="dashboard-grid">
          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <Link to="/admin/orders" className="btn-text">View All</Link>
            </div>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-small">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Inventory Status */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Inventory Status</h3>
              <Link to="/admin/products" className="btn-text">Manage</Link>
            </div>
            <div className="inventory-list">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map(product => (
                  <div key={product.id} className="inventory-item">
                    <div className="inventory-info">
                      <span className="inventory-name">{product.name}</span>
                      <div className="inventory-bar">
                        <div 
                          className={`inventory-fill ${product.status}`}
                          style={{ width: `${(product.stock / product.threshold) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className={`inventory-badge ${product.status}`}>
                      {product.stock} units
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty-state-small">
                  <p>All products well stocked</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions-grid">
              <Link to="/admin/products" className="quick-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10m0-10L4 7m0 0v10l8 4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Add Product</span>
              </Link>
              <Link to="/admin/orders" className="quick-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>View Orders</span>
              </Link>
              <Link to="/admin/customers" className="quick-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Customers</span>
              </Link>
              <Link to="/admin/analytics" className="quick-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Analytics</span>
              </Link>
            </div>
          </div>
        </div>

        {/* NEW: Export Modal */}
        {showExportModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setShowExportModal(false)}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
                  Export Orders Data
                </h2>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  Select the time period for your export
                </p>
              </div>

              {/* Export Type Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px' }}>
                  Export Type
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{
                    padding: '12px 16px',
                    border: exportType === 'all' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: exportType === 'all' ? '#eff6ff' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <input
                      type="radio"
                      value="all"
                      checked={exportType === 'all'}
                      onChange={(e) => setExportType(e.target.value)}
                    />
                    <span style={{ fontWeight: '600' }}>All Orders</span>
                  </label>

                  <label style={{
                    padding: '12px 16px',
                    border: exportType === 'dateRange' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: exportType === 'dateRange' ? '#eff6ff' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <input
                      type="radio"
                      value="dateRange"
                      checked={exportType === 'dateRange'}
                      onChange={(e) => setExportType(e.target.value)}
                    />
                    <span style={{ fontWeight: '600' }}>Date Range</span>
                  </label>

                  <label style={{
                    padding: '12px 16px',
                    border: exportType === 'month' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: exportType === 'month' ? '#eff6ff' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <input
                      type="radio"
                      value="month"
                      checked={exportType === 'month'}
                      onChange={(e) => setExportType(e.target.value)}
                    />
                    <span style={{ fontWeight: '600' }}>Specific Month</span>
                  </label>

                  <label style={{
                    padding: '12px 16px',
                    border: exportType === 'year' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: exportType === 'year' ? '#eff6ff' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <input
                      type="radio"
                      value="year"
                      checked={exportType === 'year'}
                      onChange={(e) => setExportType(e.target.value)}
                    />
                    <span style={{ fontWeight: '600' }}>Specific Year</span>
                  </label>
                </div>
              </div>

              {/* Date Range Inputs */}
              {exportType === 'dateRange' && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Month Selector */}
              {exportType === 'month' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                    Select Month
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )}

              {/* Year Selector */}
              {exportType === 'year' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                    Select Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="">Choose a year</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowExportModal(false)}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #e5e7eb',
                    background: 'white',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={exportToCSV}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: '#3b82f6',
                    color: 'white',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
