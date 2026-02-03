import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useProducts } from '../../contexts/ProductsContext';
import { useOrders } from '../../contexts/OrdersContext';
import ReviewList from '../../components/common/ReviewList';
import ReviewForm from '../../components/common/ReviewForm';
import { backendAssetUrl } from '../../config/api';
import '../customer/ProductDetail.css';

const PublicProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useOrders();
  
  const product = products.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewRefresh, setReviewRefresh] = useState(0);

  const handleReviewSubmitted = () => {
    setReviewRefresh(prev => prev + 1);
  };

  if (!product) {
    return (
      <PublicLayout>
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <h2>Product not found</h2>
          <button onClick={() => navigate('/shop')}>Back to Shop</button>
        </div>
      </PublicLayout>
    );
  }

  const allImages = [];
  if (product.image) {
    const mainImageUrl = backendAssetUrl(product.image);
    allImages.push(mainImageUrl);
  }
  
  if (product.additionalImages && product.additionalImages.length > 0) {
    product.additionalImages.forEach(img => {
      const imageUrl = backendAssetUrl(img);
      allImages.push(imageUrl);
    });
  }

  if (allImages.length === 0) {
    allImages.push('https://via.placeholder.com/500x500?text=No+Image');
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <PublicLayout>
      <div className="product-detail-page">
        <div className="breadcrumb-detail">
          <a href="/">Home</a>
          <span>›</span>
          <a href="/shop">Products</a>
          <span>›</span>
          <span>{product.category}</span>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-container">
          <div className="product-images-section">
            <div className="main-image">
              <div className="image-display">
                <img 
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  style={{ 
                    width: '100%', 
                    maxHeight: '500px', 
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                  }}
                />
              </div>
              {product.badge && (
                <span className={`detail-badge ${product.badge.toLowerCase().replace(' ', '-')}`}>
                  {product.badge}
                </span>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="thumbnail-images">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img 
                      src={image}
                      alt={`View ${index + 1}`}
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover', 
                        borderRadius: '4px' 
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60x60?text=Error';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info-section">
            <h1 className="product-title-detail">{product.name}</h1>
            
            <div className="product-meta-detail">
              <div className="rating-detail">
                <span className="stars-detail">★★★★☆</span>
                <span className="rating-count-detail">({product.rating})</span>
              </div>
              <div className="stock-status">
                <span className={product.inStock ? 'in-stock' : 'out-stock'}>
                  {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>
              <div className="product-code">Product Code: #{product.id}</div>
            </div>

            <div className="price-section-detail">
              <span className="current-price-detail">৳{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price-detail">৳{product.originalPrice.toFixed(2)}</span>
                  <span className="discount-percent">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="key-features-box">
              <h3>Key Features</h3>
              <ul>
                <li>Category: {product.category}</li>
                <li>Premium Quality Product</li>
                <li>Available Stock: {product.stock} units</li>
                <li>Fast Delivery Available</li>
                <li>Easy Return Policy</li>
              </ul>
            </div>

            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{product.category}</span>
            </div>

            <div className="quantity-section-detail">
              <span className="detail-label">Quantity:</span>
              <div className="quantity-controls-detail">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!product.inStock}>-</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} disabled={!product.inStock}/>
                <button onClick={() => setQuantity(quantity + 1)} disabled={!product.inStock}>+</button>
              </div>
            </div>

            <div className="action-buttons-detail">
              <button className="btn-buy-now" onClick={handleBuyNow} disabled={!product.inStock}>
                Buy Now
              </button>
              <button className="btn-add-cart-detail" onClick={handleAddToCart} disabled={!product.inStock}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Add to Cart
              </button>
            </div>

            <div className="payment-delivery-info">
              <div className="info-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1" stroke="#3b82f6" strokeWidth="2"/>
                  <circle cx="6.5" cy="17.5" r="2.5" stroke="#3b82f6" strokeWidth="2"/>
                  <circle cx="17.5" cy="17.5" r="2.5" stroke="#3b82f6" strokeWidth="2"/>
                </svg>
                <div>
                  <h4>Free Delivery</h4>
                  <p>On orders over ৳1000</p>
                </div>
              </div>
              <div className="info-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10b981" strokeWidth="2"/>
                </svg>
                <div>
                  <h4>Quality Guarantee</h4>
                  <p>100% Original Product</p>
                </div>
              </div>
              <div className="info-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="#f59e0b" strokeWidth="2"/>
                </svg>
                <div>
                  <h4>Easy Returns</h4>
                  <p>30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="product-description-section">
          <h2>Product Description</h2>
          <div className="description-content">
            <p>{product.description}</p>
            <p>This premium {product.name} is designed for ultimate comfort and style. Perfect for everyday use.</p>
            
            <h3>Specifications:</h3>
            <table className="specs-table">
              <tbody>
                <tr><td>Product Name</td><td>{product.name}</td></tr>
                <tr><td>Category</td><td>{product.category}</td></tr>
                <tr><td>Stock</td><td>{product.stock} units available</td></tr>
                <tr><td>Rating</td><td>★★★★☆ ({product.rating})</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ REVIEWS SECTION - NEW */}
        <ReviewList 
          productId={product.id} 
          key={reviewRefresh}
        />

        {/* ✅ REVIEW FORM - NEW */}
        <ReviewForm 
          productId={product.id}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    </PublicLayout>
  );
};

export default PublicProductDetail;
