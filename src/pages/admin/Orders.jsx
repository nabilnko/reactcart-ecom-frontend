import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useOrders } from '../../contexts/OrdersContext';
import { backendAssetUrl } from '../../config/api';

const Orders = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#f59e0b' },
    { value: 'processing', label: 'Processing', color: '#3b82f6' },
    { value: 'shipped', label: 'Shipped', color: '#8b5cf6' },
    { value: 'delivered', label: 'Delivered', color: '#10b981' },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444' }
  ];

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color : '#6b7280';
  };

  const getPaymentStatusColor = (method) => {
    if (method?.toLowerCase().includes('online')) return '#10b981';
    if (method?.toLowerCase().includes('cash')) return '#f59e0b';
    return '#6b7280';
  };

  const getPaymentStatusLabel = (method) => {
    if (method?.toLowerCase().includes('online')) return 'Online Paid';
    if (method?.toLowerCase().includes('cash')) return 'Cash on Delivery';
    if (method?.toLowerCase().includes('pos')) return 'POS on Delivery';
    return method || 'Not Specified';
  };

  // Filter orders by status AND search query
  // NEW CODE - Only search by ORDER ID (exact matching)
const filteredOrders = orders.filter(order => {
  const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
  
  if (!searchQuery) return matchesStatus;
  
  const matchesSearch = order.id.toString().includes(searchQuery);
  
  return matchesStatus && matchesSearch;
});


  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    alert('Order status updated successfully!');
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937', margin: '0 0 8px 0' }}>
            Order Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
            View and manage all customer orders
          </p>
          {searchQuery && (
            <div style={{
              marginTop: '12px',
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white'
            }}>
              <span>🔍 Showing results for: "<strong>{searchQuery}</strong>" ({filteredOrders.length} found)</span>
              <button
                onClick={() => navigate('/admin/orders')}
                style={{
                  background: 'white',
                  color: '#3b82f6',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>Total Orders</p>
            <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#1f2937', margin: 0 }}>
              {orders.length}
            </h3>
          </div>
          {statusOptions.slice(0, 4).map(status => (
            <div key={status.value} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'capitalize' }}>
                {status.label}
              </p>
              <h3 style={{ fontSize: '28px', fontWeight: '800', color: status.color, margin: 0 }}>
                {orders.filter(o => o.status === status.value).length}
              </h3>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '10px 20px',
              border: filterStatus === 'all' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
              background: filterStatus === 'all' ? '#eff6ff' : 'white',
              color: filterStatus === 'all' ? '#3b82f6' : '#6b7280',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s'
            }}
          >
            All ({orders.length})
          </button>
          {statusOptions.map(status => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value)}
              style={{
                padding: '10px 20px',
                border: filterStatus === status.value ? `2px solid ${status.color}` : '2px solid #e5e7eb',
                background: filterStatus === status.value ? `${status.color}15` : 'white',
                color: filterStatus === status.value ? status.color : '#6b7280',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
            >
              {status.label} ({orders.filter(o => o.status === status.value).length})
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '80px 40px',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>📦</div>
            <h2 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '12px' }}>
              No orders found
            </h2>
            <p style={{ color: '#6b7280' }}>
              {searchQuery 
                ? `No results for "${searchQuery}"` 
                : filterStatus === 'all' 
                ? 'Orders will appear here once customers make purchases' 
                : `No ${filterStatus} orders at the moment`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredOrders.map(order => (
              <div key={order.id} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s'
              }}>
                {/* Order Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Order ID</p>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                      {order.id}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Customer</p>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      {order.userName || order.firstName + ' ' + order.lastName}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                      {order.userEmail || order.email}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Order Date</p>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Payment Method</p>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      background: `${getPaymentStatusColor(order.paymentMethod)}15`,
                      color: getPaymentStatusColor(order.paymentMethod)
                    }}>
                      {getPaymentStatusLabel(order.paymentMethod)}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Delivery Method</p>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      background: order.deliveryMethod === 'home' ? '#dbeafe' : order.deliveryMethod === 'express' ? '#fef3c7' : '#d1fae5',
                      color: order.deliveryMethod === 'home' ? '#1e40af' : order.deliveryMethod === 'express' ? '#d97706' : '#047857'
                    }}>
                      {order.deliveryMethod === 'home' ? '🏠 Home' : 
                       order.deliveryMethod === 'express' ? '⚡ Express' : 
                       order.deliveryMethod === 'pickup' ? '🏪 Pickup' : 
                       'N/A'}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Amount</p>
                    <p style={{ fontSize: '24px', fontWeight: '800', color: '#3b82f6', margin: 0 }}>
                      ৳{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
                    Order Items ({order.items.length})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {order.items.map((item, index) => (
                      <div key={index} style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr auto auto',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f9fafb',
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          background: 'white',
                          borderRadius: '8px',
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={
                              item.product?.image 
                                ? (item.product.image.startsWith('http') 
                                    ? item.product.image 
                                  : backendAssetUrl(item.product.image))
                                : 'https://via.placeholder.com/60x60?text=No+Image'
                            }
                            alt={item.product?.name || 'Product'}
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                            }}
                          />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <p style={{ fontWeight: '600', margin: 0, fontSize: '15px' }}>
                              {item.product?.name || 'Unknown Product'}
                            </p>
                            <span style={{ 
                              background: '#3b82f6', 
                              color: 'white',
                              padding: '2px 8px', 
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}>
                              #{item.product?.id || item.productId || 'N/A'}
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                            ৳{parseFloat(item.price || 0).toFixed(2)} × {item.quantity || 1}
                          </p>
                        </div>

                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          Qty: {item.quantity || 1}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>
                          ৳{(parseFloat(item.price || 0) * parseInt(item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '20px',
                  borderTop: '1px solid #f3f4f6',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      Order Status:
                    </span>
                    <span style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '700',
                      background: `${getStatusColor(order.status)}15`,
                      color: getStatusColor(order.status),
                      textTransform: 'capitalize'
                    }}>
                      {order.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Update to:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '8px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        background: 'white',
                        color: '#374151'
                      }}
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      style={{
                        padding: '8px 16px',
                        border: '2px solid #3b82f6',
                        background: 'white',
                        color: '#3b82f6',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedOrder === order.id && (
                  <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                      Additional Details
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      <div>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
                          Shipping Address
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                          {order.shippingAddress || order.address || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
                          District
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                          {order.district || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
                          Phone Number
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                          {order.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
                          Payment Method
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                          {order.paymentMethod || 'Cash on Delivery'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
                          Delivery Method
                        </p>
                        <span style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '700',
                          background: order.deliveryMethod === 'home' ? '#dbeafe' : order.deliveryMethod === 'express' ? '#fef3c7' : '#d1fae5',
                          color: order.deliveryMethod === 'home' ? '#1e40af' : order.deliveryMethod === 'express' ? '#d97706' : '#047857'
                        }}>
                          {order.deliveryMethod === 'home' ? '🏠 Home Delivery' : 
                           order.deliveryMethod === 'express' ? '⚡ Express Delivery' : 
                           order.deliveryMethod === 'pickup' ? '🏪 Store Pickup' : 
                           'Not specified'}
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
                          Delivery Charge
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#10b981' }}>
                          ৳{order.deliveryCharge || 0}
                        </p>
                      </div>
                    </div>

                    {order.comment && (
                      <div style={{ marginTop: '16px' }}>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
                          Customer Comment
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: '500', margin: 0, fontStyle: 'italic' }}>
                          "{order.comment}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
