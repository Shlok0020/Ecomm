// frontend/src/pages/MyOrders.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBox, 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaShoppingBag,
  FaArrowRight,
  FaStar,
  FaRegStar,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaGift,
  FaCreditCard,
  FaHome,
  FaTag,
  FaWeightHanging,
  FaRuler,
  FaIndustry
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// ============= IMAGE URL HELPER =============
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `api.newpremglasshouse.in${imagePath}`;
  return `api.newpremglasshouse.in/uploads/${imagePath}`;
};
// ============================================

// ============= HIDE FOOTER ON THIS PAGE =============
export const hideFooter = true;
// ===================================================

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
    
    // Hide footer
    window.dispatchEvent(new CustomEvent('hideFooter', { detail: { hide: true } }));
    
    return () => {
      window.dispatchEvent(new CustomEvent('hideFooter', { detail: { hide: false } }));
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      const response = await fetch('api.newpremglasshouse.in/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        const ordersArray = data.data || [];
        setOrders(ordersArray);
      } else {
        toast.error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: '#f59e0b', 
        bg: '#fef3c7', 
        icon: <FaClock />, 
        text: 'Pending',
        border: '#f59e0b'
      },
      processing: { 
        color: '#3b82f6', 
        bg: '#dbeafe', 
        icon: <FaBox />, 
        text: 'Processing',
        border: '#3b82f6'
      },
      shipped: { 
        color: '#8b5cf6', 
        bg: '#ede9fe', 
        icon: <FaTruck />, 
        text: 'Shipped',
        border: '#8b5cf6'
      },
      delivered: { 
        color: '#10b981', 
        bg: '#d1fae5', 
        icon: <FaCheckCircle />, 
        text: 'Delivered',
        border: '#10b981'
      },
      cancelled: { 
        color: '#ef4444', 
        bg: '#fee2e2', 
        icon: <FaTimesCircle />, 
        text: 'Cancelled',
        border: '#ef4444'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 1rem',
        background: config.bg,
        color: config.color,
        borderRadius: '30px',
        fontSize: '0.8rem',
        fontWeight: '600',
        border: `1px solid ${config.border}30`
      }}>
        {config.icon} {config.text}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      active: orders.filter(o => ['processing', 'shipped'].includes(o.status)).length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalSpent: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    };
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(o => 
        o.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.products?.some(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOption === 'highest') {
        return (b.totalAmount || 0) - (a.totalAmount || 0);
      } else {
        return (a.totalAmount || 0) - (b.totalAmount || 0);
      }
    });
    
    return filtered;
  };

  const stats = getOrderStats();
  const filteredOrders = filterOrders();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f8f5f0, #f0e9e0)'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e0d5c8',
            borderTop: '4px solid #c9a96e',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600;700&display=swap');

        .my-orders-page {
          min-height: 100vh;
          background: #f8f5f0;
          font-family: 'Jost', sans-serif;
          position: relative;
        }

        /* Header Section */
        .orders-header {
          background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
          padding: 3rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .orders-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          color: white;
          margin-bottom: 0.5rem;
        }

        .header-title span {
          color: #c9a96e;
          font-style: italic;
        }

        .header-subtitle {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        /* Stats Cards */
        .stats-container {
          max-width: 1200px;
          margin: -2rem auto 2rem;
          padding: 0 2rem;
          position: relative;
          z-index: 10;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px -15px #c9a96e50;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          background: #f8f5f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a96e;
          font-size: 1.3rem;
        }

        .stat-info h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 0.2rem;
        }

        .stat-info p {
          color: #999;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-large {
          grid-column: span 2;
        }

        .stat-large .stat-info h3 {
          font-size: 2rem;
          color: #c9a96e;
        }

        /* Main Content */
        .orders-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Search & Filter Bar */
        .search-bar {
          background: white;
          border-radius: 50px;
          padding: 0.5rem 0.5rem 0.5rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .search-input {
          flex: 1;
          border: none;
          padding: 0.8rem 0;
          font-size: 0.9rem;
          background: transparent;
        }

        .search-input:focus {
          outline: none;
        }

        .search-icon {
          color: #999;
        }

        .filter-btn {
          background: #f8f5f0;
          border: none;
          border-radius: 50px;
          padding: 0.8rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #666;
        }

        .filter-btn:hover {
          background: #c9a96e;
          color: white;
        }

        .filter-btn:hover svg {
          color: white;
        }

        .filter-panel {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .filter-options {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filter-option label {
          color: #666;
          font-size: 0.9rem;
        }

        .filter-option select {
          padding: 0.5rem 1rem;
          border: 1px solid #f0f0f0;
          border-radius: 30px;
          background: #f8f5f0;
          color: #333;
        }

        /* Orders Grid */
        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .order-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }

        .order-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 30px 40px -15px #c9a96e80;
        }

        .order-card-header {
          padding: 1.2rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #faf8f5;
        }

        .order-id-badge {
          background: #c9a96e20;
          color: #c9a96e;
          padding: 0.3rem 1rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .order-date {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: #999;
          font-size: 0.8rem;
        }

        .order-card-body {
          padding: 1.2rem;
        }

        .product-preview {
          display: flex;
          gap: 0.8rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .preview-image {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          object-fit: cover;
          border: 2px solid #f0f0f0;
        }

        .preview-more {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: #f8f5f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a96e;
          font-size: 0.8rem;
          font-weight: 600;
          border: 2px dashed #c9a96e50;
        }

        .order-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .order-amount {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
        }

        .order-amount svg {
          color: #c9a96e;
        }

        .order-card-footer {
          padding: 1rem 1.2rem;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #faf8f5;
        }

        .view-details {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #c9a96e;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .view-details:hover {
          gap: 1rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 40px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #faf8f5;
          border-radius: 40px 40px 0 0;
        }

        .modal-header h2 {
          font-family: 'Cormorant Garamond', serif;
          color: #333;
          font-size: 2rem;
        }

        .modal-header h2 span {
          color: #c9a96e;
        }

        .close-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 10px rgba(0,0,0,0.1);
        }

        .modal-body {
          padding: 2rem;
        }

        .detail-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-section:last-child {
          border-bottom: none;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          color: #c9a96e;
          margin-bottom: 1rem;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .info-card {
          background: #f8f5f0;
          padding: 1rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .info-card svg {
          color: #c9a96e;
          font-size: 1.2rem;
        }

        .info-card-content h4 {
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 0.2rem;
        }

        .info-card-content p {
          color: #333;
          font-weight: 500;
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .product-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f8f5f0;
          border-radius: 16px;
        }

        .product-item img {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
        }

        .product-details {
          flex: 1;
        }

        .product-details h4 {
          color: #333;
          margin-bottom: 0.3rem;
        }

        .product-meta {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .product-meta span {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: #666;
          font-size: 0.9rem;
        }

        .total-amount {
          font-size: 1.3rem;
          font-weight: 600;
          color: #c9a96e;
          text-align: right;
        }

        .cancel-order-btn {
          width: 100%;
          padding: 1rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .cancel-order-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px #ef4444;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 40px;
        }

        .empty-icon {
          font-size: 5rem;
          color: #c9a96e40;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #666;
          margin-bottom: 2rem;
        }

        .shop-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2.5rem;
          background: #c9a96e;
          color: white;
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .shop-btn:hover {
          background: #b08e5e;
          transform: translateY(-3px);
          box-shadow: 0 20px 30px -10px #c9a96e80;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .stat-large {
            grid-column: auto;
          }
          
          .orders-grid {
            grid-template-columns: 1fr;
          }
          
          .info-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="my-orders-page">
        {/* Header Section */}
        <div className="orders-header">
          <div className="header-content">
            <motion.h1 
              className="header-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              My <span>Orders</span>
            </motion.h1>
            <motion.p 
              className="header-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Track and manage all your purchases
            </motion.p>
          </div>
        </div>

        {/* Stats Cards - Floating above */}
        <div className="stats-container">
          <motion.div 
            className="stats-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="stat-card">
              <div className="stat-icon">
                <FaShoppingBag />
              </div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-info">
                <h3>{stats.pending + stats.active}</h3>
                <p>Active Orders</p>
              </div>
            </div>

            <div className="stat-card stat-large">
              <div className="stat-icon">
                <FaRupeeSign />
              </div>
              <div className="stat-info">
                <h3>₹{stats.totalSpent.toLocaleString()}</h3>
                <p>Total Spent</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="orders-content">
          {orders.length > 0 ? (
            <>
              {/* Search Bar */}
              <motion.div 
                className="search-bar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by order ID or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  className="filter-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter /> Filter
                </button>
              </motion.div>

              {/* Filter Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    className="filter-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="filter-options">
                      <div className="filter-option">
                        <label>Sort by:</label>
                        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="highest">Highest Amount</option>
                          <option value="lowest">Lowest Amount</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Orders Grid */}
              <motion.div 
                className="orders-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, staggerChildren: 0.1 }}
              >
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    className="order-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover="hover"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="order-card-header">
                      <span className="order-id-badge">#{order.orderId}</span>
                      <span className="order-date">
                        <FaCalendarAlt /> {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="order-card-body">
                      {/* Product Previews */}
                      <div className="product-preview">
                        {order.products?.slice(0, 3).map((product, idx) => (
                          <img
                            key={idx}
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="preview-image"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        ))}
                        {order.products?.length > 3 && (
                          <div className="preview-more">
                            +{order.products.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Order Details */}
                      <div className="order-details">
                        <div className="order-amount">
                          <FaRupeeSign /> {order.totalAmount?.toLocaleString()}
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    <div className="order-card-footer">
                      <span className="view-details">
                        View Details <FaArrowRight />
                      </span>
                      <span>{order.products?.length} items</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            /* Empty State */
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FaBoxOpen className="empty-icon" />
              <h3>No Orders Yet</h3>
              <p>Looks like you haven't placed any orders. Start shopping to see your orders here!</p>
              <Link to="/" className="shop-btn">
                <FaHome /> Continue Shopping <FaArrowRight />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Order <span>#{selectedOrder.orderId}</span></h2>
                  <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
                </div>

                <div className="modal-body">
                  {/* Status */}
                  <div className="detail-section">
                    <div className="section-title">
                      <FaClock /> Order Status
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="detail-section">
                    <div className="section-title">
                      <FaUser /> Customer Details
                    </div>
                    <div className="info-cards">
                      <div className="info-card">
                        <FaUser />
                        <div className="info-card-content">
                          <h4>Name</h4>
                          <p>{selectedOrder.customerInfo?.name || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="info-card">
                        <FaEnvelope />
                        <div className="info-card-content">
                          <h4>Email</h4>
                          <p>{selectedOrder.customerInfo?.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="info-card">
                        <FaPhone />
                        <div className="info-card-content">
                          <h4>Phone</h4>
                          <p>{selectedOrder.customerInfo?.phone || 'N/A'}</p>
                        </div>
                      </div>
                      {selectedOrder.customerInfo?.address && (
                        <div className="info-card">
                          <FaMapMarkerAlt />
                          <div className="info-card-content">
                            <h4>Address</h4>
                            <p>{selectedOrder.customerInfo.address.fullAddress || 
                               `${selectedOrder.customerInfo.address.street || ''}, ${selectedOrder.customerInfo.address.city || ''}`}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="detail-section">
                    <div className="section-title">
                      <FaBox /> Ordered Items
                    </div>
                    <div className="products-list">
                      {selectedOrder.products?.map((product, idx) => (
                        <div key={idx} className="product-item">
                          <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                          <div className="product-details">
                            <h4>{product.name}</h4>
                            <div className="product-meta">
                              <span><FaRupeeSign /> {product.price}</span>
                              <span><FaTag /> Qty: {product.quantity}</span>
                              {product.category && (
                                <span><FaIndustry /> {product.category}</span>
                              )}
                            </div>
                          </div>
                          <div className="product-details" style={{ textAlign: 'right' }}>
                            <h4>₹{product.price * product.quantity}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="detail-section">
                    <div className="total-amount">
                      Total: ₹{selectedOrder.totalAmount?.toLocaleString()}
                    </div>
                  </div>

                  {/* Cancel Button */}
                  {selectedOrder.status === 'pending' && (
                    <button
                      className="cancel-order-btn"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          try {
                            const token = localStorage.getItem('token');
                            const response = await fetch(`api.newpremglasshouse.in/api/orders/my-orders/${selectedOrder._id}/cancel`, {
                              method: 'PUT',
                              headers: {
                                'Authorization': `Bearer ${token}`
                              }
                            });

                            if (response.ok) {
                              toast.success('Order cancelled successfully');
                              fetchOrders();
                              setSelectedOrder(null);
                            } else {
                              toast.error('Failed to cancel order');
                            }
                          } catch (error) {
                            toast.error('Error cancelling order');
                          }
                        }
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MyOrders;