import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../config/api';

const ProductsContext = createContext(null);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const addProduct = async (productData, imageFile, imageUrl, additionalFiles, additionalUrls) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Append product data
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
      formData.append('rating', productData.rating || 4.5);
      
      if (productData.originalPrice) {
        formData.append('originalPrice', productData.originalPrice);
      }
      if (productData.badge) {
        formData.append('badge', productData.badge);
      }

      // Handle main image
      if (imageFile) {
        formData.append('imageFile', imageFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      // Handle additional images
      if (additionalFiles && additionalFiles.length > 0) {
        additionalFiles.forEach(file => {
          formData.append('additionalImageFiles', file);
        });
      }

      if (additionalUrls && additionalUrls.length > 0) {
        additionalUrls.forEach(url => {
          formData.append('additionalImageUrls', url);
        });
      }

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        return newProduct;
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, productData, imageFile, imageUrl, keepExistingImage, additionalFiles, additionalUrls, existingAdditionalImages) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
      formData.append('rating', productData.rating || 4.5);
      
      if (productData.originalPrice) {
        formData.append('originalPrice', productData.originalPrice);
      }
      if (productData.badge) {
        formData.append('badge', productData.badge);
      }

      // Handle main image
      if (imageFile) {
        formData.append('imageFile', imageFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }
      
      formData.append('keepExistingImage', keepExistingImage);

      // Handle additional images
      if (additionalFiles && additionalFiles.length > 0) {
        additionalFiles.forEach(file => {
          formData.append('additionalImageFiles', file);
        });
      }

      if (additionalUrls && additionalUrls.length > 0) {
        additionalUrls.forEach(url => {
          formData.append('additionalImageUrls', url);
        });
      }

      if (existingAdditionalImages && existingAdditionalImages.length > 0) {
        existingAdditionalImages.forEach(url => {
          formData.append('existingAdditionalImages', url);
        });
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p.id === id ? updatedProduct : p));
        return updatedProduct;
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      loading,
      addProduct, 
      updateProduct, 
      deleteProduct,
      refreshProducts: fetchProducts
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};
