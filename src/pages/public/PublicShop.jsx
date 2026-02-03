import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useProducts } from '../../contexts/ProductsContext';
import { useOrders } from '../../contexts/OrdersContext';
import ProductRating from '../../components/common/ProductRating';
import axios from 'axios';
import { API_URL, backendAssetUrl } from '../../config/api';
import '../customer/Products.css';

const PublicShop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { products } = useProducts();
  const { addToCart } = useOrders();

  const urlSearchQuery = searchParams.get('search') || '';
  const maxPrice = products.length > 0 
    ? Math.ceil(Math.max(...products.map(p => p.price)) / 1000) * 1000 
    : 50000;

  const [searchTerm, setSearchTerm] = useState(urlSearchQuery);
  const categoryFromUrl = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [priceRange, setPriceRange] = useState(maxPrice);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [productRatings, setProductRatings] = useState({});

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchTerm(query);
  }, [searchParams]);

  useEffect(() => {
    if (products.length > 0) {
      const newMax = Math.ceil(Math.max(...products.map(p => p.price)) / 1000) * 1000;
      setPriceRange(newMax);
    }
  }, [products]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('sale') === 'true') {
      setShowOnlySale(true);
    }
  }, [location]);

  // ✅ NEW: Fetch product ratings
  useEffect(() => {
    const fetchRatings = async () => {
      const ratings = {};
      for (const product of products) {
        try {
          const response = await axios.get(
            `${API_URL}/reviews/product/${product.id}/stats`
          );
          ratings[product.id] = response.data;
        } catch (error) {
          console.error(`Error fetching rating for product ${product.id}`);
        }
      }
      setProductRatings(ratings);
    };

    if (products.length > 0) {
      fetchRatings();
    }
  }, [products]);

  const [backendCategories, setBackendCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setBackendCategories(['All', ...response.data.map(cat => cat.name)]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setBackendCategories(['All']);
    }
  };

  const categories = backendCategories;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price <= priceRange;
    const matchesSale = !showOnlySale || (product.badge && product.badge.toUpperCase() === 'SALE');
    
    return matchesSearch && matchesCategory && matchesPrice && matchesSale;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (productRatings[b.id]?.averageRating || 0) - (productRatings[a.id]?.averageRating || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <PublicLayout>
      <div className="products-page-new">
        <div className="products-header">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>›</span>
            <span>{showOnlySale ? 'Sale Products' : urlSearchQuery ? `Search: ${urlSearchQuery}` : 'All Products'}</span>
          </div>
          <h1>
            {showOnlySale ? '🔥 Sale Products' : urlSearchQuery ? `Search Results for "${urlSearchQuery}"` : 'All Products'}
          </h1>
          <p>Showing {sortedProducts.length} of {products.length} products</p>
        </div>

        {urlSearchQuery && (
          <div className="sale-banner" style={{ background: 'linear-gradient(135deg, #C9A961 0%, #B39551 100%)' }}>
            <div className="sale-banner-content">
              <span>🔍 Searching for: "{urlSearchQuery}"</span>
              <button onClick={() => { 
                setSearchTerm(''); 
                navigate('/shop'); 
              }} className="clear-sale-btn">
                Clear Search
              </button>
            </div>
          </div>
        )}

        {showOnlySale && (
          <div className="sale-banner">
            <div className="sale-banner-content">
              <span>🔥 Showing only products on sale</span>
              <button onClick={() => { setShowOnlySale(false); navigate('/shop'); }} className="clear-sale-btn">
                View All Products
              </button>
            </div>
          </div>
        )}

        <div className="products-container">
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="category-filters">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                    {selectedCategory === cat && <span className="check-icon">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-filter">
                <input 
                  type="range" 
                  min="0" 
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="price-slider"
                />
                <div className="price-labels">
                  <span>৳0</span>
                  <span className="current-price-label">৳{Number(priceRange).toLocaleString()}</span>
                  <span>৳{maxPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h3>Special Offers</h3>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={showOnlySale}
                  onChange={(e) => setShowOnlySale(e.target.checked)}
                />
                <span>🔥 Sale Items Only</span>
              </label>
            </div>

            <button className="reset-filters-btn" onClick={() => {
              setSelectedCategory('All');
              setPriceRange(maxPrice);
              setSearchTerm('');
              setShowOnlySale(false);
              navigate('/shop');
            }}>
              Reset All Filters
            </button>
          </aside>

          <div className="products-main">
            <div className="products-toolbar">
              <div className="search-filter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="toolbar-actions">
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name: A to Z</option>
                </select>

                <div className="view-toggle">
                  <button 
                    className={viewMode === 'grid' ? 'active' : ''}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                      <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                      <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
                      <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
                    </svg>
                  </button>
                  <button 
                    className={viewMode === 'list' ? 'active' : ''}
                    onClick={() => setViewMode('list')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="no-products">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#d1d5db" strokeWidth="2"/>
                </svg>
                <h3>No products found</h3>
                <p>
                  {urlSearchQuery ? `No results for "${urlSearchQuery}"` : 
                   showOnlySale ? 'No sale items match your criteria' : 
                   'Try adjusting your filters'}
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setShowOnlySale(false);
                    navigate('/shop');
                  }}
                  className="reset-filters-btn"
                  style={{ marginTop: '20px' }}
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className={`products-display ${viewMode}-view`}>
                {sortedProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="product-card-modern"
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.badge && (
                      <span className={`product-badge-modern ${product.badge.toLowerCase().replace(' ', '-')}`}>
                        {product.badge}
                      </span>
                    )}
                    {!product.inStock && (
                      <div className="out-of-stock-overlay">Out of Stock</div>
                    )}
                    
                    <div className="product-image-modern">
                      <img 
                        src={backendAssetUrl(product.image)}
                        alt={product.name}
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover',
                          borderRadius: '12px 12px 0 0'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      <div className="product-actions">
                        <button 
                          className="action-btn" 
                          title="Quick View"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                        <button className="action-btn" title="Add to Wishlist" onClick={(e) => e.stopPropagation()}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="product-info-modern">
                      <div className="product-category-tag">{product.category}</div>
                      <h3 className="product-name-modern">{product.name}</h3>
                      <p className="product-description-modern">{product.description}</p>
                      
                      {/* ✅ NEW: Product Rating */}
                      <ProductRating 
                        rating={productRatings[product.id]?.averageRating || 0}
                        reviewCount={productRatings[product.id]?.reviewCount || 0}
                        purchaseCount={productRatings[product.id]?.purchaseCount || 0}
                        size="small"
                      />

                      <div className="product-price-modern">
                        <span className="current-price-modern">৳{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <>
                            <span className="original-price-modern">৳{product.originalPrice.toLocaleString()}</span>
                            <span className="discount-badge">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      <button 
                        className="add-to-cart-btn-modern" 
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Add to Cart
                          </>
                        ) : (
                          'Out of Stock'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PublicShop;
