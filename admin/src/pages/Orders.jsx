import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaDownload, FaSync, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/helpers';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
    revenue: 0
  });

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
    
    // Listen for real-time updates
    const handleOrderUpdate = () => {
      console.log('📦 Orders updated - refreshing...');
      fetchOrders();
    };
    
    window.addEventListener('orderUpdated', handleOrderUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'orders' || e.key === null) {
        fetchOrders();
      }
    });
    
    return () => {
      window.removeEventListener('orderUpdated', handleOrderUpdate);
      window.removeEventListener('storage', handleOrderUpdate);
    };
  }, []);

  // Fetch orders from database
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAll();
      const ordersData = response.data || [];
      setOrders(ordersData);
      
      // Calculate stats
      const stats = {
        total: ordersData.length,
        pending: ordersData.filter(o => o.status === 'pending').length,
        processing: ordersData.filter(o => o.status === 'processing').length,
        delivered: ordersData.filter(o => o.status === 'delivered').length,
        revenue: ordersData.reduce((sum, o) => sum + (o.amount || 0), 0)
      };
      setStats(stats);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh list
      
      // Trigger real-time update
      window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId, status: newStatus } }));
      
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm);
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444',
      refunded: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const classes = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-danger',
      refunded: 'badge-secondary'
    };
    return classes[status] || 'badge-secondary';
  };

  // Export orders to CSV
  const handleExport = () => {
    const csv = orders.map(order => 
      `${order.id},${order.customer},${order.amount},${order.status},${order.date}`
    ).join('\n');
    
    const blob = new Blob([`Order ID,Customer,Amount,Status,Date\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Orders exported successfully');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner"></div>
        <style jsx>{`
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #c9a96e;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders Management</h1>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchOrders}>
            <FaSync /> Refresh
          </button>
          <button className="btn-primary" onClick={handleExport}>
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#c9a96e20' }}>
            <FaCheck color="#c9a96e" />
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b20' }}>
            <FaCheck color="#f59e0b" />
          </div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f620' }}>
            <FaCheck color="#3b82f6" />
          </div>
          <div className="stat-info">
            <h3>Processing</h3>
            <p className="stat-value">{stats.processing}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98120' }}>
            <FaCheck color="#10b981" />
          </div>
          <div className="stat-info">
            <h3>Delivered</h3>
            <p className="stat-value">{stats.delivered}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#c9a96e20' }}>
            <FaCheck color="#c9a96e" />
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.revenue)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search orders by ID, customer, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <FaFilter />
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{order.customer}</div>
                    <div className="customer-email">{order.email}</div>
                    <div className="customer-phone">{order.phone}</div>
                  </div>
                </td>
                <td className="text-center">{order.items || order.products?.length || 0}</td>
                <td className="amount">{formatCurrency(order.amount || order.total || 0)}</td>
                <td>
                  <select
                    className={`status-select ${order.status}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ 
                      backgroundColor: getStatusColor(order.status) + '20',
                      color: getStatusColor(order.status),
                      borderColor: getStatusColor(order.status)
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{order.paymentMethod || 'Cash'}</td>
                <td>{formatDate(order.date || order.createdAt)}</td>
                <td>
                  <button 
                    className="btn-view"
                    onClick={() => window.location.href = `/orders/${order.id}`}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="no-results">
            <p>No orders found</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .orders-page {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #111;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary, .btn-refresh {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #c9a96e;
          color: white;
        }

        .btn-primary:hover {
          background: #b08e5e;
        }

        .btn-refresh {
          background: #f8f9fa;
          color: #333;
          border: 1px solid #e0e0e0;
        }

        .btn-refresh:hover {
          background: #e9ecef;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-info h3 {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.2rem;
        }

        .stat-value {
          font-size: 1.3rem;
          font-weight: 600;
          color: #111;
        }

        .filters-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 0 1rem;
        }

        .search-box svg {
          color: #999;
          margin-right: 0.5rem;
        }

        .search-box input {
          flex: 1;
          padding: 0.75rem 0;
          border: none;
          outline: none;
          font-size: 0.95rem;
        }

        .filter-group {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 0 1rem;
        }

        .filter-group svg {
          color: #999;
          margin-right: 0.5rem;
        }

        .filter-group select {
          padding: 0.75rem 0;
          border: none;
          outline: none;
          background: none;
          cursor: pointer;
          min-width: 140px;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th {
          text-align: left;
          padding: 1rem;
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e0e0e0;
        }

        .orders-table td {
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .order-id {
          font-weight: 600;
          color: #c9a96e;
        }

        .customer-info {
          display: flex;
          flex-direction: column;
        }

        .customer-name {
          font-weight: 500;
          color: #333;
        }

        .customer-email, .customer-phone {
          font-size: 0.85rem;
          color: #999;
        }

        .text-center {
          text-align: center;
        }

        .amount {
          font-weight: 600;
          color: #111;
        }

        .status-select {
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          border: 1px solid;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          outline: none;
        }

        .btn-view {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          background: #c9a96e;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-view:hover {
          background: #b08e5e;
          transform: scale(1.05);
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: #999;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-bar {
            flex-direction: column;
          }

          .table-container {
            overflow-x: auto;
          }

          .orders-table {
            min-width: 1000px;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;