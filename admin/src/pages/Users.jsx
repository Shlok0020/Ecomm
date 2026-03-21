// admin/src/pages/Users/Users.jsx - COMPLETE FIXED VERSION
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaEye, 
  FaDownload, 
  FaSync, 
  FaTimes,
  FaUsers as FaUsersIcon,
  FaUserCheck,
  FaUserTimes,
  FaPhone,
  FaShoppingBag,
  FaBox,
  FaRupeeSign,
  FaHistory,
  FaDatabase,
  FaBan
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import userService from '../services/userService';

const API_URL = 'api.newpremglasshouse.in/api';

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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    customers: 0,
    newThisMonth: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  // Fetch users and orders on component mount
  useEffect(() => {
    // Check admin token first
    const token = localStorage.getItem('token');
    console.log('🔑 Admin Token from localStorage:', token ? token.substring(0, 20) + '...' : 'MISSING');
    
    if (!token) {
      setError('No admin token found. Please login as admin.');
      setLoading(false);
      return;
    }
    
    // Fetch users first, then orders
    fetchUsers();
    
    // Listen for updates
    const handleUpdate = () => {
      console.log('🔄 Data updated - refreshing...');
      fetchUsers();
    };
    
    window.addEventListener('userUpdated', handleUpdate);
    window.addEventListener('orderCreated', handleUpdate);
    window.addEventListener('orderUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', handleUpdate);
      window.removeEventListener('orderCreated', handleUpdate);
      window.removeEventListener('orderUpdated', handleUpdate);
    };
  }, []);

  // ==================== FETCH USERS FROM DATABASE ====================
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📦 Fetching users from database using userService...');
      
      const response = await userService.getAll();
      console.log('📦 Users from database:', response);
      
      // Handle different response formats
      let usersData = [];
      if (response?.data && Array.isArray(response.data)) {
        usersData = response.data;
      } else if (Array.isArray(response)) {
        usersData = response;
      } else if (response?.users && Array.isArray(response.users)) {
        usersData = response.users;
      } else {
        console.warn('Unexpected response format:', response);
        usersData = [];
      }
      
      console.log('✅ Users data:', usersData.length, 'users found');
      setUsers(usersData);
      
      // After getting users, fetch orders
      await fetchAllOrders(usersData);
      
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      
      let errorMessage = 'Failed to fetch users';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else if (error.response?.status === 403) {
        errorMessage = 'You don\'t have permission to view users. Make sure you are logged in as admin.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  // ==================== FETCH ALL ORDERS ====================
  const fetchAllOrders = async (usersList) => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('📦 Fetching orders from database...');
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.log('⚠️ Could not fetch orders:', response.status);
        calculateStats(usersList, []);
        return;
      }
      
      const data = await response.json();
      console.log('📦 Orders from database:', data);
      
      // Handle different response formats
      let ordersList = [];
      if (data?.data && Array.isArray(data.data)) {
        ordersList = data.data;
      } else if (Array.isArray(data)) {
        ordersList = data;
      } else if (data?.orders && Array.isArray(data.orders)) {
        ordersList = data.orders;
      }
      
      setOrders(ordersList);
      calculateStats(usersList, ordersList);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      calculateStats(usersList, []);
    }
  };

  // ==================== CALCULATE STATS ====================
  const calculateStats = (usersList, ordersList) => {
    console.log('📊 Calculating stats with users:', usersList.length, 'orders:', ordersList.length);
    
    // Create a map of user IDs to their orders
    const userOrderCount = {};
    const userTotalSpent = {};
    const userOrdersMap = {};
    
    ordersList.forEach(order => {
      // Get user ID from order
      let userId = null;
      
      if (order.user) {
        userId = typeof order.user === 'object' ? order.user._id || order.user.id : order.user;
      } else if (order.userId) {
        userId = order.userId;
      } else if (order.customerInfo?.email) {
        // Try to match by email
        const matchingUser = usersList.find(u => u.email === order.customerInfo.email);
        if (matchingUser) {
          userId = matchingUser._id || matchingUser.id;
        }
      }
      
      if (userId) {
        const userIdStr = userId.toString();
        
        userOrderCount[userIdStr] = (userOrderCount[userIdStr] || 0) + 1;
        userTotalSpent[userIdStr] = (userTotalSpent[userIdStr] || 0) + (order.totalAmount || 0);
        
        if (!userOrdersMap[userIdStr]) {
          userOrdersMap[userIdStr] = [];
        }
        userOrdersMap[userIdStr].push(order);
      }
    });
    
    console.log('📊 Order counts:', userOrderCount);
    
    // Update users with order stats
    const updatedUsers = usersList.map(user => {
      const userId = (user._id || user.id)?.toString();
      return {
        ...user,
        id: userId,
        _id: user._id,
        orderCount: userOrderCount[userId] || 0,
        totalSpent: userTotalSpent[userId] || 0,
        orders: userOrdersMap[userId] || []
      };
    });
    
    setUsers(updatedUsers);
    
    // Calculate overall stats
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const activeUsers = updatedUsers.filter(u => u.status !== 'inactive' && u.status !== 'banned');
    const newThisMonth = updatedUsers.filter(u => {
      const created = new Date(u.createdAt || u.registeredAt || 0);
      return created >= firstDayOfMonth;
    }).length;
    
    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    setStats({
      total: updatedUsers.length,
      active: activeUsers.length,
      inactive: updatedUsers.filter(u => u.status === 'inactive' || u.status === 'banned').length,
      admins: updatedUsers.filter(u => u.role === 'admin').length,
      customers: updatedUsers.filter(u => u.role !== 'admin').length,
      newThisMonth: newThisMonth,
      totalOrders: totalOrders,
      totalRevenue: totalRevenue
    });
    
    setLoading(false);
  };

  // ==================== VIEW USER ORDERS ====================
  const handleViewOrders = (user) => {
    const userOrderList = user.orders || [];
    console.log(`📋 Found ${userOrderList.length} orders for user ${user.name}`, userOrderList);
    setUserOrders(userOrderList);
    setSelectedUser(user);
    setShowOrdersModal(true);
  };

  // ==================== VIEW USER DETAILS ====================
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // ==================== HANDLE REFRESH ====================
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetchUsers();
    toast.success('Refreshing data from database...');
  };

  // ==================== EXPORT TO CSV ====================
  const handleExport = () => {
    const headers = ['User ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Joined Date', 'Orders', 'Total Spent'];
    const rows = users.map(user => [
      user._id || user.id || '',
      user.name || 'N/A',
      user.email || 'N/A',
      user.phone || 'N/A',
      user.role || 'customer',
      user.status || 'active',
      formatDate(user.createdAt || user.registeredAt),
      user.orderCount || 0,
      `₹${(user.totalSpent || 0).toLocaleString()}`
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Users exported successfully');
  };

  // ==================== FILTER USERS ====================
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.name?.toLowerCase() || '').includes(searchLower) ||
      (user.email?.toLowerCase() || '').includes(searchLower) ||
      (user.phone || '').includes(searchTerm) ||
      ((user._id || user.id) || '').includes(searchTerm)
    );
  }).filter(user => {
    if (selectedRole !== 'all' && user.role !== selectedRole) return false;
    if (selectedStatus !== 'all' && user.status !== selectedStatus) return false;
    return true;
  });

  // ==================== BADGE HELPERS ====================
  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: '#10b98120', color: '#10b981', text: 'Active' },
      inactive: { bg: '#6b728020', color: '#6b7280', text: 'Inactive' },
      banned: { bg: '#ef444420', color: '#ef4444', text: 'Banned' }
    };
    return badges[status] || badges.inactive;
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { bg: '#c9a96e20', color: '#c9a96e', text: 'Admin' },
      customer: { bg: '#3b82f620', color: '#3b82f6', text: 'Customer' }
    };
    return badges[role] || badges.customer;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users from database...</p>
        <style>{`
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

  // ==================== ERROR STATE ====================
  if (error) {
    return (
      <div className="error-container">
        <FaBan size={50} color="#ef4444" />
        <h2>Database Connection Error</h2>
        <p>{error}</p>
        <div style={{ marginTop: '1rem' }}>
          <button className="btn-primary" onClick={handleRefresh}>
            <FaSync /> Try Again
          </button>
        </div>
        <style>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            gap: 1rem;
            text-align: center;
            padding: 2rem;
          }
          .error-container h2 {
            color: #ef4444;
          }
          .error-container p {
            color: #666;
            max-width: 500px;
          }
          .btn-primary {
            padding: 0.75rem 2rem;
            background: #c9a96e;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }
          .btn-primary:hover {
            background: #b08e5e;
          }
        `}</style>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <motion.div 
      className="users-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div>
          <h1>Users Management</h1>
          <p className="subtitle">Data from database - {users.length} users found</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={handleRefresh}>
            <FaSync /> Refresh from DB
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
            <FaUsersIcon color="#c9a96e" />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98120' }}>
            <FaUserCheck color="#10b981" />
          </div>
          <div className="stat-info">
            <h3>Active</h3>
            <p className="stat-value">{stats.active}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#6b728020' }}>
            <FaUserTimes color="#6b7280" />
          </div>
          <div className="stat-info">
            <h3>Inactive</h3>
            <p className="stat-value">{stats.inactive}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#c9a96e20' }}>
            <FaShoppingBag color="#c9a96e" />
          </div>
          <div className="stat-info">
            <h3>Admins</h3>
            <p className="stat-value">{stats.admins}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f620' }}>
            <FaBox color="#3b82f6" />
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b20' }}>
            <FaRupeeSign color="#f59e0b" />
          </div>
          <div className="stat-info">
            <h3>Revenue</h3>
            <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by Name, Email, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="filter-group">
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results">
                  <FaDatabase size={40} color="#ccc" />
                  <p>No users found in database</p>
                  <small>Users who register or login will appear here</small>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const statusBadge = getStatusBadge(user.status);
                const roleBadge = getRoleBadge(user.role);
                const userId = user._id || user.id;
                
                return (
                  <motion.tr 
                    key={userId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: '#f8f9fa' }}
                  >
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="user-name">{user.name || 'N/A'}</div>
                          <div className="user-email">{user.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        {user.phone && (
                          <div className="contact-item">
                            <FaPhone /> {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="role-badge" style={{
                        backgroundColor: roleBadge.bg,
                        color: roleBadge.color
                      }}>
                        {roleBadge.text}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge" style={{
                        backgroundColor: statusBadge.bg,
                        color: statusBadge.color
                      }}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="text-center">
                      <button 
                        className="orders-count-btn"
                        onClick={() => handleViewOrders(user)}
                        title="View User Orders"
                      >
                        <FaBox /> {user.orderCount || 0}
                      </button>
                    </td>
                    <td className="amount">₹{(user.totalSpent || 0).toLocaleString()}</td>
                    <td>{formatDate(user.createdAt || user.registeredAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view"
                          onClick={() => handleViewDetails(user)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        
                        <button 
                          className="btn-history"
                          onClick={() => handleViewOrders(user)}
                          title="View Orders History"
                        >
                          <FaHistory />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedUser && (
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
                <h2>User Details</h2>
                <button className="close-btn" onClick={() => setShowDetailsModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <div className="user-profile-header">
                  <div className="user-avatar-large">
                    {selectedUser.name?.charAt(0) || 'U'}
                  </div>
                  <div className="user-title-info">
                    <h3>{selectedUser.name || 'N/A'}</h3>
                    <p>{selectedUser.email || 'N/A'}</p>
                    <div className="user-badges">
                      <span className="role-badge-large" style={{
                        backgroundColor: getRoleBadge(selectedUser.role).bg,
                        color: getRoleBadge(selectedUser.role).color
                      }}>
                        {getRoleBadge(selectedUser.role).text}
                      </span>
                      <span className="status-badge-large" style={{
                        backgroundColor: getStatusBadge(selectedUser.status).bg,
                        color: getStatusBadge(selectedUser.status).color
                      }}>
                        {getStatusBadge(selectedUser.status).text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-info-grid">
                  <div className="info-section">
                    <h3>📞 Contact Information</h3>
                    <p><strong>Name:</strong> {selectedUser.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                  </div>

                  <div className="info-section">
                    <h3>📊 Order Statistics</h3>
                    <p><strong>Total Orders:</strong> {selectedUser.orderCount || 0}</p>
                    <p><strong>Total Spent:</strong> ₹{(selectedUser.totalSpent || 0).toLocaleString()}</p>
                  </div>

                  <div className="info-section">
                    <h3>📅 Account Info</h3>
                    <p><strong>User ID:</strong> {selectedUser._id || selectedUser.id}</p>
                    <p><strong>Joined:</strong> {formatDate(selectedUser.createdAt || selectedUser.registeredAt)}</p>
                  </div>
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
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleViewOrders(selectedUser);
                  }}
                >
                  View Orders ({selectedUser.orderCount || 0})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Orders Modal */}
      <AnimatePresence>
        {showOrdersModal && selectedUser && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOrdersModal(false)}
          >
            <motion.div 
              className="modal-content orders-modal"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>
                  <FaBox /> Orders - {selectedUser.name}
                </h2>
                <button className="close-btn" onClick={() => setShowOrdersModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                {userOrders.length === 0 ? (
                  <div className="no-orders">
                    <FaShoppingBag size={50} color="#ccc" />
                    <p>No orders found for this user</p>
                  </div>
                ) : (
                  <>
                    <div className="orders-summary">
                      <p><strong>Total Orders:</strong> {userOrders.length}</p>
                      <p><strong>Total Spent:</strong> ₹{userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}</p>
                    </div>
                    
                    <div className="orders-list">
                      {userOrders.map((order, index) => (
                        <div key={order._id || index} className="order-item">
                          <div className="order-header">
                            <span className="order-id">Order #{order.orderId || order._id?.slice(-6) || `ORD-${index + 1}`}</span>
                            <span className="order-status" style={{
                              backgroundColor: getStatusColor(order.status) + '20',
                              color: getStatusColor(order.status)
                            }}>
                              {order.status || 'pending'}
                            </span>
                          </div>
                          
                          <div className="order-details">
                            <p><strong>Date:</strong> {formatDate(order.createdAt || order.orderDate)}</p>
                            <p><strong>Items:</strong> {order.products?.length || order.items?.length || 0}</p>
                            <p><strong>Total:</strong> ₹{(order.totalAmount || 0).toLocaleString()}</p>
                            <p><strong>Payment:</strong> {order.paymentMethod || 'cash'}</p>
                          </div>
                          
                          <div className="order-products">
                            {(order.products || order.items || []).map((product, idx) => (
                              <span key={idx} className="product-tag">
                                {product.name} x{product.quantity}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowOrdersModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .users-page {
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
          min-width: 250px;
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
          background: transparent;
        }

        .filter-group {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 0 1rem;
          min-width: 140px;
        }

        .filter-group select {
          padding: 0.75rem 0;
          border: none;
          outline: none;
          background: none;
          cursor: pointer;
          width: 100%;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .users-table th {
          text-align: left;
          padding: 1rem;
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e0e0e0;
        }

        .users-table td {
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #c9a96e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .user-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.2rem;
        }

        .user-email {
          font-size: 0.85rem;
          color: #999;
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
          font-size: 0.9rem;
          color: #666;
        }

        .role-badge, .status-badge {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .text-center {
          text-align: center;
        }

        .orders-count-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.8rem;
          background: #c9a96e20;
          color: #c9a96e;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .orders-count-btn:hover {
          background: #c9a96e;
          color: white;
        }

        .amount {
          font-weight: 600;
          color: #c9a96e;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-view, .btn-history {
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

        .btn-history {
          background: #3b82f6;
        }
        .btn-history:hover {
          background: #2563eb;
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
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .orders-modal {
          max-width: 900px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          color: #111;
          display: flex;
          align-items: center;
          gap: 0.5rem;
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

        .user-profile-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .user-avatar-large {
          width: 80px;
          height: 80px;
          background: #c9a96e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 2.5rem;
        }

        .user-title-info h3 {
          font-size: 1.8rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .user-title-info p {
          color: #666;
          margin-bottom: 0.5rem;
        }

        .user-badges {
          display: flex;
          gap: 0.5rem;
        }

        .role-badge-large, .status-badge-large {
          padding: 0.4rem 1rem;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .user-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .info-section {
          background: #f8f9fa;
          padding: 1.2rem;
          border-radius: 10px;
        }

        .info-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #c9a96e;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .info-section p {
          margin-bottom: 0.5rem;
          color: #555;
        }

        .no-orders {
          text-align: center;
          padding: 3rem;
          color: #999;
        }

        .orders-summary {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          gap: 2rem;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
          border-left: 4px solid #c9a96e;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .order-id {
          font-weight: 600;
          color: #333;
        }

        .order-status {
          padding: 0.2rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .order-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .order-products {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .product-tag {
          background: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #666;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e0e0e0;
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
          .user-info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-bar {
            flex-direction: column;
          }

          .users-table {
            min-width: 1200px;
          }

          .user-profile-header {
            flex-direction: column;
            text-align: center;
          }

          .modal-content {
            width: 95%;
          }

          .orders-summary {
            flex-direction: column;
            gap: 0.5rem;
          }

          .order-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Users;