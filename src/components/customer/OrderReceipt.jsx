import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './OrderReceipt.css';

const OrderReceipt = ({ orderId, onClose }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('KiaRa Lifestyle', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Elegant Fashion for Modern Living', 105, 28, { align: 'center' });
    doc.text('www.kiaralifestyle.com | support@kiaralifestyle.com', 105, 34, { align: 'center' });
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Invoice Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDER RECEIPT', 105, 50, { align: 'center' });
    
    // Order Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order ID: #${order.id}`, 20, 62);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 20, 68);
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, 74);
    
    // Customer Details
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER INFORMATION', 20, 86);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${order.firstName} ${order.lastName}`, 20, 94);
    doc.text(`Phone: ${order.phone}`, 20, 100);
    doc.text(`Address: ${order.address}`, 20, 106);
    doc.text(`District: ${order.district}`, 20, 112);
    
    // Payment & Delivery
    doc.text(`Payment Method: ${order.paymentMethod}`, 120, 94);
    doc.text(`Delivery Method: ${order.deliveryMethod}`, 120, 100);
    
    // Line separator
    doc.line(20, 120, 190, 120);
    
    // Items Table Header
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 20, 130);
    doc.text('Quantity', 120, 130);
    doc.text('Price', 150, 130);
    doc.text('Total', 175, 130);
    
    doc.line(20, 133, 190, 133);
    
    // Items
    doc.setFont('helvetica', 'normal');
    let yPosition = 142;
    
    order.items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      doc.text(item.product.name, 20, yPosition);
      doc.text(`${item.quantity}`, 120, yPosition);
      doc.text(`Tk. ${item.price}`, 150, yPosition);
      doc.text(`Tk. ${itemTotal}`, 175, yPosition);
      yPosition += 8;
    });
    
    // Line separator
    doc.line(20, yPosition + 2, 190, yPosition + 2);
    
    // Totals
  yPosition += 10;
  doc.text('Sub-Total:', 120, yPosition);
  doc.text(`Tk. ${order.total - order.deliveryCharge}`, 175, yPosition);
  
  yPosition += 8;
  doc.text('Delivery Charge:', 120, yPosition);
  doc.text(`Tk. ${order.deliveryCharge}`, 175, yPosition);
  
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', 120, yPosition);
  doc.text(`Tk. ${order.total}`, 175, yPosition);
  
  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for shopping with KiaRa Lifestyle!', 105, 270, { align: 'center' });
  doc.text('For inquiries, contact: +880 1234-567890', 105, 276, { align: 'center' });
  
  // Save PDF
  doc.save(`KiaRa-Order-${order.id}.pdf`);
  };

  const printReceipt = () => {
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write(`
    <html>
      <head>
        <title>KiaRa Order Receipt - #${order.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          .receipt {
            max-width: 800px;
            margin: 0 auto;
          }
          .receipt-header {
            text-align: center;
            border-bottom: 2px solid #C9A961;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .receipt-header h1 {
            font-size: 24px;
            color: #C9A961;
            margin-bottom: 5px;
          }
          .receipt-header p {
            font-size: 12px;
            color: #666;
            margin: 2px 0;
          }
          .receipt-title {
            text-align: center;
            margin: 20px 0;
          }
          .receipt-title h2 {
            font-size: 18px;
            margin-bottom: 10px;
          }
          .info-section {
            margin: 15px 0;
          }
          .info-section h3 {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 8px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .info-row {
            font-size: 12px;
            margin: 3px 0;
            display: flex;
            justify-content: space-between;
          }
          .info-label {
            font-weight: bold;
            width: 40%;
          }
          .info-value {
            width: 60%;
            text-align: right;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 12px;
          }
          table thead {
            background: #f5f5f5;
          }
          table th {
            padding: 8px;
            text-align: left;
            font-weight: bold;
            border-bottom: 2px solid #333;
          }
          table td {
            padding: 6px;
            border-bottom: 1px solid #ddd;
          }
          .totals {
            margin: 15px 0;
            font-size: 12px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
          }
          .total-final {
            border-top: 2px solid #C9A961;
            padding-top: 8px;
            font-weight: bold;
            font-size: 14px;
          }
          .footer-message {
            text-align: center;
            margin-top: 20px;
            padding: 15px;
            background: #fef3c7;
            border-radius: 5px;
            font-size: 12px;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .receipt {
              page-break-after: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="receipt-header">
            <h1>KiaRa Lifestyle</h1>
            <p>Elegant Fashion for Modern Living</p>
            <p>www.kiaralifestyle.com | support@kiaralifestyle.com</p>
          </div>

          <div class="receipt-title">
            <h2>ORDER RECEIPT</h2>
          </div>

          <div class="info-section">
            <div class="info-row">
              <span class="info-label">Order ID:</span>
              <span class="info-value">#${order.id}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span>
              <span class="info-value">${new Date(order.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">${order.status.toUpperCase()}</span>
            </div>
          </div>

          <div class="info-section">
            <h3>CUSTOMER INFORMATION</h3>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${order.firstName} ${order.lastName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${order.phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span class="info-value">${order.address}</span>
            </div>
            <div class="info-row">
              <span class="info-label">District:</span>
              <span class="info-value">${order.district}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">${order.paymentMethod}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Delivery Method:</span>
              <span class="info-value">${order.deliveryMethod}</span>
            </div>
          </div>

          <div class="info-section">
            <h3>ORDER ITEMS</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.product.name}</td>
                    <td>${item.quantity}</td>
                    <td>Tk. ${item.price}</td>
                    <td>Tk. ${item.price * item.quantity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <div class="total-row">
              <span>Sub-Total:</span>
              <span>Tk. ${order.total - order.deliveryCharge}</span>
            </div>
            <div class="total-row">
              <span>Delivery Charge:</span>
              <span>Tk. ${order.deliveryCharge}</span>
            </div>
            <div class="total-row total-final">
              <span>TOTAL:</span>
              <span>Tk. ${order.total}</span>
            </div>
          </div>

          <div class="footer-message">
            <p>✨ Thank you for shopping with KiaRa Lifestyle! ✨</p>
            <p>For inquiries, contact: +880 1234-567890</p>
          </div>
        </div>

        <script>
          window.print();
          setTimeout(() => window.close(), 500);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};


  if (loading) {
    return (
      <div className="receipt-modal">
        <div className="receipt-content">
          <p>Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="receipt-modal">
        <div className="receipt-content">
          <p>Order not found</p>
          <button onClick={onClose} className="btn-close-receipt">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-modal">
      <div className="receipt-content">
        {/* Receipt Header */}
        <div className="receipt-header">
          <button className="close-receipt-btn" onClick={onClose}>✕</button>
          <img src="/logo.png" alt="KiaRa Lifestyle" className="receipt-logo" />
          <h1>KiaRa Lifestyle</h1>
          <p>Elegant Fashion for Modern Living</p>
          <p className="receipt-contact">www.kiaralifestyle.com | support@kiaralifestyle.com</p>
        </div>

        {/* Order Info */}
        <div className="receipt-title">
          <h2>ORDER RECEIPT</h2>
          <div className="receipt-badge success">Order Confirmed</div>
        </div>

        <div className="receipt-order-info">
          <div className="info-row">
            <span className="info-label">Order ID:</span>
            <span className="info-value">#{order.id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Order Date:</span>
            <span className="info-value">
              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Status:</span>
            <span className="info-value status-pending">{order.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Customer Details */}
        <div className="receipt-section">
          <h3>Customer Information</h3>
          <div className="customer-details">
            <div className="detail-col">
              <p><strong>Name:</strong> {order.firstName} {order.lastName}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>District:</strong> {order.district}</p>
            </div>
            <div className="detail-col">
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="receipt-section">
          <h3>Order Items</h3>
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>৳{item.price}</td>
                  <td>৳{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="receipt-totals">
          <div className="total-row">
            <span>Sub-Total:</span>
            <span>৳{order.total - order.deliveryCharge}</span>
          </div>
          <div className="total-row">
            <span>Delivery Charge:</span>
            <span>৳{order.deliveryCharge}</span>
          </div>
          <div className="total-row total-final">
            <span>TOTAL:</span>
            <span>৳{order.total}</span>
          </div>
        </div>

        {/* Footer Message */}
        <div className="receipt-footer-message">
          <p>✨ Thank you for shopping with KiaRa Lifestyle! ✨</p>
          <p>For inquiries, contact: +880 1234-567890</p>
        </div>

        {/* Action Buttons */}
        <div className="receipt-actions">
          <button onClick={downloadPDF} className="btn-download-pdf">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Download PDF
          </button>
          <button onClick={printReceipt} className="btn-print">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="2"/>
              <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Print
          </button>
          <button onClick={() => navigate('/my-orders')} className="btn-view-orders">
  View My Orders
</button>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
