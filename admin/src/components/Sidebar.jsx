import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaList, 
  FaShoppingCart, 
  FaUsers, 
  FaCog,
  FaSignOutAlt,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    // Set active item based on current path
    const path = location.pathname.split('/')[1];
    setActiveItem(path || 'dashboard');
  }, [location]);

  const menuItems = [
    { id: 'dashboard', path: '/', icon: <FaHome />, label: 'Dashboard' },
    { id: 'products', path: '/products', icon: <FaBox />, label: 'Products' },
    { id: 'categories', path: '/categories', icon: <FaTag />, label: 'Categories' },
    { id: 'orders', path: '/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { id: 'users', path: '/users', icon: <FaUsers />, label: 'Users' },
    { id: 'settings', path: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleLogout = () => {
    // Saare tokens remove karo
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast.success('Logged out successfully');
    
    // 🔴 FRONTEND HOME PAGE PE REDIRECT
    window.location.href = 'http://localhost:5173';
  };

  const sidebarVariants = {
    expanded: { width: '260px' },
    collapsed: { width: '80px' }
  };

  return (
    <motion.div 
      className={`sidebar`}
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      initial="expanded"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-main">NP</span>
          {!collapsed && (
            <div className="logo-text">
              <span>Glass House</span>
              <small>Admin Panel</small>
            </div>
          )}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Admin Profile Summary - Only when expanded */}
      {!collapsed && (
        <div className="admin-profile">
          <div className="admin-avatar">
            <FaUserCircle />
          </div>
          <div className="admin-info">
            <div className="admin-name">Admin</div>
            <div className="admin-role">Super Admin</div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            
            {/* Active indicator */}
            {activeItem === item.id && !collapsed && (
              <motion.div 
                className="active-indicator"
                layoutId="activeIndicator"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : ''}>
          <FaSignOutAlt className="logout-icon" />
          {!collapsed && <span>Logout</span>}
        </button>
        
        {/* Version info - Only when expanded */}
        {!collapsed && (
          <div className="version-info">
            v1.0.0
          </div>
        )}
      </div>

      <style jsx>{`
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
          overflow-x: hidden;
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
          min-width: 45px;
          text-align: center;
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

        .collapse-btn {
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

        .collapse-btn:hover {
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
          position: relative;
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

        .active-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background: white;
          border-radius: 4px 0 0 4px;
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

        @media (max-width: 768px) {
          .sidebar {
            width: ${collapsed ? '0' : '260px'};
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Sidebar;