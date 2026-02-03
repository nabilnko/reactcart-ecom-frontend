import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useProducts } from '../../contexts/ProductsContext';
import { useOrders } from '../../contexts/OrdersContext';
import { API_URL, backendAssetUrl } from '../../config/api';
import '../../pages/customer/Home.css';

const PublicHome = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useOrders();
  const [currentSlide, setCurrentSlide] = useState(0);

  // NEW: Dynamic categories from API
  const [categories, setCategories] = useState([]);

  // Hero slider images
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop',
      title: 'New Collection',
      subtitle: 'Discover the latest trends in fashion'
    },
    {
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=600&fit=crop',
      title: 'Elegant Style',
      subtitle: 'Timeless pieces for every occasion'
    },
    {
      url: 'https://media.istockphoto.com/id/1167770957/photo/indian-man-on-vacation-wearing-floral-shirt-hat-sunglasses-over-isolated-yellow-background.jpg?s=2048x2048&w=is&k=20&c=Z8TWCSngh2ezq0ufG66k50ocBVSBZS6aNbfmPfNVAmI=',
      title: 'Summer Essentials',
      subtitle: 'Fresh looks for the season'
    },
    {
      url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=600&fit=crop',
      title: 'Exclusive Designs',
      subtitle: 'Handpicked selections just for you'
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // NEW: Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // NEW: Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Icon SVG mapping for categories
  const getCategoryIconSVG = (categoryName) => {
    const iconMap = {
      'Men': (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <path d="M32 15L35 12L37 15L35 18L32 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter"/>
          <rect x="30" y="18" width="4" height="8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M24 26L34 26L34 52L30 52L30 26Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter"/>
          <path d="M34 26L40 26L40 52L34 52" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter"/>
          <line x1="24" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M28 18L22 26M36 18L42 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      'Women': (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <path d="M32 12L28 18L24 32L22 52H42L40 32L36 18L32 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M24 32L40 32" stroke="currentColor" strokeWidth="1.5"/>
          <ellipse cx="32" cy="22" rx="3" ry="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M28 18L24 24M36 18L40 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      'Kids': (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="18" r="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M26 24L24 32L22 48H28V52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M38 24L40 32L42 48H36V52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="28" cy="16" r="1.5" fill="currentColor"/>
          <circle cx="36" cy="16" r="1.5" fill="currentColor"/>
          <path d="M30 20C30 20 31 21 32 21C33 21 34 20 34 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M32 24V32" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M26 32H38" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      'Accessories': (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <rect x="18" y="22" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M26 22V18C26 15.7909 27.7909 14 30 14H34C36.2091 14 38 15.7909 38 18V22" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="24" cy="32" r="2" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="18" y1="28" x2="46" y2="28" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M32 34L32 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    };
    
    // Default icon for unknown categories
    return iconMap[categoryName] || (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <rect x="20" y="20" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M28 32L32 36L36 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  };

  const featuredProducts = products.slice(0, 6);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    alert(`${product.name} added to cart! Go to cart to checkout.`);
  };

  return (
    <PublicLayout>
      <div className="home-page-new">
        {/* Hero Slider */}
        <section className="hero-slider">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${image.url})`,
              }}
            >
              <div className="hero-overlay">
                <h1 className="hero-title">{image.title}</h1>
                <p className="hero-subtitle">{image.subtitle}</p>
                <button className="hero-cta" onClick={() => navigate('/shop')}>
                  Shop Now
                </button>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="slider-dots">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className="slider-arrow prev"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          >
            ‹
          </button>
          <button
            className="slider-arrow next"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          >
            ›
          </button>
        </section>

        {/* Categories Section - DYNAMIC */}
        <section className="categories-section" style={{ paddingTop: '80px', marginTop: '40px' }}>
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <div 
                key={category.id} 
                className="category-card" 
                style={{ borderColor: category.color || '#3b82f6' }}
                onClick={() => navigate(`/shop?category=${category.name}`)}
              >
                <div 
  className="category-icon" 
  style={{ 
    background: `${category.color || '#3b82f6'}15`, 
    color: category.color || '#3b82f6'
  }}
>
  {category.icon ? (
    <img 
      src={backendAssetUrl(category.icon)}
      alt={category.name}
      style={{ 
        width: '64px', 
        height: '64px', 
        objectFit: 'contain'
      }}
      onError={(e) => {
        e.target.src = 'https://placehold.co/64x64?text=' + category.name.charAt(0);

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
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/shop?category=${category.name}`);
                  }}
                >
                  Browse
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="featured-section">
          <div className="section-header" style={{ marginBottom: '2px' }}>
            <h2 className="section-title">Featured Products</h2>
            <button className="view-all-btn" onClick={() => navigate('/shop')}>
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
                <img 
                  src={backendAssetUrl(product.image)}
                  alt={product.name}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                  onError={(e) => {
e.target.src = 'https://placehold.co/300x200?text=No+Image';                  }}
                />

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
    </PublicLayout>
  );
};

export default PublicHome;
