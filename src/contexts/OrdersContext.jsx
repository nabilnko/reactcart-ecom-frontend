import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '../config/api';

const OrdersContext = createContext(null);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // Load cart from localStorage
  useEffect(() => {
    const cartKey = user ? `cart_${user.id}` : 'cart_guest';
    const storedCart = localStorage.getItem(cartKey);
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [user]);

  // Save cart to localStorage
  useEffect(() => {
    const cartKey = user ? `cart_${user.id}` : 'cart_guest';
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, user]);

  // Fetch orders (for admin or logged-in user)
  // Fetch orders (for admin or logged-in user)
const fetchOrders = async () => {
  try {
    if (!user) {
      console.log('No user logged in, skipping order fetch');
      return;
    }

    const role = (user?.role || '').toString().toUpperCase();
    const isAdmin = role.includes('ADMIN');

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, skipping order fetch');
      return;
    }

    // ✅ FIX: Admin fetches ALL orders, Customer fetches their own
    let url = `${API_URL}/orders/my-orders`;  // Default for customers
    
    if (isAdmin) {
      url = `${API_URL}/orders/admin/all`;
    }

    console.log(`📡 Fetching orders from: ${url} (Role: ${user.role})`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Fetched ${data.length} orders:`, data);
      setOrders(data);
    } else {
      console.error(`❌ Failed to fetch orders: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

// ✅ FIX: Fetch orders whenever user changes
useEffect(() => {
  if (user) {
    console.log('User changed, fetching orders...');
    fetchOrders();
  } else {
    console.log('User logged out, clearing orders');
    setOrders([]);
  }
}, [user]);  // Re-fetch when user changes


  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (orderDetails) => {
  try {
    const token = localStorage.getItem('token');
    
    // Validate cart has items
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    // Prepare order data
    const orderData = {
      firstName: orderDetails.firstName,
      lastName: orderDetails.lastName,
      email: orderDetails.email,
      phone: orderDetails.phone,
      address: orderDetails.address,
      district: orderDetails.district,
      paymentMethod: orderDetails.paymentMethod,
      deliveryMethod: orderDetails.deliveryMethod,
      deliveryCharge: orderDetails.deliveryCharge,
      comment: orderDetails.comment || '',
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    // ===== ADD THESE DEBUG LOGS =====
    console.log('=== ORDER DEBUG ===');
    console.log('Cart items:', cart);
    console.log('Order data:', orderData);
    console.log('Product IDs being sent:', orderData.items.map(i => i.productId));
    console.log('==================');
    // ================================

    // Choose endpoint based on authentication
    const endpoint = user 
      ? `${API_URL}/orders` 
      : `${API_URL}/orders/guest`;

    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('Sending request to:', endpoint);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(errorText || 'Failed to place order');
    }

    const newOrder = await response.json();
    console.log('Order placed successfully:', newOrder);
    
    setOrders([newOrder, ...orders]);
    clearCart();
    return newOrder;

  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};


  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.userId === user.id || order.userEmail === user.email);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      cart, 
      addToCart, 
      removeFromCart, 
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      getUserOrders,
      getCartTotal,
      getCartCount,
      refreshOrders: fetchOrders
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};
