import React from 'react';
import './ProductRating.css';

const ProductRating = ({ rating, reviewCount, purchaseCount, size = 'medium' }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className={`product-rating ${size}`}>
      <div className="stars-container">
        {renderStars()}
      </div>
      <span className="rating-number">
        {rating > 0 ? rating.toFixed(1) : 'No ratings'}
      </span>
      {reviewCount > 0 && (
        <span className="review-count">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
      {purchaseCount > 0 && (
        <span className="purchase-count">
          • {purchaseCount} purchased
        </span>
      )}
    </div>
  );
};

export default ProductRating;
