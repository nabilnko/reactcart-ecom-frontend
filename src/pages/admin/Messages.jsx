import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/contact-messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/contact-messages/${id}/mark-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/contact-messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchMessages();
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const viewMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  // Filter messages based on search query
  // NEW CODE - Only search by SENDER NAME (exact matching)
const filteredMessages = searchQuery 
  ? messages.filter(message => {
      const query = searchQuery.toLowerCase();
      return message.name.toLowerCase().includes(query);
    })
  : messages;

  return (
    <AdminLayout>
      <div style={{ maxWidth: '100%' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937', margin: '0 0 8px 0' }}>
            Contact Messages
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
            View and manage customer inquiries
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
              <span>🔍 Showing results for: "<strong>{searchQuery}</strong>" ({filteredMessages.length} found)</span>
              <button
                onClick={() => navigate('/admin/messages')}
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
            <p>Loading messages...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selectedMessage ? '1fr 1.5fr' : '1fr', gap: '24px' }}>
            {/* Messages List */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              {filteredMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                  <p>{searchQuery ? `No messages found for "${searchQuery}"` : 'No messages yet'}</p>
                </div>
              ) : (
                filteredMessages.map(message => (
                  <div
                    key={message.id}
                    onClick={() => viewMessage(message)}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      background: selectedMessage?.id === message.id ? '#f9fafb' : message.read ? 'white' : '#eff6ff',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: message.read ? '500' : '700', color: '#1f2937' }}>
                        {message.name}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: message.read ? '400' : '600', color: '#374151', margin: '0 0 4px 0' }}>
                      {message.subject}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {message.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Message Detail */}
            {selectedMessage && (
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
                <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
                        {selectedMessage.subject}
                      </h2>
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                        From: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '13px', margin: '4px 0 0 0' }}>
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      style={{
                        padding: '8px 16px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div style={{ lineHeight: '1.8', color: '#374151', whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </div>

                <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    💡 <strong>Tip:</strong> Reply to this customer at <strong>{selectedMessage.email}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Messages;
