// src/pages/Order.jsx - ORDER PLACEMENT PAGE
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaShoppingBag, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaUser, 
  FaCheckCircle, 
  FaArrowLeft,
  FaRupeeSign,
  FaMinus,
  FaPlus,
  FaTruck,
  FaShieldAlt,
  FaClock
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    // Get product from location state
    if (location.state?.product) {
      setProduct(location.state.product);
    } else {
      toast.error('No product selected');
      navigate('/');
    }

    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Pre-fill address if available
        if (parsedUser.address) {
          setAddress(parsedUser.address);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      toast.error('Please login first');
      navigate('/login', { state: { product: location.state?.product } });
    }
  }, [location.state, navigate]);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const price = product?.price || 0;
    return price * quantity;
  };

  const handleSubmitOrder = async () => {
    // Validate address
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in complete address');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        userId: user.id,
        products: [{
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          category: product.category || 'general',
          image: product.image
        }],
        totalAmount: calculateTotal(),
        address: {
          fullAddress: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        },
        paymentMethod: 'Cash on Delivery',
        status: 'pending'
      };

      // Call API to create order
      const response = await orderService.createOrder(orderData);
      
      console.log('Order placed:', response);
      
      // Update user's order count in localStorage (optional)
      if (user) {
        const updatedUser = {
          ...user,
          orderCount: (user.orderCount || 0) + 1,
          totalSpent: (user.totalSpent || 0) + calculateTotal()
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Show success
      setOrderDetails(response.order || orderData);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      
      // Trigger order update event for real-time updates
      window.dispatchEvent(new CustomEvent('orderUpdated', { 
        detail: { orderId: response.order?.id || Date.now() } 
      }));
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <motion.div 
        className="order-success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-card">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <FaCheckCircle className="success-icon" />
          </motion.div>
          
          <h1>Order Placed Successfully!</h1>
          <p className="success-message">
            Thank you for your order. You will receive a confirmation on your WhatsApp and Email shortly.
          </p>
          
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <p><strong>Order ID:</strong> #{orderDetails?.id?.slice(-8) || 'N/A'}</p>
            <p><strong>Product:</strong> {product?.name}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
            <p><strong>Total Amount:</strong> ₹{calculateTotal()}</p>
            <p><strong>Payment Method:</strong> Cash on Delivery</p>
            <p><strong>Delivery Address:</strong> {address.street}, {address.city}, {address.state} - {address.pincode}</p>
          </div>
          
          <div className="success-actions">
            <button onClick={() => navigate('/my-orders')} className="btn-primary">
              View My Orders
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Continue Shopping
            </button>
          </div>
        </div>

        <style jsx>{`
          .order-success {
            min-height: calc(100vh - 200px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: linear-gradient(135deg, #f8f5f0 0%, #f2ede4 100%);
          }

          .success-card {
            background: white;
            border-radius: 40px;
            padding: 3rem;
            text-align: center;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }

          .success-icon {
            font-size: 5rem;
            color: #28a745;
            margin-bottom: 1.5rem;
          }

          .success-card h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 1rem;
          }

          .success-message {
            color: #666;
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .order-summary-card {
            background: #f8f9fa;
            border-radius: 20px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
          }

          .order-summary-card h3 {
            color: #c9a96e;
            margin-bottom: 1rem;
            font-size: 1.2rem;
          }

          .order-summary-card p {
            margin-bottom: 0.5rem;
            color: #555;
          }

          .success-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }

          .btn-primary, .btn-secondary {
            padding: 1rem 2rem;
            border: none;
            border-radius: 40px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-primary {
            background: #c9a96e;
            color: white;
          }

          .btn-primary:hover {
            background: #b08e5e;
            transform: translateY(-2px);
          }

          .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 1px solid #e0e0e0;
          }

          .btn-secondary:hover {
            background: #e9ecef;
            transform: translateY(-2px);
          }

          @media (max-width: 480px) {
            .success-card {
              padding: 2rem;
            }

            .success-card h1 {
              font-size: 2rem;
            }

            .success-actions {
              flex-direction: column;
            }
          }
        `}</style>
      </motion.div>
    );
  }

  if (!product || !user) return null;

  return (
    <motion.div 
      className="order-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="order-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="order-grid">
          {/* Left Column - Product Details */}
          <motion.div 
            className="order-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Order Summary</h2>
            
            <div className="product-card">
              <img 
                src={product.image || 'https://via.placeholder.com/300'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300';
                }}
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category || 'Product'}</p>
                <p className="product-description">{product.description || 'Premium quality product'}</p>
                
                <div className="product-price">
                  <span className="price-label">Price:</span>
                  <span className="price-value">₹{product.price || 0}</span>
                </div>
                
                <div className="quantity-selector">
                  <span className="quantity-label">Quantity:</span>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      className="quantity-btn"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="price-breakdown">
              <h3>Price Details</h3>
              <div className="price-row">
                <span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span>
                <span>₹{product.price * quantity}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charges</span>
                <span className="free-delivery">FREE</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>

            <div className="delivery-info">
              <div className="info-item">
                <FaTruck />
                <span>Free Delivery</span>
              </div>
              <div className="info-item">
                <FaShieldAlt />
                <span>Secure Payment</span>
              </div>
              <div className="info-item">
                <FaClock />
                <span>COD Available</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Delivery Details */}
          <motion.div 
            className="order-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Delivery Details</h2>
            
            <div className="user-info-card">
              <h3><FaUser /> Personal Information</h3>
              <div className="user-detail">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{user.phone}</span>
              </div>
            </div>

            <div className="address-card">
              <h3><FaMapMarkerAlt /> Delivery Address</h3>
              
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="House no., Building, Street"
                  required
                />
              </div>

              <div className="address-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="Pincode"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="payment-card">
              <h3>Payment Method</h3>
              <div className="payment-option selected">
                <input type="radio" id="cod" name="payment" checked readOnly />
                <label htmlFor="cod">Cash on Delivery (COD)</label>
              </div>
              <p className="payment-note">
                Pay when you receive your order. Our delivery partner will collect the payment.
              </p>
            </div>

            <div className="order-actions">
              <button 
                className="place-order-btn"
                onClick={handleSubmitOrder}
                disabled={loading}
              >
                {loading ? (
                  <>Placing Order...</>
                ) : (
                  <>
                    <FaShoppingBag /> Place Order • ₹{calculateTotal()}
                  </>
                )}
              </button>
              
              <p className="terms-note">
                By placing this order, you agree to our 
                <a href="/terms"> Terms & Conditions</a> and 
                <a href="/privacy"> Privacy Policy</a>.
                You will receive WhatsApp and Email confirmation.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .order-page {
          min-height: calc(100vh - 200px);
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #f8f5f0 0%, #f2ede4 100%);
        }

        .order-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 40px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 2rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          transform: translateX(-5px);
          color: #c9a96e;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .order-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .order-left, .order-right {
          background: white;
          border-radius: 30px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #333;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 0.5rem;
        }

        h3 {
          color: #c9a96e;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .product-card {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .product-card img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 15px;
          box-shadow: 0 5px 10px rgba(0,0,0,0.1);
        }

        .product-info {
          flex: 1;
        }

        .product-info h3 {
          color: #333;
          margin-bottom: 0.3rem;
          font-size: 1.3rem;
        }

        .product-category {
          color: #c9a96e;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .product-description {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .price-label {
          color: #666;
        }

        .price-value {
          font-size: 1.3rem;
          font-weight: bold;
          color: #c9a96e;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .quantity-label {
          color: #666;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quantity-btn {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 2px solid #eee;
          background: white;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #c9a96e;
          color: white;
          border-color: #c9a96e;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-value {
          font-size: 1.2rem;
          font-weight: 600;
          min-width: 40px;
          text-align: center;
        }

        .price-breakdown {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .price-breakdown h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          color: #555;
        }

        .price-row.total {
          font-size: 1.2rem;
          font-weight: bold;
          color: #333;
          border-top: 1px solid #ddd;
          padding-top: 0.8rem;
          margin-top: 0.8rem;
        }

        .free-delivery {
          color: #28a745;
          font-weight: 600;
        }

        .delivery-info {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 15px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #555;
          font-size: 0.9rem;
        }

        .info-item svg {
          color: #c9a96e;
        }

        .user-info-card, .address-card, .payment-card {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .user-detail {
          display: flex;
          margin-bottom: 0.5rem;
        }

        .detail-label {
          width: 80px;
          color: #666;
          font-weight: 500;
        }

        .detail-value {
          color: #333;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          color: #555;
          margin-bottom: 0.3rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.1);
        }

        .address-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: white;
          border-radius: 10px;
          margin-bottom: 1rem;
          border: 2px solid #c9a96e;
        }

        .payment-option input[type="radio"] {
          accent-color: #c9a96e;
          width: 18px;
          height: 18px;
        }

        .payment-option label {
          color: #333;
          font-weight: 500;
        }

        .payment-note {
          font-size: 0.85rem;
          color: #999;
          margin-top: 0.5rem;
        }

        .order-actions {
          margin-top: 2rem;
        }

        .place-order-btn {
          width: 100%;
          background: #28a745;
          color: white;
          border: none;
          padding: 1.2rem;
          border-radius: 15px;
          font-size: 1.2rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .place-order-btn:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3);
        }

        .place-order-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .terms-note {
          font-size: 0.8rem;
          color: #999;
          text-align: center;
        }

        .terms-note a {
          color: #c9a96e;
          text-decoration: none;
          margin: 0 0.2rem;
        }

        .terms-note a:hover {
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .order-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .product-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .product-card img {
            width: 150px;
            height: 150px;
          }

          .address-row {
            grid-template-columns: 1fr;
          }

          .delivery-info {
            flex-direction: column;
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .order-page {
            padding: 2rem 1rem;
          }

          .order-left, .order-right {
            padding: 1.5rem;
          }

          h2 {
            font-size: 1.8rem;
          }

          .price-row.total {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Order;