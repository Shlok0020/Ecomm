// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaArrowRight,
  FaGem,
  FaTree,
  FaCouch,
  FaWrench
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  // Social media links - updated with your actual URLs
  const socialLinks = {
    facebook: "https://facebook.com/newpremglasshouse",
    instagram: "https://www.instagram.com/newpremglasshousejsg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    whatsapp: "https://wa.me/917328019093"
  };

  const quickLinks = [
    { path: '/', name: 'Home' },
    { path: '/glass', name: 'Glass' },
    { path: '/plywood', name: 'Plywood' },
    { path: '/interiors', name: 'Interiors' },
    { path: '/hardware', name: 'Hardware' },
    { path: '/about', name: 'About Us' },
    { path: '/contact', name: 'Contact' }
  ];

  const expertiseItems = [
    { name: 'Architectural Glass', icon: <FaGem /> },
    { name: 'Premium Plywood', icon: <FaTree /> },
    { name: 'Modular Interiors', icon: <FaCouch /> },
    { name: 'Luxury Hardware', icon: <FaWrench /> }
  ];

  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const expertiseVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.05,
      x: 5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <footer className="footer">
      {/* Background Pattern */}
      <div className="footer-pattern"></div>
      
      <div className="footer-container">
        <motion.div 
          className="footer-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Company Info - Spans full width on mobile */}
          <motion.div className="footer-section brand-section" variants={itemVariants}>
            <div className="footer-logo">
              <span className="logo-main">NP</span>
              <span className="logo-sub">New Prem<br />Glass House</span>
            </div>
            <p className="brand-desc">
              Your trusted partner since 2014, providing premium glass, plywood, 
              interior solutions, and hardware in Jharsuguda, Odisha. 
              <span className="brand-highlight"> 5000+ happy customers</span> and counting.
            </p>
            <div className="social">
              <motion.a 
                href={socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-link"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFacebook />
              </motion.a>
              <motion.a 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                href={socialLinks.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="social-link"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsapp />
              </motion.a>
            </div>
          </motion.div>

          {/* 2x2 Grid Container for remaining sections */}
          <div className="mobile-grid-2x2">
            {/* Quick Links - Top Left in 2x2 */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h4>Quick Links</h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={link.path}>
                      <FaArrowRight className="link-arrow" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info - Top Right in 2x2 */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h4>Contact Us</h4>
              <ul className="contact-info">
                <motion.li whileHover={{ x: 5 }}>
                  <span className="icon-wrapper">
                    <FaMapMarkerAlt />
                  </span>
                  <span>Bombay Chowk, Jharsuguda</span>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <span className="icon-wrapper">
                    {/* 🔥 CALL ICON - 90° ROTATED */}
                    <FaPhone className="rotate-90" />
                  </span>
                  <a href="tel:+917328019093">+91 73280 19093</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <span className="icon-wrapper">
                    <FaEnvelope />
                  </span>
                  <a href="mailto:info@newpremglass.com">newpremglasshouse75@gmail.com</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <span className="icon-wrapper">
                    <FaClock />
                  </span>
                  <span>Mon - Sun: 9AM - 9PM</span>
                </motion.li>
              </ul>
            </motion.div>

            {/* Our Expertise - Bottom with 2x2 grid of plain links */}
            <motion.div className="footer-section expertise-full-width" variants={itemVariants}>
              <h4>Our Expertise</h4>
              <div className="expertise-grid-2x2">
                {expertiseItems.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="expertise-item"
                    variants={expertiseVariants}
                    whileHover="hover"
                  >
                    <span className="expertise-icon">{item.icon}</span>
                    <span className="gold-dot"></span>
                    <span className="expertise-name">{item.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Bottom Bar */}
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="bottom-content">
            <p>&copy; {currentYear} New Prem Glass House. All rights reserved.</p>
            <div className="bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="separator">|</span>
              <Link to="/terms">Terms of Service</Link>
              <span className="separator">|</span>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
          color: #f8f5f0;
          padding: 4rem 0 1.5rem;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(201, 169, 110, 0.2);
        }

        /* Background Pattern */
        .footer-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 20% 30%, rgba(201, 169, 110, 0.05) 0px, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(201, 169, 110, 0.03) 0px, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 4rem;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 1200px) {
          .footer-container { padding: 0 3rem; }
        }
        @media (max-width: 768px) {
          .footer-container { padding: 0 1.5rem; }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 2.5rem;
          margin-bottom: 2rem;
        }

        /* Mobile 2x2 Grid Container */
        .mobile-grid-2x2 {
          display: contents; /* On desktop, this doesn't affect layout */
        }

        /* Brand Section */
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1.2rem;
        }

        .logo-main {
          font-family: 'DM Serif Display', serif;
          font-size: 3.2rem;
          font-weight: 600;
          color: #c9a96e;
          line-height: 1;
          letter-spacing: -2px;
          text-shadow: 0 2px 10px rgba(201, 169, 110, 0.3);
        }

        .logo-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          color: #f8f5f0;
          line-height: 1.3;
          max-width: 120px;
          font-style: italic;
          letter-spacing: 0.5px;
        }

        .brand-desc {
          color: rgba(248, 245, 240, 0.7);
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .brand-highlight {
          color: #c9a96e;
          font-weight: 600;
        }

        .social {
          display: flex;
          gap: 0.8rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(201, 169, 110, 0.2);
          border-radius: 50%;
          color: #c9a96e;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .social-link:hover {
          background: #c9a96e;
          color: #0a0a0a;
          border-color: #c9a96e;
          box-shadow: 0 10px 20px rgba(201, 169, 110, 0.3);
        }

        /* Section Headers */
        .footer-section h4 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.2rem;
          color: #f8f5f0;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.8rem;
          letter-spacing: 0.5px;
        }

        .footer-section h4::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: #c9a96e;
          transition: width 0.3s ease;
        }

        .footer-section:hover h4::after {
          width: 60px;
        }

        /* Quick Links */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.8rem;
        }

        .footer-links a {
          color: rgba(248, 245, 240, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .link-arrow {
          font-size: 0.7rem;
          color: #c9a96e;
          opacity: 0;
          transform: translateX(-5px);
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: #c9a96e;
        }

        .footer-links a:hover .link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Contact Info */
        .contact-info {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .contact-info li {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          margin-bottom: 1rem;
          color: rgba(248, 245, 240, 0.7);
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .contact-info li:hover {
          color: #c9a96e;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: #c9a96e;
          font-size: 0.9rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* 🔥🔥🔥 90 DEGREE ROTATION FOR CALL ICON */
        .rotate-90 {
          transform: rotate(90deg) !important;
          transition: transform 0.3s ease;
        }

        .contact-info li:hover .rotate-90 {
          transform: rotate(90deg) scale(1.2) !important;
        }

        .contact-info a {
          color: rgba(248, 245, 240, 0.7);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-info a:hover {
          color: #c9a96e;
        }

        /* Expertise Grid 2x2 with plain links */
        .expertise-grid-2x2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .expertise-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: rgba(248, 245, 240, 0.7);
          font-size: 0.95rem;
          transition: all 0.3s ease;
          cursor: default;
          padding: 0.5rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
        }

        .expertise-item:hover {
          color: #c9a96e;
          background: rgba(201, 169, 110, 0.05);
          border-color: rgba(201, 169, 110, 0.2);
        }

        .expertise-icon {
          color: #c9a96e;
          font-size: 1rem;
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .expertise-item:hover .expertise-icon {
          opacity: 1;
          transform: scale(1.1);
        }

        .gold-dot {
          width: 4px;
          height: 4px;
          background: #c9a96e;
          border-radius: 50%;
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .expertise-item:hover .gold-dot {
          transform: scale(1.5);
        }

        .expertise-name {
          flex: 1;
        }

        /* Footer Bottom */
        .footer-bottom {
          border-top: 1px solid rgba(201, 169, 110, 0.15);
          padding-top: 1.5rem;
          margin-top: 1.5rem;
        }

        .bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          color: rgba(248, 245, 240, 0.6);
          font-size: 0.85rem;
        }

        .bottom-links {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .bottom-links a {
          color: rgba(248, 245, 240, 0.6);
          text-decoration: none;
          transition: color 0.3s ease;
          font-size: 0.85rem;
          position: relative;
        }

        .bottom-links a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #c9a96e;
          transition: width 0.3s ease;
        }

        .bottom-links a:hover {
          color: #c9a96e;
        }

        .bottom-links a:hover::after {
          width: 100%;
        }

        .separator {
          color: rgba(201, 169, 110, 0.3);
        }

        /* Tablet Styles */
        @media (max-width: 1024px) and (min-width: 769px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
          
          .brand-section {
            grid-column: span 2;
          }
          
          .expertise-full-width {
            grid-column: span 2;
          }
        }

        /* Mobile Styles - 2x2 Grid */
        @media (max-width: 768px) {
          .footer {
            padding: 3rem 0 1.2rem;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          /* Brand section takes full width */
          .brand-section {
            margin-bottom: 0.5rem;
          }

          /* Create 2x2 grid for inner sections */
          .mobile-grid-2x2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }

          /* Expertise section spans both columns */
          .expertise-full-width {
            grid-column: span 2;
          }

          .footer-section {
            text-align: left;
          }

          /* Brand section styling for mobile */
          .footer-logo {
            justify-content: flex-start;
          }

          .logo-main {
            font-size: 2.8rem;
          }

          .brand-desc {
            max-width: 100%;
            font-size: 0.9rem;
          }

          .social {
            justify-content: flex-start;
          }

          /* Section headers left aligned */
          .footer-section h4 {
            text-align: left;
            font-size: 1.1rem;
            margin-bottom: 1.2rem;
          }

          .footer-section h4::after {
            left: 0;
            transform: none;
          }

          /* Lists left aligned */
          .footer-links a {
            font-size: 0.9rem;
          }

          .contact-info li {
            font-size: 0.9rem;
            max-width: 100%;
          }

          /* Expertise grid */
          .expertise-grid-2x2 {
            gap: 0.8rem;
          }

          .expertise-item {
            font-size: 0.9rem;
            padding: 0.4rem;
          }

          /* Bottom bar */
          .bottom-content {
            flex-direction: column;
            text-align: center;
            gap: 0.8rem;
          }

          .bottom-links {
            justify-content: center;
          }
        }

        /* Small phones */
        @media (max-width: 480px) {
          .mobile-grid-2x2 {
            gap: 1.2rem;
          }

          .footer-section h4 {
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          .logo-main {
            font-size: 2.5rem;
          }

          .logo-sub {
            font-size: 0.9rem;
          }

          .brand-desc {
            font-size: 0.85rem;
          }

          .social-link {
            width: 38px;
            height: 38px;
            font-size: 1rem;
          }

          .footer-links a {
            font-size: 0.85rem;
          }

          .contact-info li {
            font-size: 0.8rem;
            gap: 0.5rem;
          }

          .icon-wrapper {
            width: 16px;
            height: 16px;
            font-size: 0.75rem;
          }

          .expertise-grid-2x2 {
            gap: 0.6rem;
          }

          .expertise-item {
            font-size: 0.8rem;
            padding: 0.3rem;
            gap: 0.4rem;
          }

          .expertise-icon {
            font-size: 0.9rem;
          }

          .gold-dot {
            width: 3px;
            height: 3px;
          }

          .bottom-content {
            font-size: 0.8rem;
          }

          .bottom-links a {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;