// src/components/layout/Navbar.jsx - FIXED (CLEARS LOCALSTORAGE ON PAGE LOAD)
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaLock,
  FaArrowRight,
  FaHome,
  FaGem,
  FaTree,
  FaCouch,
  FaWrench,
  FaInfoCircle,
  FaEnvelope,
  FaUser,
  FaUserCircle,
  FaShoppingBag,
  FaSignOutAlt,
  FaClipboardList
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  // ✅ FIX: Clear localStorage and session on page load (NEW PAGE SESSION)
  useEffect(() => {
    // Check if this is a new page session (not a navigation within the app)
    const pageSession = sessionStorage.getItem('pageSession');
    
    if (!pageSession) {
      // This is a fresh page load - clear all auth data
      console.log('🔄 New page session detected - clearing localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.setItem('pageSession', Date.now().toString());
    }
  }, []);

  // Check login status - only if token exists and is valid
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // Only set logged in if BOTH token AND user data exist
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location]);

  // Get cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    updateCartCount();

    // Listen for cart updates
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle logout - CLEAR ALL STORAGE
  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also clear session storage
    sessionStorage.removeItem('pageSession');
    
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

  // Animation variants
  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const mobileMenuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial="initial"
      animate="animate"
    >
      <div className="nav-container">
        {/* Logo - Left Side */}
        <motion.div
          variants={logoVariants}
        >
          <Link to="/" className="logo" onClick={() => setIsOpen(false)}>
            <span className="logo-main">NP</span>
            <span className="logo-sub">New Prem<br />Glass House</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation - Center */}
        <div className="nav-menu-desktop">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.path}
              custom={index}
              variants={navItemVariants}
            >
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                <span className="nav-text">{link.name}</span>
                {location.pathname === link.path && (
                  <motion.span 
                    className="active-indicator"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop Actions - Right Side */}
        <motion.div 
          className="nav-actions"
          variants={navItemVariants}
          custom={navLinks.length}
        >
          {/* Shopping Cart Button - Always Visible */}
          <Link to="/cart" className="cart-btn">
            <FaShoppingBag className="cart-icon" />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="user-menu-container">
              <motion.button
                className="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserCircle className="user-icon" />
                <span className="user-name">{user?.name?.split(' ')[0] || 'User'}</span>
              </motion.button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    className="user-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to="/profile" className="dropdown-item">
                      <FaUser /> My Profile
                    </Link>
                    <Link to="/my-orders" className="dropdown-item">
                      <FaClipboardList /> My Orders
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <FaSignOutAlt /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <FaUser /> Login
            </Link>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button 
          className={`menu-btn ${isOpen ? 'active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </motion.button>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="nav-menu-mobile"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="mobile-menu-header">
                <div className="mobile-logo">
                  <span className="logo-main">NP</span>
                  <span className="logo-sub">New Prem<br />Glass House</span>
                </div>
                <motion.button 
                  className="close-btn"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* User Info in Mobile Menu */}
              {isLoggedIn && (
                <motion.div 
                  className="mobile-user-info"
                  variants={mobileItemVariants}
                >
                  <FaUserCircle className="user-avatar" />
                  <div className="user-details">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                </motion.div>
              )}

              <div className="mobile-nav-links">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.path}
                    variants={mobileItemVariants}
                  >
                    <Link
                      to={link.path}
                      className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mobile-nav-text">{link.name}</span>
                      <FaArrowRight className="mobile-nav-arrow" />
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* User Actions in Mobile Menu */}
              {isLoggedIn ? (
                <>
                  <motion.div
                    variants={mobileItemVariants}
                  >
                    <Link to="/profile" className="mobile-user-link" onClick={() => setIsOpen(false)}>
                      <FaUser />
                      <span>My Profile</span>
                      <FaArrowRight className="mobile-nav-arrow" />
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={mobileItemVariants}
                  >
                    <Link to="/my-orders" className="mobile-user-link" onClick={() => setIsOpen(false)}>
                      <FaClipboardList />
                      <span>My Orders</span>
                      <FaArrowRight className="mobile-nav-arrow" />
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={mobileItemVariants}
                  >
                    <Link to="/cart" className="mobile-user-link" onClick={() => setIsOpen(false)}>
                      <FaShoppingBag />
                      <span>My Cart {cartCount > 0 && `(${cartCount})`}</span>
                      <FaArrowRight className="mobile-nav-arrow" />
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={mobileItemVariants}
                  >
                    <button onClick={handleLogout} className="mobile-logout-link">
                      <FaSignOutAlt />
                      <span>Logout</span>
                      <FaArrowRight className="mobile-nav-arrow" />
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    variants={mobileItemVariants}
                  >
                    <Link to="/cart" className="mobile-user-link" onClick={() => setIsOpen(false)}>
                      <FaShoppingBag />
                      <span>My Cart {cartCount > 0 && `(${cartCount})`}</span>
                      <FaArrowRight className="mobile-nav-arrow" />
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={mobileItemVariants}
                  >
                    <Link to="/login" className="mobile-login-link" onClick={() => setIsOpen(false)}>
                      <FaUser />
                      <span>Login / Register</span>
                      <FaArrowRight className="mobile-nav-arrow" />
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={mobileItemVariants}
                  >
                    <Link to="/admin/login" className="mobile-admin-link" onClick={() => setIsOpen(false)}>
                      <FaLock />
                      <span>Admin Login</span>
                      <FaArrowRight className="mobile-nav-arrow" />
                    </Link>
                  </motion.div>
                </>
              )}
              
              {/* Mobile Contact Info */}
              <motion.div 
                className="mobile-contact"
                variants={mobileItemVariants}
              >
                <div className="contact-item">
                  <FaPhone />
                  <a href="tel:+917328019093">+91 73280 19093</a>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt />
                  <span>Bombay Chowk, Jharsuguda</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope />
                  <a href="mailto:info@newpremglass.com">info@newpremglass.com</a>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div 
                className="mobile-social"
                variants={mobileItemVariants}
              >
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
                <a href="https://wa.me/917328019093" target="_blank" rel="noopener noreferrer">WA</a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        :root {
          --font-serif: 'Cormorant Garamond', serif;
          --font-sans: 'Jost', sans-serif;
          --font-display: 'DM Serif Display', serif;
          --gold: #c9a96e;
          --gold-light: #e8d5b0;
          --gold-dark: #a07840;
          --deep-gold: #b8860b;
          --dark: #111111;
          --warm-white: #f8f5f0;
        }

        :global(body) {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
        }

        :global(html) {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .navbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
          z-index: 1000;
          transition: all 0.3s ease;
          margin: 0;
          padding: 0;
          font-family: var(--font-sans);
        }

        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        .navbar-scrolled .nav-container {
          padding: 0.5rem 2rem;
        }

        .navbar-scrolled .logo-main {
          font-size: 2.5rem;
        }

        .navbar-scrolled .logo-sub {
          font-size: 0.9rem;
        }

        .navbar-scrolled .nav-link {
          font-size: 0.9rem;
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.8rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          position: relative;
        }

        /* Logo Styles - FIXED: No underline on hover */
        .logo {
          text-decoration: none;
          position: relative;
          z-index: 1001;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .logo,
        .logo:hover,
        .logo:focus,
        .logo:active,
        .logo:visited {
          text-decoration: none !important;
          border-bottom: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .logo::before,
        .logo::after {
          display: none !important;
          content: none !important;
          width: 0 !important;
          height: 0 !important;
          opacity: 0 !important;
          visibility: hidden !important;
          background: none !important;
          border: none !important;
        }

        .logo-main {
          font-size: 2.8rem;
          font-weight: 600;
          color: var(--gold);
          font-family: var(--font-display);
          letter-spacing: -2px;
          line-height: 1;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-sub {
          font-size: 1rem;
          color: var(--deep-gold) !important;
          font-weight: 600;
          line-height: 1.3;
          max-width: 120px;
          letter-spacing: 0.5px;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          text-shadow: 0 1px 2px rgba(184, 134, 11, 0.2);
        }

        /* Desktop Navigation */
        .nav-menu-desktop {
          display: flex;
          gap: 1.2rem;
          align-items: center;
          justify-content: center;
          flex: 1;
          margin: 0 1rem;
        }

        .nav-link {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          position: relative;
          padding: 0.5rem 0;
          transition: color 0.3s ease;
          font-size: 1rem;
          letter-spacing: 0.5px;
          white-space: nowrap;
          font-family: var(--font-sans);
          text-transform: uppercase;
          display: flex;
          align-items: center;
        }

        .nav-link,
        .nav-link:hover,
        .nav-link:focus,
        .nav-link:active,
        .nav-link:visited {
          text-decoration: none !important;
          border-bottom: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .nav-link::before,
        .nav-link::after {
          display: none !important;
          content: none !important;
          width: 0 !important;
          height: 0 !important;
          opacity: 0 !important;
          visibility: hidden !important;
          background: none !important;
          border: none !important;
        }

        .nav-link:hover {
          color: var(--gold) !important;
        }

        .nav-link.active {
          color: var(--gold);
          font-weight: 600;
        }

        .active-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--gold);
          border-radius: 3px;
        }

        /* Desktop Actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        /* Shopping Cart Button */
        .cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--warm-white);
          color: var(--gold);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .cart-btn,
        .cart-btn:hover,
        .cart-btn:focus,
        .cart-btn:active,
        .cart-btn:visited {
          text-decoration: none !important;
          border-bottom: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .cart-btn:hover {
          background: var(--gold);
          color: white;
          transform: translateY(-2px);
        }

        .cart-icon {
          font-size: 1.2rem;
        }

        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--gold);
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

        .cart-btn:hover .cart-badge {
          background: white;
          color: var(--gold);
        }

        /* Login Button */
        .login-btn {
          display: flex !important;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.2rem;
          background: transparent;
          color: var(--gold);
          border: 2px solid var(--gold);
          border-radius: 30px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .login-btn,
        .login-btn:hover,
        .login-btn:focus,
        .login-btn:active,
        .login-btn:visited {
          text-decoration: none !important;
          border-bottom: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .login-btn::before,
        .login-btn::after {
          display: none !important;
          content: none !important;
          width: 0 !important;
          height: 0 !important;
          opacity: 0 !important;
          visibility: hidden !important;
          background: none !important;
          border: none !important;
        }

        .login-btn:hover {
          background: var(--gold);
          color: white;
          transform: translateY(-2px);
        }

        /* User Menu */
        .user-menu-container {
          position: relative;
        }

        .user-menu-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.2rem;
          background: var(--warm-white);
          border: 2px solid var(--gold);
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .user-menu-btn:hover {
          background: var(--gold);
          color: white;
        }

        .user-menu-btn:hover .user-icon {
          color: white;
        }

        .user-icon {
          color: var(--gold);
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .user-name {
          font-weight: 500;
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          min-width: 180px;
          overflow: hidden;
          z-index: 1002;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1.2rem;
          text-decoration: none;
          color: #333;
          transition: all 0.3s ease;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .dropdown-item:hover {
          background: var(--warm-white);
          color: var(--gold);
        }

        .dropdown-item.logout:hover {
          background: #fee;
          color: #ef4444;
        }

        /* Mobile Menu Button */
        .menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.6rem;
          cursor: pointer;
          color: #333;
          z-index: 1001;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s ease;
          align-items: center;
          justify-content: center;
        }

        .menu-btn:hover {
          background: var(--warm-white);
        }

        .menu-btn.active {
          color: var(--gold);
        }

        /* Mobile Navigation Menu */
        .nav-menu-mobile {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: white;
          z-index: 2000;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .close-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--warm-white);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: var(--gold);
          color: white;
        }

        /* Mobile User Info */
        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--warm-white);
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .user-avatar {
          font-size: 2.5rem;
          color: var(--gold);
        }

        .user-details {
          flex: 1;
        }

        .user-details .user-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.2rem;
        }

        .user-details .user-email {
          font-size: 0.8rem;
          color: #666;
        }

        .mobile-nav-links {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          text-decoration: none;
          color: #333;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: var(--warm-white);
          margin-bottom: 0.5rem;
        }

        .mobile-nav-link:hover {
          background: linear-gradient(135deg, var(--gold-light), var(--warm-white));
          transform: translateX(5px);
        }

        .mobile-nav-link.active {
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: white;
        }

        .mobile-nav-link.active .mobile-nav-icon {
          color: white;
        }

        .mobile-nav-icon {
          color: var(--gold);
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }

        .mobile-nav-text {
          flex: 1;
          font-size: 1.1rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .mobile-nav-arrow {
          color: var(--gold);
          font-size: 0.9rem;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover .mobile-nav-arrow {
          opacity: 1;
          transform: translateX(5px);
        }

        .mobile-nav-link.active .mobile-nav-arrow {
          color: white;
          opacity: 1;
        }

        /* Mobile User Links */
        .mobile-user-link, .mobile-login-link, .mobile-logout-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          text-decoration: none;
          color: #333;
          background: var(--warm-white);
          margin: 0.5rem 0;
          transition: all 0.3s ease;
          width: 100%;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }

        .mobile-user-link:hover, .mobile-login-link:hover {
          background: linear-gradient(135deg, var(--gold-light), var(--warm-white));
          transform: translateX(5px);
        }

        .mobile-logout-link {
          background: #fee;
          color: #ef4444;
        }

        .mobile-logout-link:hover {
          background: #ef4444;
          color: white;
        }

        .mobile-admin-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: white;
          text-decoration: none;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          margin: 1rem 0;
          transition: all 0.3s ease;
        }

        .mobile-admin-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(201, 169, 110, 0.3);
        }

        /* Mobile Contact */
        .mobile-contact {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #eee;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #666;
          margin-bottom: 1rem;
          padding: 0.5rem;
          border-radius: 10px;
          transition: all 0.3s ease;
          font-family: var(--font-sans);
        }

        .contact-item:hover {
          background: var(--warm-white);
          transform: translateX(5px);
        }

        .contact-item svg {
          color: var(--gold);
          font-size: 1.2rem;
        }

        .contact-item a {
          color: #666;
          text-decoration: none;
        }

        .contact-item a:hover {
          color: var(--gold);
        }

        /* Mobile Social */
        .mobile-social {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .mobile-social a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--warm-white);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .mobile-social a:hover {
          background: var(--gold);
          color: white;
          transform: translateY(-3px);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .nav-link { font-size: 0.9rem; }
          .nav-menu-desktop { gap: 0.8rem; }
        }

        @media (max-width: 1024px) {
          .nav-container { padding: 0.8rem 1rem; }
          .logo-main { font-size: 2.3rem; }
          .logo-sub { font-size: 0.9rem; max-width: 100px; }
          .nav-menu-desktop { gap: 0.6rem; }
          .nav-link { font-size: 0.85rem; }
          .login-btn { padding: 0.4rem 1rem; font-size: 0.85rem; }
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0.6rem 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .logo-main { 
            font-size: 2rem; 
          }
          
          .logo-sub { 
            font-size: 0.8rem; 
            max-width: 90px; 
          }
          
          .nav-menu-desktop { 
            display: none; 
          }
          
          .nav-actions { 
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 0.5rem;
            margin-left: auto;
            margin-right: 0.5rem;
          }
          
          .menu-btn { 
            display: flex;
            margin-left: 0;
          }
          
          .login-btn { 
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          }
          
          .cart-btn {
            width: 35px;
            height: 35px;
          }
        }

        @media (max-width: 480px) {
          .nav-container { 
            padding: 0.5rem 0.8rem; 
          }
          
          .logo-main { 
            font-size: 1.8rem; 
          }
          
          .logo-sub { 
            font-size: 0.7rem; 
            max-width: 80px; 
          }
          
          .mobile-nav-link { 
            padding: 0.8rem; 
          }
          
          .mobile-nav-text { 
            font-size: 1rem; 
          }
          
          .login-btn { 
            padding: 0.3rem 0.6rem;
            font-size: 0.75rem;
          }
          
          .nav-actions {
            gap: 0.3rem;
            margin-right: 0.3rem;
          }
        }

        @media (max-width: 360px) {
          .logo-main { 
            font-size: 1.6rem; 
          }
          
          .logo-sub { 
            font-size: 0.65rem; 
            max-width: 70px; 
          }
          
          .login-btn { 
            padding: 0.2rem 0.5rem;
            font-size: 0.7rem;
          }
        }

        @media (max-height: 500px) and (orientation: landscape) {
          .nav-menu-mobile { 
            padding: 1rem; 
          }
          
          .mobile-nav-links {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          
          .mobile-nav-link { 
            padding: 0.6rem; 
          }
          
          .mobile-nav-text { 
            font-size: 0.9rem; 
          }
          
          .mobile-contact { 
            margin-top: 1rem; 
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;