import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // ✅ FIXED: Changed from context to contexts
import './ReviewForm.css';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage({ text: 'Please login to submit a review', type: 'error' });
      return;
    }

    if (rating === 0) {
      setMessage({ text: 'Please select a rating', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ text: '', type: '' });

      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/reviews/product/${productId}`,
        { rating, comment },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage({ text: 'Review submitted successfully!', type: 'success' });
      setRating(0);
      setComment('');
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to submit review';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="review-form-container">
        <div className="review-login-prompt">
          <p>Please login to write a review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Your Rating *</label>
          <div className="star-rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${
                  star <= (hoverRating || rating) ? 'active' : ''
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Your Review (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows="4"
            className="review-textarea"
          />
        </div>

        {message.text && (
          <div className={`review-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="review-submit-btn"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
