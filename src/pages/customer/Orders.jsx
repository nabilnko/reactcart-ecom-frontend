import React, { useState, useEffect } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useOrders } from '../../contexts/OrdersContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL, backendAssetUrl } from '../../config/api';

const Orders = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, placeOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cart');
  const [userOrders, setUserOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setUserOrders([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('❌ No token found');
          return;
        }

        const response = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Fetched ${data.length} orders`);
          setUserOrders(data);
        } else {
          const errorText = await response.text();
          console.error('❌ Error:', errorText);
        }
      } catch (error) {
        console.error('❌ Fetch error:', error);
      }
    };
    fetchOrders();
  }, [user]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    const order = placeOrder({
      shippingAddress: 'Default Address',
      paymentMethod: 'Cash on Delivery'
    });
    
    alert(`Order placed successfully! Order ID: ${order.id}`);
    setActiveTab('orders');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#C9A961',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <CustomerLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '32px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <button
            onClick={() => setActiveTab('cart')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'cart' ? '3px solid #C9A961' : '3px solid transparent',
              color: activeTab === 'cart' ? '#C9A961' : '#6b7280',
              fontWeight: activeTab === 'cart' ? '700' : '500',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.3s ease'
            }}
          >
            Shopping Cart ({cart.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '3px solid #C9A961' : '3px solid transparent',
              color: activeTab === 'orders' ? '#C9A961' : '#6b7280',
              fontWeight: activeTab === 'orders' ? '700' : '500',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.3s ease'
            }}
          >
            My Orders ({userOrders.length})
          </button>
        </div>

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div>
            {cart.length === 0 ? (
              <div style={{ 
                background: 'white', 
                padding: '80px 40px', 
                borderRadius: '16px', 
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</div>
                <h2 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '12px' }}>Your cart is empty</h2>
                <p style={{ color: '#6b7280', marginBottom: '32px' }}>Start shopping to add items to your cart</p>
                <button 
                  onClick={() => navigate('/products')}
                  style={{
                    background: 'linear-gradient(135deg, #C9A961 0%, #B39551 100%)',
                    color: 'white',
                    padding: '14px 32px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(201, 169, 97, 0.3)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
                {/* Cart Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{
                      background: 'white',
                      padding: '24px',
                      borderRadius: '12px',
                      display: 'grid',
                      gridTemplateColumns: '100px 1fr auto',
                      gap: '20px',
                      alignItems: 'center',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      transition: 'box-shadow 0.3s ease'
                    }}>
                      <img
                        src={backendAssetUrl(item.image)}
                        alt={item.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          background: '#f9fafb'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x100?text=No+Image';
                        }}
                      />
                      
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                          {item.name}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0' }}>
                          {item.description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '20px', fontWeight: '700', color: '#C9A961' }}>
                            ৳{item.price}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '4px' }}>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '4px 12px',
                                cursor: 'pointer',
                                fontSize: '18px',
                                color: '#6b7280',
                                transition: 'color 0.2s ease'
                              }}
                              onMouseOver={(e) => e.target.style.color = '#C9A961'}
                              onMouseOut={(e) => e.target.style.color = '#6b7280'}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '4px 12px',
                                cursor: 'pointer',
                                fontSize: '18px',
                                color: '#6b7280',
                                transition: 'color 0.2s ease'
                              }}
                              onMouseOver={(e) => e.target.style.color = '#C9A961'}
                              onMouseOut={(e) => e.target.style.color = '#6b7280'}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                        <span style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937' }}>
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#fecaca'}
                          onMouseOut={(e) => e.target.style.background = '#fee2e2'}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                  <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#1f2937' }}>Order Summary</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6b7280' }}>Subtotal</span>
                        <span style={{ fontWeight: '600' }}>৳{getCartTotal().toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6b7280' }}>Shipping</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>Free</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6b7280' }}>Tax</span>
                        <span style={{ fontWeight: '600' }}>৳0.00</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '700' }}>Total</span>
                      <span style={{ fontSize: '24px', fontWeight: '800', color: '#C9A961' }}>
                        ৳{getCartTotal().toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #C9A961 0%, #B39551 100%)',
                        color: 'white',
                        padding: '16px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(201, 169, 97, 0.3)',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {userOrders.length === 0 ? (
              <div style={{ 
                background: 'white', 
                padding: '80px 40px', 
                borderRadius: '16px', 
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>📦</div>
                <h2 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '12px' }}>No orders yet</h2>
                <p style={{ color: '#6b7280', marginBottom: '32px' }}>Your order history will appear here</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {userOrders.map(order => (
                  <div key={order.id} style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    {/* Order Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                          Order #{order.id}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                        
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          style={{
                            padding: '6px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            background: '#f3f4f6',
                            color: '#1f2937',
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#e5e7eb'}
                          onMouseOut={(e) => e.target.style.background = '#f3f4f6'}
                        >
                          {expandedOrder === order.id ? 'Hide Details ▲' : 'View Details ▼'}
                        </button>
                      </div>
                    </div>

                    {/* Order Items - ✅ WITH WRITE REVIEW BUTTON */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      {order.items.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '12px',
                          background: '#f9fafb',
                          borderRadius: '8px',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: '250px' }}>
                            <img
                              src={backendAssetUrl(item.productImage)}
                              alt={item.productName}
                              style={{
                                width: '48px',
                                height: '48px',
                                objectFit: 'cover',
                                borderRadius: '6px'
                              }}
                              onError={(e) => {
                                e.target.src = 'https://placehold.co/48x48?text=No+Image';
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <p style={{ fontWeight: '600', margin: '0 0 4px 0', fontSize: '14px' }}>{item.productName}</p>
                              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Qty: {item.quantity}</p>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', fontSize: '15px' }}>৳{(item.price * item.quantity).toFixed(2)}</span>
                            
                            {/* ✅ WRITE REVIEW BUTTON - Only shows for delivered orders */}
                            {/* ✅ FIXED: Write a Review Button (only for Delivered orders) */}
{order.status.toLowerCase() === 'delivered' && (
  <button
    onClick={() => {
      console.log('🔍 Order Item:', item);  // Debug log
      const prodId = item.productId || item.product?.id || item.id;
      console.log('🔍 Product ID:', prodId);  // Debug log
      if (prodId) {
        navigate(`/product/${prodId}/review`);
      } else {
        alert('Product ID not found');
      }
    }}
    style={{
      padding: '6px 12px',
      background: 'linear-gradient(135deg, #C9A961 0%, #B39551 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      whiteSpace: 'nowrap'
    }}
    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
  >
    ✍️ Write a Review
  </button>
)}

                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expandable Order Details */}
                    {expandedOrder === order.id && (
                      <div style={{
                        marginTop: '20px',
                        marginBottom: '16px',
                        padding: '20px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1f2937' }}>
                          Order Details
                        </h4>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Delivery Address
                            </h5>
                            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                              <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#1f2937' }}>
                                {order.firstName} {order.lastName}
                              </p>
                              <p style={{ margin: '0 0 4px 0', color: '#4b5563' }}>{order.phone}</p>
                              <p style={{ margin: '0 0 4px 0', color: '#4b5563' }}>{order.address}</p>
                              <p style={{ margin: 0, color: '#4b5563' }}>{order.district}</p>
                            </div>
                          </div>

                          <div>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Payment & Delivery
                            </h5>
                            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                              <div style={{ marginBottom: '8px' }}>
                                <strong style={{ color: '#1f2937' }}>Payment:</strong> 
                                <span style={{ marginLeft: '8px', color: '#4b5563' }}>
                                  {order.paymentMethod || 'Cash on Delivery'}
                                </span>
                              </div>
                              <div style={{ marginBottom: '8px' }}>
                                <strong style={{ color: '#1f2937' }}>Delivery:</strong>
                                <span style={{ marginLeft: '8px', color: '#4b5563' }}>
                                  {order.deliveryMethod || 'Standard Delivery'}
                                </span>
                              </div>
                              <div>
                                <strong style={{ color: '#1f2937' }}>Delivery Charge:</strong>
                                <span style={{ marginLeft: '8px', color: '#C9A961', fontWeight: '600' }}>
                                  ৳{order.deliveryCharge || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {order.comment && (
                          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Order Notes
                            </h5>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#6b7280', lineHeight: '1.6' }}>
                              "{order.comment}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Total Amount */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <span style={{ fontSize: '16px', fontWeight: '600' }}>Total Amount</span>
                      <span style={{ fontSize: '20px', fontWeight: '700', color: '#C9A961' }}>
                        ৳{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default Orders;
