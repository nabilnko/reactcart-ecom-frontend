import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import './ReviewList.css';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Wrapped fetchReviews in useCallback to prevent warning
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/reviews/product/${productId}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]); // ✅ productId is now the only dependency

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // ✅ Now includes fetchReviews

  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'star-filled' : 'star-empty'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="review-list-container">
        <h3>Customer Reviews</h3>
        <div className="review-loading">Loading reviews...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="review-list-container">
        <h3>Customer Reviews</h3>
        <div className="review-empty">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-list-container">
      <h3>Customer Reviews ({reviews.length})</h3>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="review-user-info">
                <div className="review-avatar">
                  {review.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="review-username">{review.username}</h4>
                  <p className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>
            {review.comment && (
              <p className="review-comment">{review.comment}</p>
            )}
            {review.verified && (
              <span className="review-verified">✓ Verified Purchase</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
