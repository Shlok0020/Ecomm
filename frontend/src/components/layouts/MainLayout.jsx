// src/components/layouts/MainLayout.jsx - Modified to accept both hideFooter and showFooter
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { PageTransitionLoader } from '../common/Loader';
import { FaWhatsapp } from 'react-icons/fa';

const MainLayout = ({ children, hideFooter = false, showFooter }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Determine if footer should be shown
  // If showFooter is provided, use that (inverted logic), otherwise use hideFooter
  const shouldShowFooter = showFooter !== undefined ? showFooter : !hideFooter;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  // Handle scroll for WhatsApp button
  useEffect(() => {
    const handleScroll = () => {
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

  // WhatsApp button animation variants - ONLY JUMPING (NO RADIATION)
  const whatsAppVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.5
      }
    },
    exit: { scale: 0, opacity: 0 },
    hover: {
      scale: 1.15,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: { scale: 0.95 },
    jump: {
      y: [0, -12, 0, -6, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
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

      {/* Footer - Conditionally rendered based on shouldShowFooter */}
      {shouldShowFooter && <Footer />}

      {/* Floating WhatsApp Button with ONLY JUMP Animation */}
      <div className="floating-whatsapp">
        <AnimatePresence>
          {showWhatsApp && (
            <motion.div
              className="whatsapp-container"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={whatsAppVariants}
            >
              {/* WhatsApp Button with Jump Animation (NO RADIATION RINGS) */}
              <motion.a
                href="https://wa.me/917328019093"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
                variants={whatsAppVariants}
                whileHover="hover"
                whileTap="tap"
                animate="jump"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp />
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .main-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          width: 100%;
          overflow-x: hidden;
          position: relative;
          background: #f8f5f0;
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

        .floating-whatsapp {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
        }

        .whatsapp-container {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .whatsapp-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          border: none;
          outline: none;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white;
          font-size: 32px;
          text-decoration: none;
          position: relative;
          z-index: 10;
        }

        .whatsapp-button:hover {
          background: linear-gradient(135deg, #128C7E, #075E54);
          box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .floating-whatsapp {
            bottom: 20px;
            right: 20px;
          }

          .whatsapp-container {
            width: 70px;
            height: 70px;
          }

          .whatsapp-button {
            width: 50px;
            height: 50px;
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .floating-whatsapp {
            bottom: 15px;
            right: 15px;
          }

          .whatsapp-container {
            width: 60px;
            height: 60px;
          }

          .whatsapp-button {
            width: 45px;
            height: 45px;
            font-size: 24px;
          }
        }

        /* Landscape Mode */
        @media (max-height: 500px) and (orientation: landscape) {
          .floating-whatsapp {
            bottom: 10px;
            right: 10px;
          }

          .whatsapp-container {
            width: 60px;
            height: 60px;
          }

          .whatsapp-button {
            width: 40px;
            height: 40px;
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};

// ============= HOME PAGE LAYOUT =============
export const HomeLayout = ({ children, hideFooter = false, showFooter }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine if footer should be shown
  const shouldShowFooter = showFooter !== undefined ? showFooter : !hideFooter;

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
      
      {/* Footer - Conditionally rendered */}
      {shouldShowFooter && <Footer />}

      <style jsx>{`
        .home-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8f5f0;
        }
        .home-content {
          flex: 1;
          margin-top: -80px;
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
export const ProductLayout = ({ children, hideFooter = false, showFooter }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine if footer should be shown
  const shouldShowFooter = showFooter !== undefined ? showFooter : !hideFooter;

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
      
      {/* Footer - Conditionally rendered */}
      {shouldShowFooter && <Footer />}

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
          <p>Access your account to manage orders and more.</p>
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
          background: linear-gradient(135deg, #c9a96e 0%, #a07840 100%);
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
          background: linear-gradient(135deg, #c9a96e 0%, #a07840 100%);
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