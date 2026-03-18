// frontend/src/components/common/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaUser,
  FaUserCircle,
  FaShoppingBag,
  FaSignOutAlt,
  FaClipboardList
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // ============= AUTH CHECK =============
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsLoggedIn(true);
          setUser(parsedUser);
        } catch (e) {
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
  }, [location.pathname]); // Re-run when path changes

  // Get cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Handle logout from main site
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowUserMenu(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/glass', name: 'Glass' },
    { path: '/plywood', name: 'Plywood' },
    { path: '/interiors', name: 'Interiors' },
    { path: '/hardware', name: 'Hardware' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' }
  ];

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setIsOpen(false)}>
          <span className="logo-main">NP</span>
          <span className="logo-sub">New Prem<br />Glass House</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-menu-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="nav-actions">
          <Link to="/cart" className="cart-btn">
            <FaShoppingBag />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {isLoggedIn ? (
            <div className="user-menu-container">
              <button
                className="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FaUserCircle className="user-icon" />
                <span className="user-name">{user?.name?.split(' ')[0] || 'User'}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <FaUser /> My Profile
                  </Link>
                  <Link to="/my-orders" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <FaClipboardList /> My Orders
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <FaUser /> Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="nav-menu-mobile">
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <span className="logo-main">NP</span>
                <span className="logo-sub">New Prem<br />Glass House</span>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>

            {isLoggedIn && (
              <div className="mobile-user-info">
                <FaUserCircle className="user-avatar" />
                <div className="user-details">
                  <p className="user-name">{user?.name}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>
            )}

            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="mobile-nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="mobile-user-link" onClick={() => setIsOpen(false)}>
                  <FaUser /> My Profile
                </Link>
                <Link to="/my-orders" className="mobile-user-link" onClick={() => setIsOpen(false)}>
                  <FaClipboardList /> My Orders
                </Link>
                <Link to="/cart" className="mobile-user-link" onClick={() => setIsOpen(false)}>
                  <FaShoppingBag /> My Cart ({cartCount})
                </Link>
                <button onClick={handleLogout} className="mobile-logout-link">
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/cart" className="mobile-user-link" onClick={() => setIsOpen(false)}>
                  <FaShoppingBag /> My Cart ({cartCount})
                </Link>
                <Link to="/login" className="mobile-login-link" onClick={() => setIsOpen(false)}>
                  <FaUser /> Login / Register
                </Link>
              </>
            )}

            <div className="mobile-contact">
              <div className="contact-item">
                <FaPhone /> <a href="tel:+917328019093">+91 73280 19093</a>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt /> Bombay Chowk, Jharsuguda
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');

        .navbar {
          position: sticky;
          top: 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
          transition: all 0.3s ease;
          font-family: 'Jost', sans-serif;
        }
        .navbar-scrolled {
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .logo-main {
          font-size: 2rem;
          font-weight: 700;
          color: #c9a96e;
          font-family: 'Cormorant Garamond', serif;
        }
        .logo-sub {
          font-size: 0.8rem;
          color: #666;
          line-height: 1.2;
          font-family: 'Cormorant Garamond', serif;
        }
        .nav-menu-desktop {
          display: flex;
          gap: 2rem;
        }
        .nav-link {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: color 0.3s;
        }
        .nav-link:hover {
          color: #c9a96e;
        }
        .nav-link.active {
          color: #c9a96e;
          font-weight: 600;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .cart-btn {
          position: relative;
          color: #333;
          font-size: 1.2rem;
          text-decoration: none;
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #c9a96e;
          color: white;
          font-size: 0.7rem;
          padding: 0.1rem 0.3rem;
          border-radius: 50%;
          min-width: 18px;
          text-align: center;
        }
        .login-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.5rem 1rem;
          background: #c9a96e;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 500;
        }
        .user-menu-container {
          position: relative;
        }
        .user-menu-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.5rem 1rem;
          background: #f5f5f5;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .user-icon {
          color: #c9a96e;
          font-size: 1.2rem;
        }
        .user-name {
          font-weight: 500;
        }
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          min-width: 180px;
          margin-top: 0.5rem;
          z-index: 1001;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1rem;
          text-decoration: none;
          color: #333;
          transition: background 0.3s;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.9rem;
          text-align: left;
        }
        .dropdown-item:hover {
          background: #f5f5f5;
        }
        .dropdown-item.logout:hover {
          background: #fee;
          color: #ef4444;
        }
        .dropdown-divider {
          height: 1px;
          background: #eee;
          margin: 0.5rem 0;
        }
        .menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #333;
        }
        
        /* Mobile Menu */
        .nav-menu-mobile {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 2000;
          padding: 2rem;
          overflow-y: auto;
        }
        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 5px;
          margin-bottom: 1.5rem;
        }
        .user-avatar {
          font-size: 2.5rem;
          color: #c9a96e;
        }
        .user-details .user-name {
          font-weight: 600;
          margin-bottom: 0.2rem;
        }
        .user-details .user-email {
          font-size: 0.8rem;
          color: #666;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .mobile-nav-link {
          text-decoration: none;
          color: #333;
          font-size: 1.1rem;
          font-weight: 500;
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }
        .mobile-user-link, .mobile-login-link, .mobile-logout-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 0;
          text-decoration: none;
          color: #333;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
        }
        .mobile-logout-link {
          color: #ef4444;
        }
        .mobile-contact {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #eee;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
        .contact-item a {
          color: #666;
          text-decoration: none;
        }
        
        @media (max-width: 768px) {
          .nav-menu-desktop {
            display: none;
          }
          .menu-btn {
            display: block;
          }
          .nav-actions {
            display: none;
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;