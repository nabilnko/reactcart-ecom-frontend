import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_URL, backendAssetUrl } from '../../config/api';
import './Categories.css';


const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#1e293b'
  });

  // NEW: Icon upload states
  const [iconType, setIconType] = useState('upload');
  const [iconFile, setIconFile] = useState(null);
  const [iconUrl, setIconUrl] = useState('');
  const [iconPreview, setIconPreview] = useState(null);


  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      
      const categoriesWithCount = await Promise.all(
        data.map(async (category) => {
          try {
            const productsResponse = await fetch(`${API_URL}/categories/${category.id}/products`);
            const products = await productsResponse.json();
            return { ...category, productCount: products.length };
          } catch (error) {
            console.error(`Error fetching products for category ${category.name}:`, error);
            return { ...category, productCount: 0 };
          }
        })
      );
      
      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // NEW: Handle icon file change
  const handleIconFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconUrl('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // NEW: Handle icon URL change
  const handleIconUrlChange = (e) => {
    const url = e.target.value;
    setIconUrl(url);
    setIconFile(null);
    setIconPreview(url);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // NEW: Use FormData instead of JSON
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('color', formData.color);

    if (iconFile) {
      formDataToSend.append('icon', iconFile);
    } else if (iconUrl) {
      formDataToSend.append('iconUrl', iconUrl);
    } else if (editingCategory && editingCategory.icon) {
      formDataToSend.append('keepExistingIcon', 'true');
    }
    
    try {
      const url = editingCategory
        ? `${API_URL}/categories/${editingCategory.id}`
        : `${API_URL}/categories`;
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      // UPDATED: Removed headers, let browser set Content-Type for FormData
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      if (response.ok) {
        fetchCategories();
        handleCloseModal();
        alert(editingCategory ? 'Category updated!' : 'Category created!');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchCategories();
        alert('Category deleted!');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };


  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#1e293b'
    });
    
    // NEW: Set icon preview
    if (category.icon) {
      const fullIconUrl = category.icon.startsWith('http') 
        ? category.icon 
        : backendAssetUrl(category.icon);
      setIconPreview(fullIconUrl);
      setIconType(category.icon.startsWith('http') ? 'url' : 'upload');
      if (category.icon.startsWith('http')) {
        setIconUrl(category.icon);
      }
    }
    
    setShowModal(true);
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#1e293b' });
    // NEW: Reset icon states
    setIconFile(null);
    setIconUrl('');
    setIconPreview(null);
    setIconType('upload');
  };


  const handleViewProducts = (categoryId, categoryName) => {
    navigate(`/admin/products?category=${categoryId}&name=${categoryName}`);
  };


  return (
    <AdminLayout>
      <div className="categories-page">
        <div className="categories-header">
          <h1>📂 Categories Management</h1>
          <button className="btn-add-category" onClick={() => setShowModal(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Category
          </button>
        </div>


        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card-admin" style={{ borderLeft: `4px solid ${category.color}` }}>
              <div className="category-card-header">
                <div className="category-icon-admin" style={{ background: `${category.color}20`, color: category.color }}>
                  {/* UPDATED: Display uploaded icon image */}
                  {category.icon ? (
                    <img 
                      src={backendAssetUrl(category.icon)}
                      alt={category.name}
                      style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=' + category.name.charAt(0); }}
                    />
                  ) : (
                    '📦'
                  )}
                </div>
                <div className="category-actions">
                  <button className="btn-icon-admin edit" onClick={() => handleEdit(category)} title="Edit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                  <button className="btn-icon-admin delete" onClick={() => handleDelete(category.id)} title="Delete">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>


              <h3>{category.name}</h3>
              <p className="category-description">{category.description || 'No description'}</p>


              <div className="category-stats">
                <div className="stat">
                  <span className="stat-value">{category.productCount || 0}</span>
                  <span className="stat-label">Products</span>
                </div>
              </div>


              <button 
                className="btn-view-products"
                onClick={() => handleViewProducts(category.id, category.name)}
              >
                View Products →
              </button>
            </div>
          ))}
        </div>


        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                <button className="btn-close-modal" onClick={handleCloseModal}>✕</button>
              </div>


              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Electronics"
                  />
                </div>


                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    placeholder="Brief description of the category"
                  />
                </div>


                {/* NEW: Icon Upload Section */}
                <div className="form-group">
                  <label>Category Icon *</label>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                    Upload an icon or provide URL (128x128px recommended)
                  </p>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setIconType('upload')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: iconType === 'upload' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                        borderRadius: '6px',
                        background: iconType === 'upload' ? '#eff6ff' : 'white',
                        cursor: 'pointer',
                        fontWeight: iconType === 'upload' ? '600' : '400'
                      }}
                    >
                      📤 Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setIconType('url')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: iconType === 'url' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                        borderRadius: '6px',
                        background: iconType === 'url' ? '#eff6ff' : 'white',
                        cursor: 'pointer',
                        fontWeight: iconType === 'url' ? '600' : '400'
                      }}
                    >
                      📎 URL
                    </button>
                  </div>

                  {iconType === 'upload' && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconFileChange}
                      style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    />
                  )}

                  {iconType === 'url' && (
                    <input
                      type="text"
                      placeholder="Enter icon URL"
                      value={iconUrl}
                      onChange={handleIconUrlChange}
                      style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    />
                  )}

                  {iconPreview && (
                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Preview:</p>
                      <img 
                        src={iconPreview} 
                        alt="Preview" 
                        style={{ width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Invalid'; }}
                      />
                    </div>
                  )}
                </div>


                <div className="form-row">
                  <div className="form-group">
                    <label>Color</label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                </div>


                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="btn-save">{editingCategory ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};


export default Categories;
