// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  FaEnvelope
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();

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

  const navLinks = [
    { path: '/', name: 'Home', icon: <FaHome /> },
    { path: '/glass', name: 'Glass', icon: <FaGem /> },
    { path: '/plywood', name: 'Plywood', icon: <FaTree /> },
    { path: '/interiors', name: 'Interiors', icon: <FaCouch /> },
    { path: '/hardware', name: 'Hardware', icon: <FaWrench /> },
    { path: '/about', name: 'About', icon: <FaInfoCircle /> },
    { path: '/contact', name: 'Contact', icon: <FaEnvelope /> }
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
              onHoverStart={() => setHoveredLink(link.path)}
              onHoverEnd={() => setHoveredLink(null)}
            >
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-text">{link.name}</span>
                {location.pathname === link.path && (
                  <motion.span 
                    className="active-indicator"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {hoveredLink === link.path && location.pathname !== link.path && (
                  <motion.span 
                    className="hover-indicator"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop Actions - Right Side - Admin Login Button */}
        <motion.div 
          className="nav-actions"
          variants={navItemVariants}
          custom={navLinks.length}
        >
          <Link to="/admin/login" className="admin-login-btn">
            <FaLock className="nav-icon" />
            <span>Admin</span>
          </Link>
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
                      <span className="mobile-nav-icon">{link.icon}</span>
                      <span className="mobile-nav-text">{link.name}</span>
                      <FaArrowRight className="mobile-nav-arrow" />
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Admin Login in Mobile Menu */}
              <motion.div
                variants={mobileItemVariants}
              >
                <Link to="/admin/login" className="mobile-admin-link" onClick={() => setIsOpen(false)}>
                  <FaLock />
                  <span>Admin Login</span>
                  <FaArrowRight className="mobile-nav-arrow" />
                </Link>
              </motion.div>
              
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
        /* Font imports - same as home page */
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        :root {
          --font-serif: 'Cormorant Garamond', serif;
          --font-sans: 'Jost', sans-serif;
          --font-display: 'DM Serif Display', serif;
          --gold: #c9a96e;
          --gold-light: #e8d5b0;
          --gold-dark: #a07840;
          --deep-gold: #b8860b;  /* DEEP GOLDEN COLOR */
          --dark: #111111;
          --warm-white: #f8f5f0;
        }

        /* Global body styles to remove default margins */
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

        /* When scrolled - navbar becomes smaller */
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

        .navbar-scrolled .admin-login-btn {
          font-size: 0.9rem;
          padding: 0.4rem 1rem;
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

        /* Logo Styles - Left Side */
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

        /* ===== DEEP GOLDEN COLOR - "NEW PREM GLASS HOUSE" ===== */
        .logo-sub {
          font-size: 1rem;
          color: var(--deep-gold) !important;  /* DEEP GOLDEN COLOR */
          font-weight: 600;
          line-height: 1.3;
          max-width: 120px;
          letter-spacing: 0.5px;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          text-shadow: 0 1px 2px rgba(184, 134, 11, 0.2);  /* GOLDEN GLOW */
        }

        /* Desktop Navigation - Center */
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
          transition: all 0.3s ease;
          font-size: 1rem;
          letter-spacing: 0.5px;
          white-space: nowrap;
          font-family: var(--font-sans);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .nav-icon {
          font-size: 0.9rem;
          color: var(--gold);
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .nav-link:hover .nav-icon {
          opacity: 1;
          transform: scale(1.1);
        }

        .nav-link:hover {
          color: var(--gold);
        }

        .nav-link.active {
          color: var(--gold);
          font-weight: 600;
        }

        .nav-link.active .nav-icon {
          opacity: 1;
          color: var(--gold);
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

        .hover-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: var(--gold-light);
          border-radius: 2px;
        }

        /* Desktop Actions - Right Side - Admin Login Button */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .admin-login-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: white;
          text-decoration: none;
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(201, 169, 110, 0.2);
        }

        .admin-login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(201, 169, 110, 0.3);
          background: linear-gradient(135deg, var(--gold-dark), var(--gold));
        }

        .admin-login-btn .nav-icon {
          font-size: 0.9rem;
          color: white;
          opacity: 1;
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

        /* Mobile Admin Link */
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
          .nav-link {
            font-size: 0.9rem;
          }
          .nav-menu-desktop {
            gap: 0.8rem;
          }
        }

        @media (max-width: 1024px) {
          .nav-container {
            padding: 0.8rem 1rem;
          }
          
          .logo-main {
            font-size: 2.3rem;
          }
          
          .logo-sub {
            font-size: 0.9rem;
            max-width: 100px;
            color: var(--deep-gold) !important;  /* DEEP GOLDEN */
          }
          
          .nav-menu-desktop {
            gap: 0.6rem;
          }
          
          .nav-link {
            font-size: 0.85rem;
          }
          
          .admin-login-btn {
            padding: 0.4rem 1rem;
            font-size: 0.85rem;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .nav-container {
            padding: 0.6rem 1rem;
          }

          .logo-main {
            font-size: 2rem;
          }

          .logo-sub {
            font-size: 0.8rem;
            max-width: 90px;
            line-height: 1.2;
            font-weight: 600;
            color: var(--deep-gold) !important;  /* DEEP GOLDEN */
          }

          /* Hide desktop navigation */
          .nav-menu-desktop {
            display: none;
          }

          /* Hide desktop admin button */
          .nav-actions {
            display: none;
          }

          /* Show mobile menu button */
          .menu-btn {
            display: flex;
          }
        }

        /* Small Mobile Devices */
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
            font-weight: 600;
            color: var(--deep-gold) !important;  /* DEEP GOLDEN */
          }

          .mobile-nav-link {
            padding: 0.8rem;
          }

          .mobile-nav-text {
            font-size: 1rem;
          }

          .mobile-admin-link {
            padding: 0.8rem;
            font-size: 1rem;
          }

          .mobile-contact {
            margin-top: 1.5rem;
          }

          .contact-item {
            font-size: 0.85rem;
          }
        }

        /* Extra Small Devices */
        @media (max-width: 360px) {
          .logo-main {
            font-size: 1.6rem;
          }
          
          .logo-sub {
            font-size: 0.65rem;
            max-width: 70px;
            font-weight: 600;
            color: var(--deep-gold) !important;  /* DEEP GOLDEN */
          }
        }

        /* Landscape Mode */
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