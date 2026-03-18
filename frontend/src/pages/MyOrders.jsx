// frontend/src/pages/MyOrders.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBox, 
  FaCalendar, 
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
  FaUser
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.data);
        
        // Calculate stats
        const stats = {
          total: data.data.length,
          pending: data.data.filter(o => o.status === 'pending').length,
          delivered: data.data.filter(o => o.status === 'delivered').length,
          cancelled: data.data.filter(o => o.status === 'cancelled').length
        };
        setStats(stats);
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
      pending: { color: '#f59e0b', bg: '#fef3c7', icon: <FaClock />, text: 'Pending' },
      processing: { color: '#3b82f6', bg: '#dbeafe', icon: <FaBox />, text: 'Processing' },
      shipped: { color: '#8b5cf6', bg: '#ede9fe', icon: <FaTruck />, text: 'Shipped' },
      delivered: { color: '#10b981', bg: '#d1fae5', icon: <FaCheckCircle />, text: 'Delivered' },
      cancelled: { color: '#ef4444', bg: '#fee2e2', icon: <FaTimesCircle />, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.3rem 0.8rem',
        background: config.bg,
        color: config.color,
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600'
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

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div className="spinner"></div>
        <style>{`
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="my-orders-page"
    >
      <style>{`
        .my-orders-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
          background: #f8f5f0;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #666;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          text-align: center;
        }

        .stat-card h3 {
          font-size: 2rem;
          color: #c9a96e;
          margin-bottom: 0.3rem;
        }

        .stat-card p {
          color: #666;
          font-size: 0.9rem;
        }

        .orders-list {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .order-item {
          border-bottom: 1px solid #f0f0f0;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .order-item:hover {
          background: #faf8f5;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .order-id {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #c9a96e;
        }

        .order-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        .order-products {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .product-thumb {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: #f8f5f0;
          padding: 0.5rem 1rem;
          border-radius: 30px;
        }

        .product-thumb img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
        }

        .product-thumb span {
          font-size: 0.9rem;
          color: #333;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px dashed #f0f0f0;
        }

        .order-total {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 600;
          color: #333;
        }

        .view-details-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.2rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-details-btn:hover {
          background: #b08e5e;
          transform: translateY(-2px);
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
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
        }

        .modal-header h2 {
          font-family: 'Cormorant Garamond', serif;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .detail-section {
          margin-bottom: 2rem;
        }

        .detail-section h3 {
          font-family: 'Cormorant Garamond', serif;
          color: #c9a96e;
          margin-bottom: 1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: #666;
        }

        .info-item svg {
          color: #c9a96e;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
        }

        .products-table th {
          text-align: left;
          padding: 0.8rem;
          background: #f8f5f0;
          color: #333;
          font-weight: 600;
        }

        .products-table td {
          padding: 0.8rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .product-cell img {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
        }

        .total-row {
          font-weight: 600;
          color: #c9a96e;
        }

        .empty-orders {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-orders svg {
          font-size: 4rem;
          color: #c9a96e;
          opacity: 0.3;
          margin-bottom: 1rem;
        }

        .empty-orders h3 {
          font-family: 'Cormorant Garamond', serif;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .empty-orders p {
          color: #666;
          margin-bottom: 2rem;
        }

        .shop-now-btn {
          padding: 0.8rem 2rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 30px;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .shop-now-btn:hover {
          background: #b08e5e;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .my-orders-page { padding: 1rem; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .order-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
          .order-footer { flex-direction: column; gap: 1rem; }
          .info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.total}</h3>
              <p>Total Orders</p>
            </div>
            <div className="stat-card">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-card">
              <h3>{stats.delivered}</h3>
              <p>Delivered</p>
            </div>
            <div className="stat-card">
              <h3>{stats.cancelled}</h3>
              <p>Cancelled</p>
            </div>
          </div>

          <div className="orders-list">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                className="order-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-header">
                  <span className="order-id">Order #{order.orderId}</span>
                  <div className="order-date">
                    <FaCalendar />
                    <span>{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</span>
                  </div>
                </div>

                <div className="order-products">
                  {order.products.slice(0, 3).map((product, idx) => (
                    <div key={idx} className="product-thumb">
                      <img 
                        src={product.image || '/placeholder.jpg'} 
                        alt={product.name}
                        onError={(e) => e.target.src = '/placeholder.jpg'}
                      />
                      <span>{product.name} x{product.quantity}</span>
                    </div>
                  ))}
                  {order.products.length > 3 && (
                    <div className="product-thumb">
                      <span>+{order.products.length - 3} more</span>
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <FaRupeeSign /> Total: ₹{order.totalAmount}
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                  <button className="view-details-btn">
                    <FaEye /> View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-orders">
          <FaBoxOpen />
          <h3>No orders yet</h3>
          <p>Looks like you haven't placed any orders yet</p>
          <Link to="/" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      )}

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
                <h2>Order Details - {selectedOrder.orderId}</h2>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>Order Status</h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FaUser /> {selectedOrder.customerInfo.name}
                    </div>
                    <div className="info-item">
                      <FaEnvelope /> {selectedOrder.customerInfo.email}
                    </div>
                    <div className="info-item">
                      <FaPhone /> {selectedOrder.customerInfo.phone}
                    </div>
                    {selectedOrder.customerInfo.address && (
                      <div className="info-item">
                        <FaMapMarkerAlt /> 
                        {selectedOrder.customerInfo.address.street}, 
                        {selectedOrder.customerInfo.address.city} - 
                        {selectedOrder.customerInfo.address.pincode}
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Order Items</h3>
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
                      {selectedOrder.products.map((product, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="product-cell">
                              <img 
                                src={product.image || '/placeholder.jpg'} 
                                alt={product.name}
                              />
                              <span>{product.name}</span>
                            </div>
                          </td>
                          <td>₹{product.price}</td>
                          <td>{product.quantity}</td>
                          <td>₹{product.price * product.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="detail-section">
                  <h3>Order Summary</h3>
                  <div style={{ textAlign: 'right' }}>
                    <p><strong>Subtotal:</strong> ₹{selectedOrder.totalAmount}</p>
                    <p><strong>Shipping:</strong> Free</p>
                    <p className="total-row"><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
                  </div>
                </div>

                {selectedOrder.status === 'pending' && (
                  <button
                    className="cancel-btn"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to cancel this order?')) {
                        try {
                          const token = localStorage.getItem('token');
                          const response = await fetch(`http://localhost:5000/api/orders/my-orders/${selectedOrder._id}/cancel`, {
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
                          console.error('Error cancelling order:', error);
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
    </motion.div>
  );
};

export default MyOrders;