import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../contexts/ProductsContext';
import { useOrders } from '../../contexts/OrdersContext';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const { products } = useProducts();
  const { orders } = useOrders();

  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Calculate monthly financial data
  const monthlyData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    
    // Filter orders for selected month
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getFullYear() === year && orderDate.getMonth() + 1 === month;
    });

    // Calculate revenue from monthly orders
    const revenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate expenses (example: cost of goods sold)
    // Assuming cost is 60% of sale price (you can adjust this)
    const expenses = revenue * 0.6;

    // Calculate profit
    const profit = revenue - expenses;

    return {
      revenue,
      expenses,
      profit,
      orderCount: monthlyOrders.length
    };
  }, [orders, selectedMonth]);

  // Pie chart data
  const pieData = {
    labels: ['Revenue', 'Expenses', 'Profit'],
    datasets: [
      {
        label: 'Amount (৳)',
        data: [monthlyData.revenue, monthlyData.expenses, monthlyData.profit],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',  // Blue for Revenue
          'rgba(255, 99, 132, 0.8)',   // Red for Expenses
          'rgba(75, 192, 192, 0.8)',   // Green for Profit
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += '৳' + context.parsed.toFixed(2);
            return label;
          }
        }
      }
    }
  };

  // Generate month options for the last 12 months
  const monthOptions = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      months.push({ value, label });
    }
    
    return months;
  }, []);

  // Overall stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const topProducts = products
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="analytics-page">
        <h1>Analytics & Reports</h1>
        <p className="subtitle">View detailed analytics and insights about your store</p>

        {/* Overall Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value" style={{color: '#3b82f6'}}>৳{totalRevenue.toFixed(2)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Average Order Value</div>
            <div className="stat-value" style={{color: '#10b981'}}>৳{averageOrderValue.toFixed(2)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Total Products</div>
            <div className="stat-value" style={{color: '#8b5cf6'}}>{products.length}</div>
          </div>
        </div>

        {/* Monthly Financial Analytics */}
        <div className="monthly-analytics-section" style={{marginTop: '40px'}}>
          <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2>Monthly Financial Analysis</h2>
            <div className="month-selector">
              <label htmlFor="month-select" style={{marginRight: '10px', fontWeight: '500'}}>
                Select Month:
              </label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {monthOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="monthly-analytics-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
            {/* Pie Chart */}
            <div className="chart-container" style={{background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
              <h3 style={{marginBottom: '20px', textAlign: 'center'}}>Revenue Breakdown</h3>
              <div style={{height: '350px'}}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="monthly-stats" style={{background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
              <h3 style={{marginBottom: '20px'}}>Monthly Summary</h3>
              
              <div className="stat-item" style={{marginBottom: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6'}}>
                <div style={{fontSize: '14px', color: '#64748b', marginBottom: '5px'}}>Total Revenue</div>
                <div style={{fontSize: '24px', fontWeight: 'bold', color: '#3b82f6'}}>৳{monthlyData.revenue.toFixed(2)}</div>
              </div>

              <div className="stat-item" style={{marginBottom: '20px', padding: '15px', background: '#fef2f2', borderRadius: '8px', borderLeft: '4px solid #ef4444'}}>
                <div style={{fontSize: '14px', color: '#64748b', marginBottom: '5px'}}>Total Expenses</div>
                <div style={{fontSize: '24px', fontWeight: 'bold', color: '#ef4444'}}>৳{monthlyData.expenses.toFixed(2)}</div>
              </div>

              <div className="stat-item" style={{marginBottom: '20px', padding: '15px', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #10b981'}}>
                <div style={{fontSize: '14px', color: '#64748b', marginBottom: '5px'}}>Net Profit</div>
                <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981'}}>৳{monthlyData.profit.toFixed(2)}</div>
              </div>

              <div className="stat-item" style={{padding: '15px', background: '#faf5ff', borderRadius: '8px', borderLeft: '4px solid #8b5cf6'}}>
                <div style={{fontSize: '14px', color: '#64748b', marginBottom: '5px'}}>Total Orders</div>
                <div style={{fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6'}}>{monthlyData.orderCount}</div>
              </div>

              {/* Profit Margin */}
              <div style={{marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px'}}>
                <div style={{fontSize: '14px', color: '#64748b', marginBottom: '5px'}}>Profit Margin</div>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: monthlyData.revenue > 0 ? '#10b981' : '#64748b'}}>
                  {monthlyData.revenue > 0 ? ((monthlyData.profit / monthlyData.revenue) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products by Stock */}
        <div className="top-products-section" style={{marginTop: '40px', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h2 style={{marginBottom: '20px'}}>Top Products by Stock</h2>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '15px',
                  borderBottom: index < topProducts.length - 1 ? '1px solid #e5e7eb' : 'none',
                  alignItems: 'center'
                }}
              >
                <span style={{fontWeight: '500'}}>{product.name}</span>
                <span style={{color: '#10b981', fontWeight: 'bold'}}>{product.stock} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
