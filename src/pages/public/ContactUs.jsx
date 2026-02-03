import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/contact-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#1f2937', marginBottom: '16px' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Have a question or feedback? We'd love to hear from you!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {/* Contact Info */}
          <div>
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Get in Touch</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>📧</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Email</h3>
                </div>
                <p style={{ color: '#6b7280', marginLeft: '36px' }}>support@kiaralifestyle.com</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>📞</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Phone</h3>
                </div>
                <p style={{ color: '#6b7280', marginLeft: '36px' }}>+880 1234-567890</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>📍</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Address</h3>
                </div>
                <p style={{ color: '#6b7280', marginLeft: '36px' }}>
                  123 Shopping Street<br />
                  Dhaka, Bangladesh
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>🕒</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Business Hours</h3>
                </div>
                <p style={{ color: '#6b7280', marginLeft: '36px' }}>
                  Mon - Fri: 9:00 AM - 6:00 PM<br />
                  Sat - Sun: 10:00 AM - 4:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Send us a Message</h2>
            
            {submitted && (
              <div style={{
                padding: '16px',
                background: '#d1fae5',
                color: '#047857',
                borderRadius: '8px',
                marginBottom: '24px',
                fontWeight: '600'
              }}>
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button type="submit" style={{
                width: '100%',
                padding: '14px',
                background: '#C9A961',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
