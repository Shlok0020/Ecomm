// admin/src/pages/Orders/Orders.jsx - COMPLETE FIXED VERSION with address handling
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaDownload, 
  FaSync, 
  FaCheck, 
  FaTimes,
  FaShoppingBag,
  FaUsers,
  FaRupeeSign,
  FaBoxes,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaTrash,
  FaEdit,
  FaPrint,
  FaWhatsapp,
  FaEnvelope as FaEmail
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ✅ Helper function to format address properly
const formatAddress = (address) => {
  if (!address) return 'No address provided';
  
  console.log('Formatting address:', address);
  
  // Agar string hai to direct return
  if (typeof address === 'string') {
    return address || 'No address provided';
  }
  
  // Agar fullAddress property hai to use karo
  if (address.fullAddress) {
    return address.fullAddress;
  }
  
  // Agar address object hai to parts jodo
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.landmark) parts.push(address.landmark);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.pincode) parts.push(address.pincode);
  
  if (parts.length > 0) {
    return parts.join(', ');
  }
  
  // Agar addressLine1 ya addressLine2 ho
  if (address.addressLine1) parts.push(address.addressLine1);
  if (address.addressLine2) parts.push(address.addressLine2);
  if (address.city) parts.push(address.city);
  
  if (parts.length > 0) {
    return parts.join(', ');
  }
  
  // Agar address object hai but koi property nahi mili
  return JSON.stringify(address);
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0
  });

  // Check authentication first
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login...');
      navigate('/login', { replace: true });
      return;
    }
    
    fetchOrders();
    
    // Listen for real-time updates
    const handleOrderUpdate = () => {
      console.log('📦 Orders updated - refreshing...');
      fetchOrders();
    };
    
    window.addEventListener('orderUpdated', handleOrderUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'orders' || e.key === null || e.key?.includes('order')) {
        fetchOrders();
      }
    });
    
    return () => {
      window.removeEventListener('orderUpdated', handleOrderUpdate);
      window.removeEventListener('storage', handleOrderUpdate);
    };
  }, [navigate]);

  // ✅ FIX: Normalize order data to handle different database structures
  const normalizeOrderData = (order) => {
    if (!order) return null;
    
    console.log('📦 Raw order from DB:', order);
    
    // Extract customer information from various possible structures
    let customerName = 'N/A';
    let customerEmail = 'N/A';
    let customerPhone = 'N/A';
    let customerAddress = null;
    
    // Try to get customer name from different possible paths
    if (order.userName) customerName = order.userName;
    else if (order.customer?.name) customerName = order.customer.name;
    else if (order.customer) {
      if (typeof order.customer === 'string') customerName = order.customer;
      else if (order.customer.name) customerName = order.customer.name;
    }
    else if (order.user?.name) customerName = order.user.name;
    else if (order.name) customerName = order.name;
    else if (order.customerInfo?.name) customerName = order.customerInfo.name;
    else if (order.shippingDetails?.name) customerName = order.shippingDetails.name;
    
    // Try to get email from different possible paths
    if (order.userEmail) customerEmail = order.userEmail;
    else if (order.customer?.email) customerEmail = order.customer.email;
    else if (order.email) customerEmail = order.email;
    else if (order.user?.email) customerEmail = order.user.email;
    else if (order.customerInfo?.email) customerEmail = order.customerInfo.email;
    else if (order.shippingDetails?.email) customerEmail = order.shippingDetails.email;
    
    // Try to get phone from different possible paths
    if (order.userPhone) customerPhone = order.userPhone;
    else if (order.customer?.phone) customerPhone = order.customer.phone;
    else if (order.phone) customerPhone = order.phone;
    else if (order.user?.phone) customerPhone = order.user.phone;
    else if (order.customerInfo?.phone) customerPhone = order.customerInfo.phone;
    else if (order.shippingDetails?.phone) customerPhone = order.shippingDetails.phone;
    
    // Try to get address from different possible paths
    if (order.userAddress) customerAddress = order.userAddress;
    else if (order.address) customerAddress = order.address;
    else if (order.shippingAddress) customerAddress = order.shippingAddress;
    else if (order.customerInfo?.address) customerAddress = order.customerInfo.address;
    else if (order.shippingDetails?.address) customerAddress = order.shippingDetails.address;
    else if (order.deliveryAddress) customerAddress = order.deliveryAddress;
    
    // Get products from various possible paths
    let products = [];
    if (order.products && Array.isArray(order.products)) products = order.products;
    else if (order.items && Array.isArray(order.items)) products = order.items;
    else if (order.orderItems && Array.isArray(order.orderItems)) products = order.orderItems;
    else if (order.cartItems && Array.isArray(order.cartItems)) products = order.cartItems;
    
    // Ensure each product has required fields
    products = products.map(p => ({
      name: p.name || p.productName || p.title || 'Product',
      price: p.price || p.unitPrice || p.amount || 0,
      quantity: p.quantity || p.qty || 1
    }));
    
    // Get order ID
    const orderId = order.id || order._id || order.orderId || `ORD-${Date.now()}`;
    
    // Get total amount
    const totalAmount = order.totalAmount || order.amount || order.total || 0;
    
    // Get status
    const status = order.status || 'pending';
    
    // Get dates
    const createdAt = order.createdAt || order.date || order.orderDate || new Date().toISOString();
    
    const normalizedOrder = {
      ...order,
      id: orderId,
      _id: order._id || orderId,
      userName: customerName,
      userEmail: customerEmail,
      userPhone: customerPhone,
      userAddress: customerAddress,
      products: products,
      totalAmount: totalAmount,
      status: status,
      createdAt: createdAt,
      date: createdAt
    };
    
    console.log('✅ Normalized order:', normalizedOrder);
    return normalizedOrder;
  };

  // Fetch orders from database
  const fetchOrders = async () => {
    setLoading(true);
    setApiError(false);
    
    try {
      // Check token before API call
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found during fetch, redirecting...');
        navigate('/login', { replace: true });
        return;
      }

      // Try to get from API first
      let ordersData = [];
      
      try {
        console.log('📦 Fetching orders from API:', `${API_URL}/orders`);
        
        const response = await fetch(`${API_URL}/orders`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 API Response:', data);
        
        // Handle different response structures
        if (Array.isArray(data)) {
          ordersData = data;
        } else if (data.data && Array.isArray(data.data)) {
          ordersData = data.data;
        } else if (data.orders && Array.isArray(data.orders)) {
          ordersData = data.orders;
        } else if (data.results && Array.isArray(data.results)) {
          ordersData = data.results;
        } else {
          ordersData = [];
        }
        
        console.log(`📦 Found ${ordersData.length} orders from API`);
        
      } catch (apiError) {
        console.error('API fetch failed:', apiError);
        setApiError(true);
        toast.error('Server connection issue. Using local data.');
        
        // Fallback to sample data if API fails
        ordersData = getSampleOrders();
      }
      
      // ✅ FIX: Normalize all orders to ensure customer info is present
      const normalizedOrders = ordersData.map(order => normalizeOrderData(order));
      
      console.log('✅ Normalized orders:', normalizedOrders);
      setOrders(normalizedOrders);
      
      // Calculate stats
      const totalRevenue = normalizedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
      setStats({
        total: normalizedOrders.length,
        pending: normalizedOrders.filter(o => o.status === 'pending').length,
        processing: normalizedOrders.filter(o => o.status === 'processing').length,
        shipped: normalizedOrders.filter(o => o.status === 'shipped').length,
        delivered: normalizedOrders.filter(o => o.status === 'delivered').length,
        cancelled: normalizedOrders.filter(o => o.status === 'cancelled').length,
        revenue: totalRevenue
      });
      
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      
      // Check if it's an auth error
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        console.log('Auth error - redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
        toast.error('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } else {
        toast.error('Failed to load orders');
        // Use sample data as fallback
        const sampleOrders = getSampleOrders().map(order => normalizeOrderData(order));
        setOrders(sampleOrders);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sample orders data for fallback
  const getSampleOrders = () => {
    return [
      {
        id: 'ORD-001',
        userName: 'Rahul Sharma',
        userEmail: 'rahul@example.com',
        userPhone: '9876543210',
        totalAmount: 2500,
        status: 'delivered',
        createdAt: new Date().toISOString(),
        products: [
          { name: 'Glass Tumbler', price: 500, quantity: 3 },
          { name: 'Water Bottle', price: 1000, quantity: 1 }
        ],
        userAddress: { fullAddress: '123 Main St, Mumbai - 400001' }
      },
      {
        id: 'ORD-002',
        userName: 'Priya Patel',
        userEmail: 'priya@example.com',
        userPhone: '9876543211',
        totalAmount: 1800,
        status: 'processing',
        createdAt: new Date().toISOString(),
        products: [
          { name: 'Glass Set', price: 1200, quantity: 1 },
          { name: 'Mugs', price: 600, quantity: 1 }
        ],
        userAddress: { fullAddress: '456 Park Ave, Delhi - 110001' }
      },
      {
        id: 'ORD-003',
        userName: 'Amit Kumar',
        userEmail: 'amit@example.com',
        userPhone: '9876543212',
        totalAmount: 3200,
        status: 'pending',
        createdAt: new Date().toISOString(),
        products: [
          { name: 'Decorative Vase', price: 2200, quantity: 1 },
          { name: 'Glass Bowls', price: 1000, quantity: 1 }
        ],
        userAddress: { fullAddress: '789 Lake Road, Bangalore - 560001' }
      }
    ];
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      // Try API first
      try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
          console.log('API update failed, updating locally');
        }
      } catch (apiError) {
        console.log('API update failed, updating locally:', apiError);
      }
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
      
      // Trigger real-time update
      window.dispatchEvent(new CustomEvent('orderUpdated', { 
        detail: { orderId, status: newStatus } 
      }));
      
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Try API first
      try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (apiError) {
        console.log('API delete failed, deleting locally');
      }
      
      // Update local state
      setOrders(prev => prev.filter(order => order.id !== orderId));
      
      toast.success('Order deleted successfully');
      
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  // View order details
  const handleViewDetails = (order) => {
    console.log('📦 Viewing order details:', order);
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Send WhatsApp notification
  const handleSendWhatsApp = (order) => {
    const phone = order.userPhone;
    if (!phone || phone === 'N/A' || phone === 'Not provided') {
      toast.error('Customer phone number not available');
      return;
    }
    
    const message = `Hello ${order.userName}, your order #${order.id} is ${order.status}. Total: ₹${order.totalAmount}. Thank you for shopping with New Prem Glass House!`;
    
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Send Email notification
  const handleSendEmail = (order) => {
    const email = order.userEmail;
    if (!email || email === 'N/A' || email === 'Not provided') {
      toast.error('Customer email not available');
      return;
    }
    
    const subject = `Order #${order.id} Status Update`;
    const body = `Hello ${order.userName},\n\nYour order #${order.id} is currently ${order.status}.\n\nTotal Amount: ₹${order.totalAmount}\n\nThank you for shopping with New Prem Glass House!`;
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    toast.success(`Email client opened for ${email}`);
  };

  // Print order
  const handlePrintOrder = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #c9a96e; }
            .order-details { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f8f9fa; }
            .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">New Prem Glass House</div>
            <p>Bombay Chowk, Jharsuguda | +91 7328019093</p>
            <h2>Order Invoice</h2>
          </div>
          <div class="order-details">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
            <p><strong>Customer:</strong> ${order.userName}</p>
            <p><strong>Phone:</strong> ${order.userPhone}</p>
            <p><strong>Email:</strong> ${order.userEmail}</p>
            <p><strong>Address:</strong> ${formatAddress(order.userAddress)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <h3>Products</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${(order.products || []).map(p => `
                <tr>
                  <td>${p.name || 'Product'}</td>
                  <td>₹${p.price || 0}</td>
                  <td>${p.quantity || 1}</td>
                  <td>₹${(p.price || 0) * (p.quantity || 1)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Total Amount: ₹${order.totalAmount || 0}</p>
          </div>
          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.userEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.userPhone || '').includes(searchTerm);
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    // Date filtering
    let matchesDate = true;
    if (dateRange !== 'all') {
      const orderDate = new Date(order.createdAt || Date.now());
      const today = new Date();
      
      if (dateRange === 'today') {
        matchesDate = orderDate.toDateString() === today.toDateString();
      } else if (dateRange === 'week') {
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        matchesDate = orderDate >= weekAgo;
      } else if (dateRange === 'month') {
        matchesDate = orderDate.getMonth() === today.getMonth() && 
                      orderDate.getFullYear() === today.getFullYear();
      } else if (dateRange === 'year') {
        matchesDate = orderDate.getFullYear() === today.getFullYear();
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
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

  // Export orders to CSV
  const handleExport = () => {
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }
    
    const headers = ['Order ID', 'Customer', 'Email', 'Phone', 'Amount', 'Status', 'Date', 'Products'];
    const rows = orders.map(order => [
      order.id || 'N/A',
      order.userName || 'N/A',
      order.userEmail || 'N/A',
      order.userPhone || 'N/A',
      order.totalAmount || 0,
      order.status || 'pending',
      formatDate(order.createdAt),
      (order.products?.length || 0) + ' items'
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Orders exported successfully');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading orders from database...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            gap: 1rem;
          }
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
    <motion.div 
      className="orders-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div>
          <h1>Orders Management</h1>
          <p className="subtitle">
            {apiError ? '🔄 Offline Mode - Using local data' : `📦 ${orders.length} orders found in database`}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchOrders}>
            <FaSync /> Refresh
          </button>
          <button className="btn-primary" onClick={handleExport}>
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#c9a96e20' }}>
            <FaShoppingBag color="#c9a96e" />
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b20' }}>
            <FaClock color="#f59e0b" />
          </div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f620' }}>
            <FaSync color="#3b82f6" />
          </div>
          <div className="stat-info">
            <h3>Processing</h3>
            <p className="stat-value">{stats.processing}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf620' }}>
            <FaBoxes color="#8b5cf6" />
          </div>
          <div className="stat-info">
            <h3>Shipped</h3>
            <p className="stat-value">{stats.shipped}</p>
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
            <FaRupeeSign color="#c9a96e" />
          </div>
          <div className="stat-info">
            <h3>Revenue</h3>
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
            placeholder="Search by Order ID, Customer, Email or Phone..."
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
              <th>Contact</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results">
                  <FaShoppingBag size={40} color="#ccc" />
                  <p>No orders found</p>
                  <small>Orders will appear here when customers place them</small>
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                >
                  <td className="order-id">#{order.id?.slice(-8) || order.id}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">
                        <FaUser /> {order.userName}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      {order.userPhone && order.userPhone !== 'N/A' && (
                        <div className="contact-item">
                          <FaPhone /> {order.userPhone}
                        </div>
                      )}
                      {order.userEmail && order.userEmail !== 'N/A' && (
                        <div className="contact-item">
                          <FaEnvelope /> {order.userEmail.length > 15 ? order.userEmail.substring(0, 15) + '...' : order.userEmail}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-center">{order.products?.length || 0}</td>
                  <td className="amount">{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <select
                      className={`status-select ${order.status}`}
                      value={order.status || 'pending'}
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
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-view"
                        onClick={() => handleViewDetails(order)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="btn-whatsapp"
                        onClick={() => handleSendWhatsApp(order)}
                        title="Send WhatsApp"
                        disabled={!order.userPhone || order.userPhone === 'N/A'}
                      >
                        <FaWhatsapp />
                      </button>
                      <button 
                        className="btn-email"
                        onClick={() => handleSendEmail(order)}
                        title="Send Email"
                        disabled={!order.userEmail || order.userEmail === 'N/A'}
                      >
                        <FaEmail />
                      </button>
                      <button 
                        className="btn-print"
                        onClick={() => handlePrintOrder(order)}
                        title="Print Invoice"
                      >
                        <FaPrint />
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteOrder(order.id)}
                        title="Delete Order"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedOrder && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Order Details</h2>
                <button className="close-btn" onClick={() => setShowDetailsModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <div className="order-info-grid">
                  <div className="info-section">
                    <h3><FaShoppingBag /> Order Information</h3>
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Status:</strong> 
                      <span className={`status-badge ${selectedOrder.status}`} style={{
                        backgroundColor: getStatusColor(selectedOrder.status) + '20',
                        color: getStatusColor(selectedOrder.status),
                        padding: '0.2rem 0.8rem',
                        borderRadius: '20px',
                        marginLeft: '0.5rem'
                      }}>
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p><strong>Total Amount:</strong> {formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>

                  <div className="info-section">
                    <h3><FaUser /> Customer Details</h3>
                    <p><strong>Name:</strong> {selectedOrder.userName}</p>
                    <p><strong>Phone:</strong> {selectedOrder.userPhone}</p>
                    <p><strong>Email:</strong> {selectedOrder.userEmail}</p>
                  </div>

                  <div className="info-section">
                    <h3><FaMapMarkerAlt /> Shipping Address</h3>
                    {/* ✅ FIXED: Using formatAddress helper function */}
                    <p>{formatAddress(selectedOrder.userAddress)}</p>
                  </div>
                </div>

                <div className="products-section">
                  <h3>Products</h3>
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.products || []).map((product, index) => (
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>{formatCurrency(product.price)}</td>
                          <td>{product.quantity}</td>
                          <td>{formatCurrency(product.price * product.quantity)}</td>
                        </tr>
                      ))}
                      {(selectedOrder.products?.length === 0) && (
                        <tr>
                          <td colSpan="4" className="text-center">No products found</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                        <td><strong>{formatCurrency(selectedOrder.totalAmount)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handlePrintOrder(selectedOrder)}
                >
                  <FaPrint /> Print Invoice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .orders-page {
          padding: 2rem;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #111;
          margin-bottom: 0.3rem;
        }

        .subtitle {
          color: #666;
          font-size: 0.95rem;
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
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(201, 169, 110, 0.3);
        }

        .btn-refresh {
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
        }

        .btn-refresh:hover {
          background: #f8f9fa;
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
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
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #666;
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
          width: 120px;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn-view, .btn-whatsapp, .btn-email, .btn-print, .btn-delete {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }

        .btn-view {
          background: #c9a96e;
        }
        .btn-view:hover {
          background: #b08e5e;
        }

        .btn-whatsapp {
          background: #25D366;
        }
        .btn-whatsapp:hover {
          background: #128C7E;
        }
        .btn-whatsapp:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-email {
          background: #3b82f6;
        }
        .btn-email:hover {
          background: #2563eb;
        }
        .btn-email:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-print {
          background: #6b7280;
        }
        .btn-print:hover {
          background: #4b5563;
        }

        .btn-delete {
          background: #ef4444;
        }
        .btn-delete:hover {
          background: #dc2626;
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: #999;
        }

        .no-results svg {
          margin-bottom: 1rem;
          opacity: 0.3;
        }

        .no-results small {
          display: block;
          margin-top: 0.5rem;
          color: #c9a96e;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e0e0e0;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          color: #111;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #f8f9fa;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #ef4444;
          color: white;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .order-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-section {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
        }

        .info-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #c9a96e;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .info-section p {
          margin-bottom: 0.5rem;
          color: #555;
          font-size: 0.9rem;
          word-break: break-word;
        }

        .products-section {
          margin-top: 2rem;
        }

        .products-section h3 {
          margin-bottom: 1rem;
          color: #333;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
        }

        .products-table th {
          text-align: left;
          padding: 0.75rem;
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .products-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .products-table tfoot td {
          padding-top: 1rem;
          font-weight: 600;
        }

        .text-right {
          text-align: right;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e0e0e0;
          position: sticky;
          bottom: 0;
          background: white;
        }

        .btn-secondary {
          padding: 0.75rem 1.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #f8f9fa;
        }

        @media (max-width: 1400px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1200px) {
          .order-info-grid {
            grid-template-columns: repeat(2, 1fr);
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
            min-width: 1200px;
          }

          .order-info-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            width: 95%;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Orders;