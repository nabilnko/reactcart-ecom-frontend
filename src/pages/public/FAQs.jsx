import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Orders & Payment',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept Cash on Delivery, Online Payment (bKash, Nagad, Credit/Debit Cards), and POS on Delivery.'
        },
        {
          q: 'How can I track my order?',
          a: 'Log in to your account and visit "My Orders" section. You\'ll see real-time status updates and tracking information for all your orders.'
        },
        {
          q: 'Can I cancel my order?',
          a: 'Yes, you can cancel your order before it\'s shipped. Go to "My Orders", select the order, and click "Cancel Order". Refunds will be processed within 5-7 business days.'
        },
        {
          q: 'Do you offer EMI or installment payments?',
          a: 'Currently, we don\'t offer EMI options. However, you can pay with credit cards that offer installment facilities from your bank.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          q: 'How long does delivery take?',
          a: 'Standard delivery takes 3-5 business days, Express delivery takes 1-2 business days, and Store Pickup is available within 24 hours.'
        },
        {
          q: 'Do you deliver to my area?',
          a: 'We deliver to all 64 districts in Bangladesh. Enter your location during checkout to confirm availability.'
        },
        {
          q: 'What are the delivery charges?',
          a: 'Home Delivery: ৳60, Express Delivery: ৳120, Store Pickup: Free'
        },
        {
          q: 'Can I change my delivery address after placing an order?',
          a: 'Yes, you can change the delivery address before the order is shipped. Contact our support team immediately with your order ID.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'You can return most items within 7 days of delivery. Items must be unused, in original packaging with tags attached.'
        },
        {
          q: 'How do I return a product?',
          a: 'Go to "My Orders", select the order, click "Request Return", choose the reason, and we\'ll send you return instructions within 24 hours.'
        },
        {
          q: 'When will I get my refund?',
          a: 'Refunds are processed within 5-7 business days after we receive the returned item. The amount will be credited to your original payment method.'
        },
        {
          q: 'Are there any items I cannot return?',
          a: 'Yes, personalized items, perishable goods, intimate products, and items marked as "Final Sale" cannot be returned.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click "Register" in the top menu, enter your details (name, email, password), and verify your email address.'
        },
        {
          q: 'I forgot my password. What should I do?',
          a: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a password reset link.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full credit card details.'
        },
        {
          q: 'Can I have multiple delivery addresses?',
          a: 'Yes, you can save multiple addresses in your account and choose which one to use during checkout.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
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
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#1f2937', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            Find answers to common questions about our services
          </p>
        </div>

        {faqs.map((category, catIndex) => (
          <div key={catIndex} style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: '2px solid #C9A961'
            }}>
              {category.category}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {category.questions.map((faq, qIndex) => {
                const isOpen = openIndex === `${catIndex}-${qIndex}`;
                return (
                  <div key={qIndex} style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => toggleFAQ(catIndex, qIndex)}
                      style={{
                        width: '100%',
                        padding: '20px 24px',
                        background: isOpen ? '#f3f4f6' : 'white',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{
                        fontSize: '20px',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }}>
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: '0 24px 24px 24px',
                        color: '#6b7280',
                        lineHeight: '1.6',
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '16px'
                      }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still Have Questions */}
        <div style={{
          marginTop: '60px',
          padding: '40px',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Still Have Questions?
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <Link to="/contact" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: '#C9A961',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px'
          }}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
