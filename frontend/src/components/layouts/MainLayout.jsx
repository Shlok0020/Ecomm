// src/components/layouts/MainLayout.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { PageTransitionLoader } from '../common/Loader';
import { FaArrowUp, FaWhatsapp, FaPhone } from 'react-icons/fa';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  // Handle scroll for back to top button and WhatsApp button
  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
      setShowWhatsApp(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle page transition loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="main-layout">
      {/* Page Transition Loader */}
      <AnimatePresence>
        {isLoading && <PageTransitionLoader />}
      </AnimatePresence>

      {/* Navbar */}
      <Navbar />

      {/* Main Content with Animation */}
      <motion.main 
        className="main-content"
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <div className="floating-buttons">
        {/* WhatsApp Button */}
        <AnimatePresence>
          {showWhatsApp && (
            <motion.a
              href="https://wa.me/917328019093"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
              initial={{ opacity: 0, scale: 0.5, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 100 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp />
            </motion.a>
          )}
        </AnimatePresence>

        {/* Back to Top Button */}
        <AnimatePresence>
          {scrollTop > 500 && (
            <motion.button
              className="back-to-top"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Back to top"
            >
              <FaArrowUp />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Call Button for Mobile */}
      <a href="tel:+917328019093" className="mobile-call-button">
        <FaPhone />
      </a>

      <style jsx>{`
        .main-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          width: 100%;
          overflow-x: hidden;
          position: relative;
          background: #f8f5f0; /* Warm white background */
        }

        .main-content {
          flex: 1;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0;
          position: relative;
          z-index: 1;
        }

        /* Floating Buttons Container */
        .floating-buttons {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 99;
        }

        /* Back to Top Button */
        .back-to-top {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(201, 169, 110, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .back-to-top:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(201, 169, 110, 0.4);
        }

        /* WhatsApp Button */
        .whatsapp-button {
          width: 50px;
          height: 50px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .whatsapp-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
        }

        /* Mobile Call Button */
        .mobile-call-button {
          display: none;
          position: fixed;
          bottom: 30px;
          left: 30px;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(201, 169, 110, 0.3);
          align-items: center;
          justify-content: center;
          text-decoration: none;
          z-index: 99;
          transition: all 0.3s ease;
        }

        .mobile-call-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(201, 169, 110, 0.4);
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .main-content {
            padding: 0;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 0;
            margin-top: 0;
          }

          .floating-buttons {
            bottom: 20px;
            right: 20px;
            gap: 10px;
          }

          .back-to-top,
          .whatsapp-button {
            width: 45px;
            height: 45px;
            font-size: 18px;
          }

          .mobile-call-button {
            display: flex;
            bottom: 20px;
            left: 20px;
            width: 45px;
            height: 45px;
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .floating-buttons {
            bottom: 15px;
            right: 15px;
          }

          .back-to-top,
          .whatsapp-button {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }

          .mobile-call-button {
            bottom: 15px;
            left: 15px;
            width: 40px;
            height: 40px;
            font-size: 16px;
          }
        }

        /* Landscape Mode */
        @media (max-height: 500px) and (orientation: landscape) {
          .floating-buttons {
            bottom: 10px;
            right: 10px;
          }

          .back-to-top,
          .whatsapp-button {
            width: 35px;
            height: 35px;
            font-size: 14px;
          }

          .mobile-call-button {
            bottom: 10px;
            left: 10px;
            width: 35px;
            height: 35px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

// ============= HOME PAGE LAYOUT =============
export const HomeLayout = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="home-layout">
      <AnimatePresence>
        {isLoading && <PageTransitionLoader />}
      </AnimatePresence>

      <Navbar />
      <motion.main 
        className="home-content"
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.main>
      <Footer />

      <style jsx>{`
        .home-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8f5f0;
        }
        .home-content {
          flex: 1;
          margin-top: -80px; /* Overlap with navbar for hero sections */
        }
        @media (max-width: 768px) {
          .home-content {
            margin-top: -60px;
          }
        }
      `}</style>
    </div>
  );
};

// ============= PRODUCT PAGE LAYOUT =============
export const ProductLayout = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="product-layout">
      <AnimatePresence>
        {isLoading && <PageTransitionLoader />}
      </AnimatePresence>

      <Navbar />
      <motion.main 
        className="product-content"
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="product-container">
          {children}
        </div>
      </motion.main>
      <Footer />

      <style jsx>{`
        .product-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8f5f0;
        }
        .product-content {
          flex: 1;
          padding: 2rem 0;
        }
        .product-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        @media (max-width: 768px) {
          .product-content {
            padding: 1rem 0;
          }
          .product-container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
};

// ============= ADMIN LAYOUT =============
export const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      {children}
      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          background: #f8f9fa;
          display: flex;
        }
      `}</style>
    </div>
  );
};

// ============= BLANK LAYOUT =============
export const BlankLayout = ({ children }) => {
  return (
    <div className="blank-layout">
      {children}
      <style jsx>{`
        .blank-layout {
          min-height: 100vh;
          background: #f8f5f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

// ============= AUTH LAYOUT =============
export const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <span className="logo-main">NP</span>
            <span className="logo-sub">New Prem<br />Glass House</span>
          </div>
          <h2>Welcome Back!</h2>
          <p>Access your admin dashboard to manage products, orders, and more.</p>
        </div>
        <div className="auth-right">
          {children}
        </div>
      </div>

      <style jsx>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .auth-container {
          display: flex;
          max-width: 1000px;
          width: 100%;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .auth-left {
          flex: 1;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .logo-main {
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
        }

        .logo-sub {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.9);
          line-height: 1.3;
        }

        .auth-left h2 {
          font-size: 2rem;
          margin-bottom: 15px;
        }

        .auth-left p {
          font-size: 1rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .auth-right {
          flex: 1;
          padding: 40px;
        }

        @media (max-width: 768px) {
          .auth-container {
            flex-direction: column;
          }
          
          .auth-left {
            padding: 30px;
            text-align: center;
          }
          
          .auth-brand {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

// ============= ERROR LAYOUT =============
export const ErrorLayout = ({ children }) => {
  return (
    <div className="error-layout">
      {children}
      <style jsx>{`
        .error-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f5f0;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

// ============= MAIN EXPORT =============
export default MainLayout;