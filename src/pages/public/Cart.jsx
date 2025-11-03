import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useOrders } from '../../contexts/OrdersContext';
import { useAuth } from '../../contexts/AuthContext';
import OrderReceipt from '../../components/customer/OrderReceipt';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, placeOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState('cart'); // cart, checkout, payment
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    district: 'Dhaka - City',
    paymentMethod: 'cash',
    deliveryMethod: 'home',
    comment: ''
  });

  // Payment details state
  const [paymentDetails, setPaymentDetails] = useState({
    onlinePaymentType: 'card', // card, bkash, nagad
    // Card details
    cardNumber: '',
    cvv: '',
    pin: '',
    expiryDate: '',
    // Mobile banking details
    mobileNumber: '',
    mobilePin: '',
    otp: ''
  });

  const deliveryCharge = formData.deliveryMethod === 'home' ? 60 : formData.deliveryMethod === 'express' ? 130 : 0;
  const total = getCartTotal() + deliveryCharge;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setStep('checkout');
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.paymentMethod === 'online') {
      setStep('payment');
    } else {
      // Place order directly for cash/POS
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    let paymentInfo = formData.paymentMethod;
    
    if (formData.paymentMethod === 'online') {
      if (paymentDetails.onlinePaymentType === 'card') {
        if (!paymentDetails.cardNumber || !paymentDetails.cvv || !paymentDetails.pin || !paymentDetails.expiryDate) {
          alert('Please fill all card details');
          return;
        }
        paymentInfo = `Online Payment - Card (****${paymentDetails.cardNumber.slice(-4)})`;
      } else {
        if (!paymentDetails.mobileNumber || !paymentDetails.mobilePin || !paymentDetails.otp) {
          alert('Please fill all payment details');
          return;
        }
        const paymentType = paymentDetails.onlinePaymentType === 'bkash' ? 'bKash' : 'Nagad';
        paymentInfo = `Online Payment - ${paymentType} (${paymentDetails.mobileNumber})`;
      }
    }

    try {
      const order = await placeOrder({
        ...formData,
        deliveryCharge,
        paymentMethod: paymentInfo
      });

      // Show receipt instead of alert
      setCompletedOrderId(order.id);
      setShowReceipt(true);
      
    } catch (error) {
      console.error('Order placement error:', error);
      alert(`Failed to place order: ${error.message || 'Please try again'}`);
    }
  };

  // Cart Step
  if (step === 'cart') {
    return (
      <>
        <PublicLayout>
          <div className="cart-page">
            <h1>Shopping Cart ({cart.length})</h1>
            
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</div>
                <h2>Your cart is empty</h2>
                <p>Start shopping to add items to your cart</p>
                <button onClick={() => navigate('/shop')} className="btn-shop">Browse Products</button>
              </div>
            ) : (
              <div className="cart-container">
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        <img 
                          src={item.image?.startsWith('http') ? item.image : `http://localhost:8080${item.image}`}
                          alt={item.name}
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                      </div>

                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <div className="item-price">৳{item.price}</div>
                      </div>
                      <div className="item-quantity">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="item-total">৳{(item.price * item.quantity).toFixed(2)}</div>
                      <button className="item-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>৳{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="free">Free</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>৳0.00</span>
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <span>৳{getCartTotal().toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} className="btn-checkout">Proceed to Checkout</button>
                </div>
              </div>
            )}
          </div>
        </PublicLayout>

        {/* Order Receipt Modal */}
        {showReceipt && (
          <OrderReceipt 
            orderId={completedOrderId} 
            onClose={() => {
              setShowReceipt(false);
              navigate('/shop');
            }}
          />
        )}
      </>
    );
  }

  // Payment Step (Online Payment)
  if (step === 'payment') {
    return (
      <>
        <PublicLayout>
          <div className="checkout-page">
            <h1>Payment Details</h1>
            
            <div className="payment-gateway">
              {/* Payment Type Selection */}
              <div className="payment-type-selection">
                <h2>Select Payment Method</h2>
                <div className="payment-type-options">
                  <button
                    className={`payment-type-btn ${paymentDetails.onlinePaymentType === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentDetails({...paymentDetails, onlinePaymentType: 'card'})}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Visa/Mastercard</span>
                  </button>
                  <button
                    className={`payment-type-btn ${paymentDetails.onlinePaymentType === 'bkash' ? 'active' : ''}`}
                    onClick={() => setPaymentDetails({...paymentDetails, onlinePaymentType: 'bkash'})}
                  >
                    <div style={{ fontSize: '32px' }}>💰</div>
                    <span>bKash</span>
                  </button>
                  <button
                    className={`payment-type-btn ${paymentDetails.onlinePaymentType === 'nagad' ? 'active' : ''}`}
                    onClick={() => setPaymentDetails({...paymentDetails, onlinePaymentType: 'nagad'})}
                  >
                    <div style={{ fontSize: '32px' }}>💳</div>
                    <span>Nagad</span>
                  </button>
                </div>
              </div>

              {/* Card Payment Form */}
              {paymentDetails.onlinePaymentType === 'card' && (
                <div className="payment-form-card">
                  <h3>Card Details</h3>
                  <div className="payment-form-grid">
                    <div className="payment-form-group full-width">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()})}
                        required
                      />
                    </div>
                    <div className="payment-form-group">
                      <label>CVV *</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength="3"
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                        required
                      />
                    </div>
                    <div className="payment-form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={paymentDetails.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setPaymentDetails({...paymentDetails, expiryDate: value});
                        }}
                        required
                      />
                    </div>
                    <div className="payment-form-group full-width">
                      <label>Card PIN *</label>
                      <input
                        type="password"
                        placeholder="Enter 4-digit PIN"
                        maxLength="4"
                        value={paymentDetails.pin}
                        onChange={(e) => setPaymentDetails({...paymentDetails, pin: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Banking Payment Form */}
              {(paymentDetails.onlinePaymentType === 'bkash' || paymentDetails.onlinePaymentType === 'nagad') && (
                <div className="payment-form-card">
                  <h3>{paymentDetails.onlinePaymentType === 'bkash' ? 'bKash' : 'Nagad'} Payment</h3>
                  <div className="payment-form-grid">
                    <div className="payment-form-group full-width">
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        maxLength="11"
                        value={paymentDetails.mobileNumber}
                        onChange={(e) => setPaymentDetails({...paymentDetails, mobileNumber: e.target.value})}
                        required
                      />
                    </div>
                    <div className="payment-form-group">
                      <label>PIN *</label>
                      <input
                        type="password"
                        placeholder="Enter PIN"
                        maxLength="5"
                        value={paymentDetails.mobilePin}
                        onChange={(e) => setPaymentDetails({...paymentDetails, mobilePin: e.target.value})}
                        required
                      />
                    </div>
                    <div className="payment-form-group">
                      <label>OTP *</label>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        maxLength="6"
                        value={paymentDetails.otp}
                        onChange={(e) => setPaymentDetails({...paymentDetails, otp: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="otp-info">
                    <p>ℹ️ An OTP will be sent to your mobile number for verification</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="payment-summary">
                <h3>Order Summary</h3>
                <div className="payment-summary-row">
                  <span>Subtotal</span>
                  <span>৳{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="payment-summary-row">
                  <span>Delivery Charge</span>
                  <span>৳{deliveryCharge}</span>
                </div>
                <div className="payment-summary-total">
                  <span>Total to Pay</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Actions */}
              <div className="payment-actions">
                <button type="button" onClick={() => setStep('checkout')} className="btn-back">
                  Back to Checkout
                </button>
                <button onClick={handlePlaceOrder} className="btn-pay">
                  Pay ৳{total.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </PublicLayout>

        {/* Order Receipt Modal */}
        {showReceipt && (
          <OrderReceipt 
            orderId={completedOrderId} 
            onClose={() => {
              setShowReceipt(false);
              navigate('/shop');
            }}
          />
        )}
      </>
    );
  }

  // Checkout Step
  return (
    <>
      <PublicLayout>
        <div className="checkout-page">
          <h1>Checkout</h1>
          
          <form onSubmit={handleProceedToPayment} className="checkout-form">
            <div className="checkout-grid">
              {/* Customer Information */}
              <div className="checkout-section">
                <h2><span className="step-number">1</span> Customer Information</h2>
                <div className="form-grid-checkout">
                  <div className="form-group-checkout">
                    <label>First Name *</label>
                    <input type="text" placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                  </div>
                  <div className="form-group-checkout">
                    <label>Last Name</label>
                    <input type="text" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <div className="form-group-checkout">
                    <label>Address *</label>
                    <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                  </div>
                  <div className="form-group-checkout">
                    <label>Mobile *</label>
                    <input type="tel" placeholder="Telephone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                  </div>
                  <div className="form-group-checkout">
                    <label>E-Mail *</label>
                    <input type="email" placeholder="E-Mail" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="form-group-checkout">
                    <label>District</label>
                    <select value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})}>
                      <option>Dhaka - City</option>
                      <option>Chittagong</option>
                      <option>Sylhet</option>
                    </select>
                  </div>
                  <div className="form-group-checkout full-width">
                    <label>Comment</label>
                    <textarea rows="3" placeholder="Additional comments..." value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})}></textarea>
                  </div>
                </div>
              </div>

              {/* Payment & Delivery */}
              <div className="checkout-section">
                <h2><span className="step-number">2</span> Payment Method</h2>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" value="cash" checked={formData.paymentMethod === 'cash'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="online" checked={formData.paymentMethod === 'online'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} />
                    <span>Online Payment (Card/bKash/Nagad)</span>
                  </label>
                </div>

                <h2 style={{marginTop: '24px'}}><span className="step-number">3</span> Delivery Method</h2>
                <div className="delivery-options">
                  <label className="delivery-option">
                    <input type="radio" name="delivery" value="home" checked={formData.deliveryMethod === 'home'} onChange={(e) => setFormData({...formData, deliveryMethod: e.target.value})} />
                    <span>Home Delivery - 60৳</span>
                  </label>
                  <label className="delivery-option">
                    <input type="radio" name="delivery" value="pickup" checked={formData.deliveryMethod === 'pickup'} onChange={(e) => setFormData({...formData, deliveryMethod: e.target.value})} />
                    <span>Store Pickup - 0৳</span>
                  </label>
                  <label className="delivery-option">
                    <input type="radio" name="delivery" value="express" checked={formData.deliveryMethod === 'express'} onChange={(e) => setFormData({...formData, deliveryMethod: e.target.value})} />
                    <span>Request Express - 130৳</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Overview */}
            <div className="order-overview">
              <h2><span className="step-number">4</span> Order Overview</h2>
              <div className="overview-items">
                {cart.map(item => (
                  <div key={item.id} className="overview-item">
                    <div className="overview-details">
                      <span className="overview-name">{item.name}</span>
                      <span className="overview-price">৳{item.price} x {item.quantity}</span>
                    </div>
                    <span className="overview-total">৳{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="overview-totals">
                <div className="overview-row">
                  <span>Sub-Total:</span>
                  <span>৳{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="overview-row">
                  <span>Delivery:</span>
                  <span>৳{deliveryCharge}</span>
                </div>
                <div className="overview-row total">
                  <span>Total:</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="checkout-actions">
              <button type="button" onClick={() => setStep('cart')} className="btn-back">Back to Cart</button>
              <button type="submit" className="btn-confirm">
                {formData.paymentMethod === 'online' ? 'Proceed to Payment' : 'Confirm Order'}
              </button>
            </div>
          </form>
        </div>
      </PublicLayout>

      {/* Order Receipt Modal */}
      {showReceipt && (
        <OrderReceipt 
          orderId={completedOrderId} 
          onClose={() => {
            setShowReceipt(false);
            navigate('/shop');
          }}
        />
      )}
    </>
  );
};

export default Cart;
