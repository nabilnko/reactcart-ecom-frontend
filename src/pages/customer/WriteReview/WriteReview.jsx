import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { API_URL, backendAssetUrl } from '../../../config/api';
import './WriteReview.css';

const WriteReview = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('🔍 DEBUG: Product ID from URL:', productId);
    
    if (!user) {
      alert('Please login to write a review');
      navigate('/login');
      return;
    }

    // ✅ Fetch product from backend by ID
    const fetchProduct = async () => {
      try {
        const url = `${API_URL}/products/${productId}`;
        console.log('🔍 DEBUG: Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('🔍 DEBUG: Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ DEBUG: Product data received:', data);
          setProduct(data);
        } else {
          const errorText = await response.text();
          console.error('❌ DEBUG: Error response:', errorText);
          setError('Product not found');
        }
      } catch (err) {
        console.error('❌ DEBUG: Fetch error:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reviews/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        navigate('/orders');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <p>Loading product...</p>
          <p style={{ fontSize: '14px', color: '#666' }}>Product ID: {productId}</p>
        </div>
      </CustomerLayout>
    );
  }

  if (!product || error === 'Product not found') {
    return (
      <CustomerLayout>
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <h2>Product not found</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>Product ID: {productId}</p>
          <p style={{ color: '#999', fontSize: '14px' }}>Check browser console (F12) for details</p>
          <button 
            onClick={() => navigate('/orders')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Back to Orders
          </button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="write-review-page">
        <div className="review-container">
          <div className="review-header">
            <h1>Write a Review</h1>
            <button 
              onClick={() => navigate('/orders')}
              className="back-btn"
            >
              ← Back to Orders
            </button>
          </div>

          <div className="product-info-box">
            <img 
              src={backendAssetUrl(product.image)} 
              alt={product.name}
              onError={(e) => e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'}
            />
            <div>
              <h3>{product.name}</h3>
              <p>{product.category}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label>Rating *</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
              {rating > 0 && (
                <p className="rating-text">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Your Review *</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows="6"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/orders')}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default WriteReview;
