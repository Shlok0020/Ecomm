// src/pages/Cart.jsx - COMPLETE FIXED VERSION with user details and order tracking
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaShoppingBag, 
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
  FaCity,
  FaMailBulk
} from 'react-icons/fa';
import toast from 'react-hot-toast';




// ============= HELPER FUNCTION FOR IMAGE URL =============
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `api.newpremglasshouse.in${imagePath}`;
  return `api.newpremglasshouse.in/uploads/${imagePath}`;
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // User details state
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: 'Jharsuguda',
      state: 'Odisha',
      pincode: '',
      landmark: ''
    }
  });

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart:', error);
        localStorage.removeItem('cart');
      }
    }

    // Check login status and load user details
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Pre-fill user details
      setUserDetails(prev => ({
        ...prev,
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || ''
      }));
    }
  }, []);

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Item removed from cart');
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setUserDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setUserDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    if (!userDetails.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!userDetails.phone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (userDetails.phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!userDetails.address.street.trim()) {
      toast.error('Please enter your address');
      return false;
    }
    if (!userDetails.address.pincode.trim()) {
      toast.error('Please enter pincode');
      return false;
    }
    return true;
  };

  // Place order
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate form
    if (!validateForm()) {
      setShowAddressForm(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: calculateTotal(),
        customerInfo: {
          name: userDetails.name,
          email: userDetails.email || (user?.email) || 'guest@example.com',
          phone: userDetails.phone
        },
        address: {
          street: userDetails.address.street,
          city: userDetails.address.city,
          state: userDetails.address.state,
          pincode: userDetails.address.pincode,
          landmark: userDetails.address.landmark
        },
        paymentMethod: 'cash'
      };

      console.log('📦 Sending order:', orderData);

      // Headers
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Send to backend
      const response = await fetch('api.newpremglasshouse.in/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('✅ Order response:', data);

      if (response.ok) {
        toast.success(data.message || 'Order placed successfully!');
        
        // Clear cart
        localStorage.removeItem('cart');
        setCartItems([]);
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Navigate based on login status
        if (token) {
          // If logged in, go to my orders page
          setTimeout(() => {
            navigate('/my-orders');
          }, 1500);
        } else {
          // If guest, go to order confirmation
          setTimeout(() => {
            navigate('/order-confirmation', { 
              state: { 
                orderId: data.data?.orderId,
                message: 'Create an account to track your orders and get faster checkout!'
              }
            });
          }, 1500);
        }
      } else {
        throw new Error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('❌ Error placing order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <motion.div 
        className="empty-cart"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaShoppingBag size={80} color="#c9a96e" />
        <h2>Your cart is empty</h2>
        <p>Add items to cart to place an order</p>
        <button onClick={() => navigate('/')} className="shop-btn">
          Continue Shopping
        </button>

        <style jsx>{`
          .empty-cart {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 1.5rem;
            text-align: center;
            padding: 2rem;
          }
          .shop-btn {
            padding: 0.75rem 2rem;
            background: #c9a96e;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
            transition: all 0.3s ease;
          }
          .shop-btn:hover {
            background: #b08e5e;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(201, 169, 110, 0.3);
          }
        `}</style>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="cart-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft /> Back
        </button>
        <h1>Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h1>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <motion.div 
              key={item.id}
              className="cart-item"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}
            >
              <div className="item-image">
                <img 
                  src={item.image || '/images/placeholder.jpg'} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">₹{item.price.toLocaleString()}</p>
                {item.brand && (
                  <span className="item-brand">{item.brand}</span>
                )}
              </div>

              <div className="item-quantity">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <FaPlus />
                </button>
              </div>

              <div className="item-total">
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>

              <button 
                className="remove-btn"
                onClick={() => removeItem(item.id)}
                title="Remove item"
              >
                <FaTrash />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{calculateTotal().toLocaleString()}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div className="summary-row">
            <span>Tax (GST)</span>
            <span>Included</span>
          </div>
          
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{calculateTotal().toLocaleString()}</span>
          </div>

          {/* Delivery Details Section */}
          <div className="delivery-details">
            <h3 onClick={() => setShowAddressForm(!showAddressForm)} style={{ cursor: 'pointer' }}>
              📦 Delivery Details {showAddressForm ? '−' : '+'}
            </h3>
            
            {showAddressForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="address-form"
              >
                <div className="form-group">
                  <label>
                    <FaUser /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userDetails.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaEnvelope /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email (for confirmation)"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaPhone /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaHome /> Street Address *
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={userDetails.address.street}
                    onChange={handleInputChange}
                    placeholder="House no., street, area"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaMapMarkerAlt /> Landmark
                  </label>
                  <input
                    type="text"
                    name="address.landmark"
                    value={userDetails.address.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby landmark (optional)"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaCity /> City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={userDetails.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaMailBulk /> Pincode *
                    </label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={userDetails.address.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={userDetails.address.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <button 
            className="checkout-btn"
            onClick={placeOrder}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">Placing Order...</span>
            ) : (
              'Place Order'
            )}
          </button>

          <p className="secure-checkout">
            <span>🔒</span> Secure Checkout
          </p>
          
          {!isLoggedIn && (
            <div className="guest-message">
              <p>⚠️ You're checking out as guest</p>
              <a href="/login" className="login-link">Login to track your orders</a>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .cart-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 60vh;
        }

        .cart-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: #f8f5f0;
          border-color: #c9a96e;
        }

        .cart-header h1 {
          font-family: 'Cormorant Garamond', serif;
          color: #333;
        }

        .cart-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .cart-items {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        .cart-item {
          display: grid;
          grid-template-columns: auto 2fr auto auto auto;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .item-image img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }

        .item-details h3 {
          margin-bottom: 0.3rem;
          font-size: 1rem;
        }

        .item-brand {
          font-size: 0.8rem;
          color: #999;
        }

        .item-price {
          color: #c9a96e;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .item-quantity {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .item-quantity button {
          width: 30px;
          height: 30px;
          border: 1px solid #e0e0e0;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .item-quantity button:hover:not(:disabled) {
          background: #c9a96e;
          color: white;
          border-color: #c9a96e;
        }

        .item-quantity button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .item-quantity span {
          min-width: 30px;
          text-align: center;
          font-weight: 600;
        }

        .item-total {
          font-weight: 600;
          color: #111;
          font-size: 1.1rem;
        }

        .remove-btn {
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          color: #dc2626;
          transform: scale(1.1);
        }

        .cart-summary {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          height: fit-content;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          position: sticky;
          top: 100px;
        }

        .cart-summary h2 {
          margin-bottom: 1.5rem;
          font-family: 'Cormorant Garamond', serif;
          color: #333;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
          color: #666;
        }

        .summary-row.total {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          border-bottom: none;
          margin-top: 1rem;
        }

        .delivery-details {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #f0f0f0;
        }

        .delivery-details h3 {
          font-family: 'Cormorant Garamond', serif;
          color: #c9a96e;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .address-form {
          overflow: hidden;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        .form-group label svg {
          color: #c9a96e;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .checkout-btn {
          width: 100%;
          padding: 1rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: all 0.3s ease;
        }

        .checkout-btn:hover:not(:disabled) {
          background: #b08e5e;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(201, 169, 110, 0.3);
        }

        .checkout-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: inline-block;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .secure-checkout {
          text-align: center;
          margin-top: 1rem;
          color: #666;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
        }

        .guest-message {
          margin-top: 1rem;
          padding: 1rem;
          background: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 8px;
          text-align: center;
        }

        .guest-message p {
          color: #856404;
          margin-bottom: 0.5rem;
        }

        .login-link {
          color: #c9a96e;
          text-decoration: none;
          font-weight: 600;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .cart-container {
            grid-template-columns: 1fr;
          }
          
          .cart-item {
            grid-template-columns: auto 1fr auto;
            grid-template-rows: auto auto;
            gap: 1rem;
          }
          
          .item-details {
            grid-column: 2;
          }
          
          .item-quantity {
            grid-column: 1;
            grid-row: 2;
          }
          
          .item-total {
            grid-column: 2;
            grid-row: 2;
            text-align: right;
          }
          
          .remove-btn {
            grid-column: 3;
            grid-row: 2;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Cart;