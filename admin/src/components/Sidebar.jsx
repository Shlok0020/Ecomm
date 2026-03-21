// admin/src/components/Sidebar.jsx - COMPLETE FIXED CODE
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaTag, 
  FaShoppingCart, 
  FaUsers, 
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaTimes
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setActiveItem(path || 'dashboard');
  }, [location]);

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { id: 'products', path: '/products', icon: <FaBox />, label: 'Products' },
    { id: 'categories', path: '/categories', icon: <FaTag />, label: 'Categories' },
    { id: 'orders', path: '/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { id: 'users', path: '/users', icon: <FaUsers />, label: 'Users' },
    { id: 'settings', path: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast.success('Logged out successfully');
    window.location.href = 'https://newpremglasshouse.in';
  };

  // Animation variants
  const sidebarVariants = {
    desktop: { width: '260px' },
    mobileOpen: { 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    mobileClosed: { 
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            className="sidebar-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.div 
        className={`sidebar ${isMobile ? 'mobile' : ''}`}
        animate={isMobile ? (isOpen ? 'mobileOpen' : 'mobileClosed') : 'desktop'}
        variants={sidebarVariants}
        initial={isMobile ? 'mobileClosed' : 'desktop'}
      >
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-main">NP</span>
            <div className="logo-text">
              <span>Glass House</span>
              <small>Admin Panel</small>
            </div>
          </div>
          {isMobile && (
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          )}
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            <FaUserCircle />
          </div>
          <div className="admin-info">
            <div className="admin-name">Admin</div>
            <div className="admin-role">Super Admin</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={isMobile ? onClose : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            <span>Logout</span>
          </button>
          <div className="version-info">v1.0.0</div>
        </div>
      </motion.div>

      <style>{`
        .sidebar {
          height: 100vh;
          background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
          color: white;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          box-shadow: 4px 0 20px rgba(0,0,0,0.1);
          overflow-y: auto;
        }

        /* Desktop styles */
        @media (min-width: 769px) {
          .sidebar {
            width: 260px;
          }
        }

        /* Mobile styles */
        .sidebar.mobile {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 280px;
          z-index: 1001;
          box-shadow: 2px 0 20px rgba(0,0,0,0.4);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 1000;
          backdrop-filter: blur(3px);
        }

        .sidebar-header {
          padding: 1.5rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .logo-main {
          font-size: 2rem;
          font-weight: bold;
          color: #c9a96e;
          font-family: 'DM Serif Display', serif;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-text span {
          font-size: 1rem;
          font-weight: 500;
          color: white;
          font-family: 'Cormorant Garamond', serif;
        }

        .logo-text small {
          font-size: 0.7rem;
          color: #c9a96e;
          opacity: 0.8;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #c9a96e;
          color: #1a1a1a;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .admin-avatar {
          font-size: 2.5rem;
          color: #c9a96e;
        }

        .admin-info {
          display: flex;
          flex-direction: column;
        }

        .admin-name {
          font-weight: 600;
          color: white;
        }

        .admin-role {
          font-size: 0.8rem;
          color: #c9a96e;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1rem;
          margin: 0.2rem 0.8rem;
          border-radius: 8px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .nav-item.active {
          background: #c9a96e;
          color: #1a1a1a;
        }

        .nav-icon {
          font-size: 1.2rem;
          min-width: 24px;
          text-align: center;
        }

        .nav-label {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1rem;
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .logout-btn:hover {
          background: rgba(220, 53, 69, 0.2);
          color: #dc3545;
        }

        .logout-icon {
          font-size: 1.2rem;
          min-width: 24px;
          text-align: center;
        }

        .version-info {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.3);
        }

        /* Custom scrollbar */
        .sidebar::-webkit-scrollbar {
          width: 5px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 5px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #c9a96e;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .sidebar.mobile .sidebar-header {
            padding: 1rem;
          }

          .sidebar.mobile .admin-profile {
            padding: 1rem;
          }

          .sidebar.mobile .nav-item {
            margin: 0.2rem 0.5rem;
            padding: 0.7rem 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;