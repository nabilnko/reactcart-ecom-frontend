import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_URL } from '../../config/api';
import { authFetch } from '../../config/apiClient';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await authFetch(`${API_URL}/users/customers`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter customers based on search query
  // NEW CODE - Only search by CUSTOMER ID (exact matching)
const filteredCustomers = searchQuery 
  ? customers.filter(customer => {
      return customer.id.toString().includes(searchQuery);
    })
  : customers;

  return (
    <AdminLayout>
      <div style={{ maxWidth: '100%' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937', margin: '0 0 8px 0' }}>
            Customer Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
            View and manage all registered customers
          </p>
          {searchQuery && (
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
              <span>🔍 Showing results for: "<strong>{searchQuery}</strong>" ({filteredCustomers.length} found)</span>
              <button
                onClick={() => navigate('/admin/customers')}
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p>Loading customers...</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '50px 1fr 1fr 150px 150px',
              gap: '16px',
              padding: '16px 24px',
              borderBottom: '1px solid #f3f4f6',
              fontWeight: '600',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <span>ID</span>
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Joined</span>
            </div>

            {filteredCustomers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                <p>{searchQuery ? `No customers found for "${searchQuery}"` : 'No customers found'}</p>
              </div>
            ) : (
              filteredCustomers.map(customer => (
                <div key={customer.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 1fr 1fr 150px 150px',
                  gap: '16px',
                  padding: '16px 24px',
                  borderBottom: '1px solid #f3f4f6',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: '600', color: '#6b7280' }}>#{customer.id}</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{customer.name}</span>
                  <span style={{ color: '#6b7280' }}>{customer.email}</span>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: (customer.role || '').toString().toUpperCase().includes('ADMIN') ? '#fee2e2' : '#dbeafe',
                    color: (customer.role || '').toString().toUpperCase().includes('ADMIN') ? '#dc2626' : '#2563eb',
                    width: 'fit-content'
                  }}>
                    {customer.role}
                  </span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {new Date(customer.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Customers;
