import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useProducts } from '../../contexts/ProductsContext';
import { useOrders } from '../../contexts/OrdersContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useOrders();

  // NEW: Dynamic categories from API
  const [categories, setCategories] = useState([]);

  // NEW: Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // NEW: Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Icon mapping for categories
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Men': '👔',
      'Women': '👗',
      'Kids': '🧸',
      'Accessories': '👜',
      'Electronics': '📱',
      'Sports': '⚽',
      'Books': '📚',
      'Home': '🏠'
    };
    return iconMap[categoryName] || '🛍️'; // Default icon
  };

  // Get featured products (first 6)
  const featuredProducts = products.slice(0, 6);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <CustomerLayout>
      <div className="home-page-new">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="hero-overlay">
            <h1 className="hero-title">Fashion & Comfort</h1>
            <p className="hero-subtitle">Discover the latest trends in clothing and accessories</p>
            <button className="hero-cta" onClick={() => navigate('/products')}>
              Shop Now
            </button>
          </div>
        </section>

        {/* Categories Section - DYNAMIC */}
        <section className="categories-section">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <div 
                key={category.id} 
                className="category-card" 
                style={{ borderColor: category.color || '#3b82f6' }}
              >
                <div 
  className="category-icon" 
  style={{ background: `${category.color || '#3b82f6'}15` }}
>
  {category.icon ? (
    <img 
      src={category.icon.startsWith('http') ? category.icon : `http://localhost:8080${category.icon}`}
      alt={category.name}
      style={{ 
        width: '64px', 
        height: '64px', 
        objectFit: 'contain'
      }}
      onError={(e) => {
        e.target.src = 'https://via.placeholder.com/64x64?text=' + category.name.charAt(0);
      }}
    />
  ) : (
    <span style={{ fontSize: '48px' }}>🛍️</span>
  )}
</div>

                <h3 style={{ color: category.color || '#3b82f6' }}>
                  {category.name}
                </h3>
                <button 
                  className="category-btn" 
                  style={{ background: category.color || '#3b82f6' }} 
                  onClick={() => navigate(`/products?category=${category.name}`)}
                >
                  Browse
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <button className="view-all-btn" onClick={() => navigate('/products')}>
              View All →
            </button>
          </div>
          <div className="products-grid-new">
            {featuredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card-new"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {product.badge && (
                  <span className={`product-badge ${product.badge.toLowerCase().replace(' ', '-')}`}>
                    {product.badge}
                  </span>
                )}
                <div className="product-image-new">
                  <div className="product-emoji-new">{product.image}</div>
                  <button className="quick-view-btn" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product.id}`);
                  }}>
                    Quick View
                  </button>
                </div>
                <div className="product-info-new">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <span className="stars">★★★★☆</span>
                    <span className="rating-text">({product.rating})</span>
                  </div>
                  <div className="product-price-section">
                    <span className="current-price">৳{product.price}</span>
                    {product.originalPrice && (
                      <span className="original-price">৳{product.originalPrice}</span>
                    )}
                  </div>
                  <button 
                    className="add-to-cart-btn" 
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-grid">
          <div className="feature-item">
            <div className="feature-icon-new delivery">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1m8-1a1 1 0 0 1 1-1h5.5l2.5-3h-8V5h8l2.5 3M13 16a1 1 0 0 0 1 1h1" stroke="currentColor" strokeWidth="2"/>
                <circle cx="6.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="17.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h4>Free Delivery</h4>
            <p>On orders over ৳1000</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon-new quality">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h4>Quality Guarantee</h4>
            <p>100% authentic products</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon-new returns">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h4>Easy Returns</h4>
            <p>30-day return policy</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon-new support">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414 1 1 0 01-1.414-1.414z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h4>24/7 Support</h4>
            <p>Always here to help</p>
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
};

export default Home;
