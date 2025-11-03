import React from 'react';
import { Link } from 'react-router-dom';

const ShippingReturns = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ fontSize: '24px', fontWeight: '800', color: '#1f2937', textDecoration: 'none' }}>
            KiaRa Lifestyle
          </Link>
          <Link to="/" style={{
            padding: '10px 20px',
            background: '#C9A961',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#1f2937', marginBottom: '16px' }}>
            Shipping & Returns
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            Everything you need to know about our delivery and return policies
          </p>
        </div>

        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          {/* Shipping Policy */}
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#1f2937' }}>
              🚚 Shipping Policy
            </h2>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                Delivery Options
              </h3>
              <div style={{ paddingLeft: '20px' }}>
                <p style={{ marginBottom: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                  <strong>🏠 Home Delivery:</strong> Standard delivery within 3-5 business days. Delivery charge: ৳60
                </p>
                <p style={{ marginBottom: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                  <strong>⚡ Express Delivery:</strong> Fast delivery within 1-2 business days. Delivery charge: ৳120
                </p>
                <p style={{ marginBottom: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                  <strong>🏪 Store Pickup:</strong> Free pickup from our store. Available within 24 hours.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                Shipping Areas
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                We deliver to all 64 districts in Bangladesh. Delivery times may vary depending on your location.
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                Order Tracking
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Once your order is shipped, you'll receive a confirmation email with tracking details. You can also track your order status from your account dashboard under "My Orders".
              </p>
            </div>
          </section>

          {/* Returns Policy */}
          <section>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#1f2937' }}>
              🔄 Returns Policy
            </h2>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                Return Window
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                You can return most items within <strong>7 days</strong> of delivery for a full refund. Items must be unused, in original packaging, and with all tags attached.
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                How to Return
              </h3>
              <ol style={{ color: '#6b7280', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Log in to your account and go to "My Orders"</li>
                <li>Select the order and click "Request Return"</li>
                <li>Choose the reason for return</li>
                <li>We'll send you a return shipping label within 24 hours</li>
                <li>Pack the item securely and ship it back</li>
                <li>Refund will be processed within 5-7 business days after we receive the item</li>
              </ol>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                Non-Returnable Items
              </h3>
              <ul style={{ color: '#6b7280', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Personalized or customized products</li>
                <li>Perishable goods</li>
                <li>Intimate or sanitary products</li>
                <li>Items marked as "Final Sale"</li>
              </ul>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                Refund Methods
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Refunds will be issued to your original payment method. For cash on delivery orders, we'll process a bank transfer to your provided account.
              </p>
            </div>
          </section>

          {/* Contact */}
          <div style={{
            marginTop: '48px',
            padding: '24px',
            background: '#f3f4f6',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
              Need Help?
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Our customer service team is here to assist you
            </p>
            <Link to="/contact" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#C9A961',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;
