// admin/src/components/Navbar.jsx - ADMIN PANEL VERSION (Mobile First)
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaSearch, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Navbar = ({ toggleSidebar, isSidebarOpen, isMobile }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        {/* Left Section - Logo and Menu Toggle */}
        <div className="nav-left">
          {isMobile && (
            <motion.button 
              className="menu-toggle"
              onClick={toggleSidebar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          )}
          
          <div className="logo">
            <span className="logo-main">NP</span>
            <span className="logo-text">Admin Panel</span>
          </div>
        </div>

        {/* Center Section - Search (Desktop) */}
        <div className="nav-center">
          <div className={`search-box ${mobileSearchOpen ? 'mobile-open' : ''}`}>
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="nav-right">
          {/* Mobile Search Toggle */}
          {isMobile && (
            <motion.button 
              className="mobile-search-toggle"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSearch />
            </motion.button>
          )}

          {/* Notification Bell */}
          <motion.button 
            className="notification-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBell />
            <span className="badge">3</span>
          </motion.button>

          {/* User Menu */}
          <div className="user-menu">
            <motion.button 
              className="user-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="user-name">{user?.name || 'Admin'}</span>
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  className="dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button className="dropdown-item" onClick={() => navigate('/profile')}>
                    <FaUser /> Profile
                  </button>
                  <button className="dropdown-item" onClick={() => navigate('/settings')}>
                    <FaUser /> Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (when opened) */}
      <AnimatePresence>
        {isMobile && mobileSearchOpen && (
          <motion.div 
            className="mobile-search-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-search-container">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search..." autoFocus />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          z-index: 99;
          transition: all 0.3s ease;
        }

        .navbar-scrolled {
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .nav-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0.8rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Left Section */
        .nav-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          border-radius: 50%;
          color: #666;
          font-size: 1.4rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .menu-toggle:hover {
          background: #f5f5f5;
          color: #c9a96e;
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
          font-family: 'DM Serif Display', serif;
        }

        .logo-text {
          font-size: 1rem;
          color: #666;
          font-weight: 500;
          font-family: 'Jost', sans-serif;
        }

        /* Center Section */
        .nav-center {
          flex: 1;
          max-width: 500px;
          margin: 0 2rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 40px;
          padding: 0.5rem 1.2rem;
          width: 100%;
          transition: all 0.3s ease;
        }

        .search-box:focus-within {
          background: white;
          box-shadow: 0 0 0 2px rgba(201,169,110,0.2);
        }

        .search-icon {
          color: #999;
          margin-right: 0.8rem;
          font-size: 1rem;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 0.95rem;
          color: #333;
        }

        .search-box input::placeholder {
          color: #999;
        }

        /* Right Section */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mobile-search-toggle {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: none;
          border: none;
          color: #666;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-search-toggle:hover {
          background: #f5f5f5;
          color: #c9a96e;
        }

        .notification-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: none;
          border: none;
          color: #666;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .notification-btn:hover {
          background: #f5f5f5;
          color: #c9a96e;
        }

        .badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #c9a96e;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid white;
        }

        /* User Menu */
        .user-menu {
          position: relative;
        }

        .user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          background: #f5f5f5;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-btn:hover {
          background: #e9e9e9;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: #c9a96e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
        }

        .dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          min-width: 180px;
          overflow: hidden;
          z-index: 100;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1.2rem;
          width: 100%;
          border: none;
          background: none;
          color: #333;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .dropdown-item:hover {
          background: #f5f5f5;
          color: #c9a96e;
        }

        .dropdown-divider {
          height: 1px;
          background: #e0e0e0;
          margin: 0.5rem 0;
        }

        .logout-btn {
          color: #ef4444;
        }

        .logout-btn:hover {
          background: #fee;
          color: #ef4444;
        }

        /* Mobile Search Bar */
        .mobile-search-bar {
          padding: 1rem;
          background: white;
          border-top: 1px solid #e0e0e0;
        }

        .mobile-search-container {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 40px;
          padding: 0.6rem 1.2rem;
        }

        .mobile-search-container .search-icon {
          color: #999;
          margin-right: 0.8rem;
        }

        .mobile-search-container input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 0.95rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .user-name {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0.6rem 1rem;
          }

          .nav-center {
            display: none;
          }

          .mobile-search-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .logo-text {
            display: none;
          }

          .notification-btn {
            width: 35px;
            height: 35px;
            font-size: 1.1rem;
          }

          .user-avatar {
            width: 35px;
            height: 35px;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0.5rem 0.8rem;
          }

          .menu-toggle {
            width: 35px;
            height: 35px;
            font-size: 1.2rem;
          }

          .logo-main {
            font-size: 1.6rem;
          }

          .nav-right {
            gap: 0.5rem;
          }

          .notification-btn {
            width: 32px;
            height: 32px;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;