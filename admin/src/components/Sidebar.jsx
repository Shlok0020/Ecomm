import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaList, 
  FaShoppingCart, 
  FaUsers, 
  FaCog,
  FaSignOutAlt,
  FaTag
} from 'react-icons/fa';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox />, label: 'Products' },
    { path: '/categories', icon: <FaTag />, label: 'Categories' },
    { path: '/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { path: '/customers', icon: <FaUsers />, label: 'Customers' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-main">NP</span>
          {!collapsed && <span className="logo-sub">Admin</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: ${collapsed ? '80px' : '260px'};
          height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          color: white;
          position: fixed;
          left: 0;
          top: 0;
          transition: width 0.3s ease;
          display: flex;
          flex-direction: column;
          z-index: 100;
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
          gap: 0.5rem;
        }

        .logo-main {
          font-size: 2rem;
          font-weight: bold;
          color: #c9a96e;
        }

        .logo-sub {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.7);
        }

        .collapse-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .collapse-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
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
          margin: 0.2rem 0.5rem;
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
          color: #111;
        }

        .nav-icon {
          font-size: 1.2rem;
          min-width: 24px;
          text-align: center;
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

        @media (max-width: 768px) {
          .sidebar {
            width: ${collapsed ? '0' : '260px'};
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;