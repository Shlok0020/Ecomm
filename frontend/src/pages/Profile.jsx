// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaShoppingBag,
  FaArrowRight,
  FaCrown,
  FaStore,
  FaCalendarAlt,
  FaRupeeSign,
  FaCheckCircle,
  FaStar,
  FaGem,
  FaHeart,
  FaBoxOpen,
  FaTruck,
  FaShieldAlt,
  FaClock,
  FaAward
} from 'react-icons/fa';
import { HiOutlineSparkles, HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import userService from '../services/userService';

// ============= ANIMATION VARIANTS =============
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.4 }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: (custom) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15,
      delay: custom * 0.1 
    }
  }),
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 40px -15px rgba(201,169,110,0.4)",
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
};

const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    x: 50,
    transition: { duration: 0.3 }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    y: -3,
    boxShadow: "0 10px 25px rgba(201,169,110,0.3)",
    transition: { type: "spring", stiffness: 500, damping: 30 }
  },
  tap: { scale: 0.95, y: 0 }
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  // Mouse move effect for parallax
  useEffect(() => {
    let rafId = null;
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 10,
          y: (e.clientY / window.innerHeight - 0.5) * 10
        });
        rafId = null;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || {
          street: '',
          city: '',
          state: '',
          pincode: ''
        }
      });
      
      // Hide footer when profile page loads
      const hideFooterEvent = new CustomEvent('hideFooter', { detail: true });
      window.dispatchEvent(hideFooterEvent);
      
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
    
    // Show footer when leaving profile page
    return () => {
      const showFooterEvent = new CustomEvent('hideFooter', { detail: false });
      window.dispatchEvent(showFooterEvent);
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      const response = await userService.update(user._id || user.id, formData);
      
      if (response.success) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success('Profile updated successfully');
        setEditing(false);
        
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || {
        street: '',
        city: '',
        state: '',
        pincode: ''
      }
    });
    setEditing(false);
  };

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'N/A';

  if (loading) {
    return (
      <motion.div 
        className="profile-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        className="profile-page"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Decorative Background Elements */}
        <div className="profile-bg">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
        </div>

        <div className="profile-container">
          {/* Header Section */}
          <motion.div 
            className="profile-header"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="profile-avatar-wrapper"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="profile-avatar">
                {user?.name?.charAt(0) || <FaUser />}
              </div>
              <motion.div 
                className="avatar-glow"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              {user?.isPremium && (
                <motion.div 
                  className="premium-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
                >
                  <FaCrown />
                </motion.div>
              )}
            </motion.div>

            <motion.h1 variants={itemVariants}>
              Welcome back, <em>{user?.name?.split(' ')[0] || 'User'}</em>
            </motion.h1>

            <motion.p className="profile-subtitle" variants={itemVariants}>
              <HiOutlineSparkles /> Manage your personal information and preferences
            </motion.p>

            {!editing && (
              <motion.button 
                className="edit-profile-btn"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setEditing(true)}
              >
                <FaEdit /> Edit Profile
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FaArrowRight />
                </motion.div>
              </motion.button>
            )}
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.form
                key="edit-form"
                className="profile-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
              >
                <div className="form-card">
                  <div className="form-card-header">
                    <FaUser />
                    <h2>Personal Information</h2>
                  </div>

                  <div className="form-group">
                    <label><FaUser /> Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FaEnvelope /> Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      disabled
                      className="disabled"
                    />
                    <small className="field-note">Email cannot be changed</small>
                  </div>

                  <div className="form-group">
                    <label><FaPhone /> Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="form-card-header" style={{ marginTop: '2rem' }}>
                    <FaMapMarkerAlt />
                    <h2>Address Details</h2>
                  </div>

                  <div className="form-group">
                    <label><FaMapMarkerAlt /> Street Address</label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="House no., Building, Street"
                      required
                    />
                  </div>

                  <div className="address-row">
                    <div className="form-group">
                      <input
                        type="text"
                        name="address.city"
                        placeholder="City"
                        value={formData.address.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="address.state"
                        placeholder="State"
                        value={formData.address.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="address.pincode"
                        placeholder="Pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <motion.button 
                      type="submit" 
                      className="save-btn"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="btn-spinner" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Save Changes
                        </>
                      )}
                    </motion.button>
                    <motion.button 
                      type="button" 
                      className="cancel-btn"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleCancel}
                    >
                      <FaTimes /> Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                className="profile-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Profile Cards Grid - Only 3 cards now (membership card removed) */}
                <div className="profile-grid">
                  {/* Personal Info Card */}
                  <motion.div 
                    className="profile-card personal-card"
                    variants={cardVariants}
                    custom={1}
                    whileHover="hover"
                    onHoverStart={() => setHoveredCard('personal')}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    <div className="card-icon">
                      <FaUser />
                    </div>
                    <h3>Personal Details</h3>
                    <div className="card-content">
                      <div className="info-item">
                        <span className="label">Name</span>
                        <span className="value">{user?.name || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Email</span>
                        <span className="value">{user?.email || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Phone</span>
                        <span className="value">{user?.phone || 'Not provided'}</span>
                      </div>
                    </div>
                    <motion.div 
                      className="card-shine"
                      animate={hoveredCard === 'personal' ? { x: '200%' } : { x: '-100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.div>

                  {/* Address Card */}
                  <motion.div 
                    className="profile-card address-card"
                    variants={cardVariants}
                    custom={2}
                    whileHover="hover"
                    onHoverStart={() => setHoveredCard('address')}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    <div className="card-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <h3>Address</h3>
                    <div className="card-content">
                      {user?.address?.street || user?.address?.city ? (
                        <>
                          <div className="info-item">
                            <span className="label">Street</span>
                            <span className="value">{user.address.street || '—'}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">City</span>
                            <span className="value">{user.address.city || '—'}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">State</span>
                            <span className="value">{user.address.state || '—'}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Pincode</span>
                            <span className="value">{user.address.pincode || '—'}</span>
                          </div>
                        </>
                      ) : (
                        <p className="no-data">No address provided</p>
                      )}
                    </div>
                    <motion.div 
                      className="card-shine"
                      animate={hoveredCard === 'address' ? { x: '200%' } : { x: '-100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.div>

                  {/* Stats Card */}
                  <motion.div 
                    className="profile-card stats-card"
                    variants={cardVariants}
                    custom={3}
                    whileHover="hover"
                    onHoverStart={() => setHoveredCard('stats')}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    <div className="card-icon">
                      <FaAward />
                    </div>
                    <h3>Account Stats</h3>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <FaCalendarAlt className="stat-icon" />
                        <div>
                          <span className="stat-label">Member Since</span>
                          <span className="stat-value">{memberSince}</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <FaShoppingBag className="stat-icon" />
                        <div>
                          <span className="stat-label">Total Orders</span>
                          <span className="stat-value">{user?.orderCount || 0}</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <FaRupeeSign className="stat-icon" />
                        <div>
                          <span className="stat-label">Total Spent</span>
                          <span className="stat-value">₹{user?.totalSpent || 0}</span>
                        </div>
                      </div>
                    </div>
                    <motion.div 
                      className="card-shine"
                      animate={hoveredCard === 'stats' ? { x: '200%' } : { x: '-100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.div>
                </div>

                {/* Quick Actions - Only Orders button (Wishlist button removed) */}
                <motion.div 
                  className="quick-actions"
                  variants={itemVariants}
                >
                  <motion.button 
                    className="action-btn orders-btn"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/my-orders')}
                  >
                    <FaShoppingBag />
                    <span>View My Orders</span>
                    <FaArrowRight className="arrow-icon" />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <style jsx>{`
          .profile-page {
            position: relative;
            min-height: 100vh;
            background: linear-gradient(135deg, #f8f5f0 0%, #f2ede4 100%);
            padding: 4rem 0 6rem;
            overflow: hidden;
          }

          .profile-bg {
            position: absolute;
            inset: 0;
            z-index: 0;
          }

          .bg-shape {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.1;
          }

          .shape-1 {
            top: -200px;
            right: -100px;
            width: 500px;
            height: 500px;
            background: #c9a96e;
            animation: float 20s ease-in-out infinite;
          }

          .shape-2 {
            bottom: -200px;
            left: -100px;
            width: 600px;
            height: 600px;
            background: #bd7b4d;
            animation: float 25s ease-in-out infinite reverse;
          }

          .shape-3 {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            height: 800px;
            background: #8b5a2b;
            opacity: 0.05;
            animation: pulse 15s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(50px, 50px); }
          }

          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.2); }
          }

          .profile-container {
            position: relative;
            z-index: 2;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }

          .profile-header {
            text-align: center;
            margin-bottom: 4rem;
          }

          .profile-avatar-wrapper {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 1.5rem;
          }

          .profile-avatar {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #c9a96e, #a07840);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3.5rem;
            font-weight: 600;
            box-shadow: 0 20px 40px rgba(201, 169, 110, 0.3);
            border: 4px solid white;
            position: relative;
            z-index: 2;
          }

          .avatar-glow {
            position: absolute;
            inset: -10px;
            border-radius: 50%;
            background: radial-gradient(circle, #c9a96e80, transparent);
            z-index: 1;
          }

          .premium-badge {
            position: absolute;
            bottom: 5px;
            right: 5px;
            width: 35px;
            height: 35px;
            background: #ffd700;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1a1a1a;
            font-size: 1.2rem;
            border: 3px solid white;
            z-index: 3;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }

          .profile-header h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            color: #1a1a1a;
            margin-bottom: 0.5rem;
          }

          .profile-header h1 em {
            color: #c9a96e;
            font-style: italic;
          }

          .profile-subtitle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }

          .profile-subtitle svg {
            color: #c9a96e;
          }

          .edit-profile-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.8rem;
            padding: 1rem 2.5rem;
            background: #c9a96e;
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            box-shadow: 0 10px 20px rgba(201, 169, 110, 0.2);
          }

          .profile-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-bottom: 2rem;
          }

          @media (max-width: 992px) {
            .profile-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 768px) {
            .profile-grid {
              grid-template-columns: 1fr;
            }
          }

          .profile-card {
            background: white;
            border-radius: 30px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          }

          .card-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #f8f5f0, #f2ede4);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #c9a96e;
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
          }

          .profile-card h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.5rem;
            color: #1a1a1a;
            margin-bottom: 1.5rem;
          }

          .card-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .info-item {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
            padding-bottom: 0.8rem;
            border-bottom: 1px solid #f0f0f0;
          }

          .info-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .label {
            font-size: 0.8rem;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .value {
            font-size: 1rem;
            color: #333;
            font-weight: 500;
          }

          .stats-grid {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
          }

          .stat-item {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .stat-icon {
            font-size: 1.5rem;
            color: #c9a96e;
            opacity: 0.7;
          }

          .stat-label {
            display: block;
            font-size: 0.8rem;
            color: #999;
          }

          .stat-value {
            display: block;
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
          }

          .card-shine {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transform: skewX(-15deg);
            pointer-events: none;
          }

          .quick-actions {
            display: flex;
            justify-content: center;
            margin-top: 2rem;
          }

          .action-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.5rem 3rem;
            border: none;
            border-radius: 20px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 300px;
          }

          @media (max-width: 576px) {
            .action-btn {
              min-width: 100%;
              padding: 1.2rem 2rem;
            }
          }

          .orders-btn {
            background: linear-gradient(135deg, #c9a96e, #a07840);
            color: white;
          }

          .action-btn .arrow-icon {
            transition: transform 0.3s ease;
          }

          .action-btn:hover .arrow-icon {
            transform: translateX(5px);
          }

          .profile-form {
            max-width: 800px;
            margin: 0 auto;
          }

          .form-card {
            background: white;
            border-radius: 30px;
            padding: 3rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }

          .form-card-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .form-card-header svg {
            font-size: 1.8rem;
            color: #c9a96e;
          }

          .form-card-header h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            color: #1a1a1a;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #555;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }

          .form-group label svg {
            color: #c9a96e;
          }

          .form-group input {
            width: 100%;
            padding: 1rem 1.2rem;
            border: 2px solid #f0f0f0;
            border-radius: 15px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: #fafafa;
          }

          .form-group input:focus {
            outline: none;
            border-color: #c9a96e;
            background: white;
            box-shadow: 0 0 0 4px rgba(201, 169, 110, 0.1);
          }

          .form-group input.disabled {
            background: #f5f5f5;
            color: #999;
            cursor: not-allowed;
          }

          .field-note {
            display: block;
            font-size: 0.8rem;
            color: #999;
            margin-top: 0.3rem;
          }

          .address-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }

          @media (max-width: 768px) {
            .address-row {
              grid-template-columns: 1fr;
            }
          }

          .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
          }

          @media (max-width: 576px) {
            .form-actions {
              flex-direction: column;
            }
          }

          .save-btn, .cancel-btn {
            flex: 1;
            padding: 1rem 2rem;
            border: none;
            border-radius: 15px;
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
            cursor: pointer;
          }

          .save-btn {
            background: #28a745;
            color: white;
          }

          .cancel-btn {
            background: #dc3545;
            color: white;
          }

          .btn-spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .profile-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f8f5f0 0%, #f2ede4 100%);
          }

          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(201, 169, 110, 0.2);
            border-top: 4px solid #c9a96e;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }

          .no-data {
            color: #999;
            font-style: italic;
          }
        `}</style>
      </motion.div>
    </>
  );
};

export default Profile;