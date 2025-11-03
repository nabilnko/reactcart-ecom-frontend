import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { OrdersProvider } from './contexts/OrdersContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Categories from './pages/admin/Categories';

// Public Pages
import PublicHome from './pages/public/PublicHome';
import PublicShop from './pages/public/PublicShop';
import PublicProductDetail from './pages/public/PublicProductDetail';
import Cart from './pages/public/Cart';
import ContactUs from './pages/public/ContactUs';
import ShippingReturns from './pages/public/ShippingReturns';
import FAQs from './pages/public/FAQs';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Analytics from './pages/admin/Analytics';
import Messages from './pages/admin/Messages';
import ProfileSettings from './pages/admin/ProfileSettings';

// Customer Pages (for logged-in customers)
import CustomerOrders from './pages/customer/Orders';
import CustomerProfileSettings from './pages/customer/ProfileSettings';
import WriteReview from './pages/customer/WriteReview/WriteReview';


const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <OrdersProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes - No Login Required */}
              <Route path="/" element={<PublicHome />} />
              <Route path="/shop" element={<PublicShop />} />
              <Route path="/product/:id" element={<PublicProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Customer Service Pages */}
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/shipping-returns" element={<ShippingReturns />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/product/:productId/review" element={<WriteReview />} />

              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Protected Routes */}
              <Route 
                path="/profile-settings" 
                element={
                  <PrivateRoute role="customer">
                    <CustomerProfileSettings />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-orders" 
                element={
                  <PrivateRoute role="customer">
                    <CustomerOrders />
                  </PrivateRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin/profile-settings" 
                element={
                  <PrivateRoute role="admin">
                    <ProfileSettings />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/categories" 
                element={
                  <PrivateRoute role="admin">
                    <Categories />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <PrivateRoute role="admin">
                    <AdminProducts />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <PrivateRoute role="admin">
                    <AdminOrders />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/customers" 
                element={
                  <PrivateRoute role="admin">
                    <Customers />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <PrivateRoute role="admin">
                    <Analytics />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/messages" 
                element={
                  <PrivateRoute role="admin">
                    <Messages />
                  </PrivateRoute>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </OrdersProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
