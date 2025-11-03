import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../contexts/ProductsContext';
import './Products.css';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get both search and category from URL
  const searchQuery = searchParams.get('search') || '';
  const categoryIdFromUrl = searchParams.get('category') || '';
  const categoryNameFromUrl = searchParams.get('name') || '';
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    badge: ''
  });

  // Main image states
  const [imageType, setImageType] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Additional images states
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImageUrls, setAdditionalImageUrls] = useState(['']);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState([]);

  // NEW: Categories state
  const [categories, setCategories] = useState([]);

  // State for category-filtered products
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

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

  // Fetch products by category when categoryId changes
  useEffect(() => {
    if (categoryIdFromUrl) {
      fetchProductsByCategory(categoryIdFromUrl);
    }
  }, [categoryIdFromUrl]);

  // Function to fetch products by category
  const fetchProductsByCategory = async (categoryId) => {
    setIsLoadingCategory(true);
    try {
      const response = await fetch(`http://localhost:8080/api/categories/${categoryId}/products`);
      if (response.ok) {
        const data = await response.json();
        setCategoryProducts(data);
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setIsLoadingCategory(false);
    }
  };

  // Filter products based on search query OR category filter
  const filteredProducts = categoryIdFromUrl 
    ? categoryProducts
    : searchQuery 
      ? products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : products;

  const handleEdit = (product) => {
    setEditingProduct(product);
    fetchCategories(); // Refresh categories when editing
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock,
      badge: product.badge || ''
    });
    
    // Set main image
    if (product.image) {
      const fullImageUrl = product.image.startsWith('http') 
        ? product.image 
        : `http://localhost:8080${product.image}`;
      setImagePreview(fullImageUrl);
      setImageType(product.image.startsWith('http') ? 'url' : 'upload');
      if (product.image.startsWith('http')) {
        setImageUrl(product.image);
      }
    }

    // Set additional images
    if (product.additionalImages && product.additionalImages.length > 0) {
      setExistingAdditionalImages(product.additionalImages);
      const previews = product.additionalImages.map(img => 
        img.startsWith('http') ? img : `http://localhost:8080${img}`
      );
      setAdditionalImagePreviews(previews);
    }
    
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      if (categoryIdFromUrl) {
        fetchProductsByCategory(categoryIdFromUrl);
      }
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null);
    setImagePreview(url);
  };

  const handleAdditionalFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImageFiles([...additionalImageFiles, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAdditionalUrlAdd = () => {
    setAdditionalImageUrls([...additionalImageUrls, '']);
  };

  const handleAdditionalUrlChange = (index, value) => {
    const newUrls = [...additionalImageUrls];
    newUrls[index] = value;
    setAdditionalImageUrls(newUrls);
    
    if (value) {
      const newPreviews = [...additionalImagePreviews];
      newPreviews[existingAdditionalImages.length + additionalImageFiles.length + index] = value;
      setAdditionalImagePreviews(newPreviews);
    }
  };

  const removeAdditionalImage = (index) => {
    if (index < existingAdditionalImages.length) {
      const newExisting = [...existingAdditionalImages];
      newExisting.splice(index, 1);
      setExistingAdditionalImages(newExisting);
    } else if (index < existingAdditionalImages.length + additionalImageFiles.length) {
      const fileIndex = index - existingAdditionalImages.length;
      const newFiles = [...additionalImageFiles];
      newFiles.splice(fileIndex, 1);
      setAdditionalImageFiles(newFiles);
    } else {
      const urlIndex = index - existingAdditionalImages.length - additionalImageFiles.length;
      const newUrls = [...additionalImageUrls];
      newUrls.splice(urlIndex, 1);
      setAdditionalImageUrls(newUrls);
    }
    
    const newPreviews = [...additionalImagePreviews];
    newPreviews.splice(index, 1);
    setAdditionalImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stock: parseInt(formData.stock),
      badge: formData.badge || null
    };

    const validUrls = additionalImageUrls.filter(url => url && url.trim() !== '');

    try {
      if (editingProduct) {
        await updateProduct(
          editingProduct.id, 
          productData, 
          imageFile, 
          imageUrl, 
          !imageFile && !imageUrl,
          additionalImageFiles,
          validUrls,
          existingAdditionalImages
        );
        alert('Product updated successfully!');
      } else {
        await addProduct(
          productData, 
          imageFile, 
          imageUrl,
          additionalImageFiles,
          validUrls
        );
        alert('Product added successfully!');
      }

      resetForm();
      setShowModal(false);
      
      if (categoryIdFromUrl) {
        fetchProductsByCategory(categoryIdFromUrl);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      originalPrice: '',
      stock: '',
      badge: ''
    });
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
    setImageType('url');
    setAdditionalImageFiles([]);
    setAdditionalImageUrls(['']);
    setAdditionalImagePreviews([]);
    setExistingAdditionalImages([]);
  };

  const handleAddNew = () => {
    resetForm();
    fetchCategories(); // Refresh categories when opening modal
    setShowModal(true);
  };

  const badges = ['BEST SELLER', 'NEW', 'HOT', 'SALE'];

  return (
    <AdminLayout>
      <div className="products-management">
        <div className="products-header">
          <div>
            <h1>Product Management</h1>
            <p>Manage your product inventory</p>
            
            {categoryNameFromUrl && (
              <div style={{
                marginTop: '12px',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #C9A961 0%, #B39551 100%)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'white'
              }}>
                <span>📂 Category: "<strong>{categoryNameFromUrl}</strong>" ({filteredProducts.length} products)</span>
                <button
                  onClick={() => navigate('/admin/products')}
                  style={{
                    background: 'white',
                    color: '#C9A961',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  View All Products
                </button>
              </div>
            )}

            {searchQuery && !categoryNameFromUrl && (
              <div style={{
                marginTop: '12px',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'white'
              }}>
                <span>🔍 Showing results for: "<strong>{searchQuery}</strong>" ({filteredProducts.length} found)</span>
                <button
                  onClick={() => navigate('/admin/products')}
                  style={{
                    background: 'white',
                    color: '#3b82f6',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <button className="btn-add" onClick={handleAddNew}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Add Product
          </button>
        </div>

        {isLoadingCategory ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-table">
            <div className="table-header">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>No products found{categoryNameFromUrl ? ` in ${categoryNameFromUrl} category` : ''}.</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="table-row">
                  <div className="product-cell">
                    <div className="product-image">
                      <img 
                        src={product.image?.startsWith('http') ? product.image : `http://localhost:8080${product.image}`}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                        }}
                      />
                      {product.additionalImages && product.additionalImages.length > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          background: '#3b82f6',
                          color: 'white',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          +{product.additionalImages.length}
                        </span>
                      )}
                    </div>
                    <div className="product-details">
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                    </div>
                  </div>
                  <span className="category-cell">{product.category}</span>
                  <span className="price-cell">
                    <span style={{ fontWeight: '700' }}>৳{product.price}</span>
                    {product.originalPrice && (
                      <span style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through', marginLeft: '8px' }}>
                        ৳{product.originalPrice}
                      </span>
                    )}
                  </span>
                  <span className={product.stock < 50 ? 'stock-low' : 'stock-ok'}>
                    {product.stock} units
                  </span>
                  <span>
                    {product.badge && (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: product.badge === 'BEST SELLER' ? '#d1fae5' : 
                                   product.badge === 'NEW' ? '#dbeafe' :
                                   product.badge === 'HOT' ? '#fee2e2' : '#fef3c7',
                        color: product.badge === 'BEST SELLER' ? '#059669' : 
                               product.badge === 'NEW' ? '#2563eb' :
                               product.badge === 'HOT' ? '#dc2626' : '#d97706'
                      }}>
                        {product.badge}
                      </span>
                    )}
                    {!product.badge && <span style={{ color: '#9ca3af' }}>-</span>}
                  </span>
                  <div className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(product)} title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(product.id)} title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
              <div className="modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  {/* UPDATED: Dynamic Category Dropdown */}
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    >
                      {categories.length === 0 ? (
                        <option value="">Loading categories...</option>
                      ) : (
                        <>
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price (৳) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Original Price (৳)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Badge</label>
                    <select
                      value={formData.badge}
                      onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    >
                      <option value="">No Badge</option>
                      {badges.map(badge => (
                        <option key={badge} value={badge}>{badge}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                      required
                    />
                  </div>

                  {/* MAIN IMAGE SECTION */}
                  <div className="form-group full-width">
                    <label>Main Product Image *</label>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setImageType('url')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          border: imageType === 'url' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                          borderRadius: '8px',
                          background: imageType === 'url' ? '#eff6ff' : 'white',
                          cursor: 'pointer',
                          fontWeight: imageType === 'url' ? '600' : '400'
                        }}
                      >
                        📎 Image URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageType('upload')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          border: imageType === 'upload' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                          borderRadius: '8px',
                          background: imageType === 'upload' ? '#eff6ff' : 'white',
                          cursor: 'pointer',
                          fontWeight: imageType === 'upload' ? '600' : '400'
                        }}
                      >
                        📤 Upload Image
                      </button>
                    </div>

                    {imageType === 'url' && (
                      <input
                        type="text"
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    )}

                    {imageType === 'upload' && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    )}

                    {imagePreview && (
                      <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Preview:</p>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ 
                            maxWidth: '200px', 
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #e5e7eb'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x200?text=Invalid+Image';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* ADDITIONAL IMAGES SECTION */}
                  <div className="form-group full-width">
                    <label>Additional Product Images (Optional)</label>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                      Add more images to show your product from different angles
                    </p>

                    <div style={{ marginBottom: '16px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalFileChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    {additionalImageUrls.map((url, index) => (
                      <div key={index} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Enter image URL"
                          value={url}
                          onChange={(e) => handleAdditionalUrlChange(index, e.target.value)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAdditionalUrlAdd}
                      style={{
                        padding: '8px 16px',
                        border: '2px dashed #3b82f6',
                        borderRadius: '8px',
                        background: 'white',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginTop: '8px'
                      }}
                    >
                      + Add Image URL
                    </button>

                    {additionalImagePreviews.length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                          Additional Images Preview:
                        </p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          {additionalImagePreviews.map((preview, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                              <img 
                                src={preview}
                                alt={`Additional ${index + 1}`}
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '2px solid #e5e7eb'
                                }}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => removeAdditionalImage(index)}
                                style={{
                                  position: 'absolute',
                                  top: '-8px',
                                  right: '-8px',
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
