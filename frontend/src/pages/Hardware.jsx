// src/pages/Hardware/Hardware.jsx - WITHOUT TOTAL PRODUCTS
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaArrowRight, 
  FaPhone,
  FaStore,
  FaStar,
  FaWrench,
  FaDoorOpen,
  FaCog,
  FaTools,
  FaTint,
  FaRuler,
  FaLayerGroup,
  FaBoxes,
  FaQuoteLeft,
  FaAward,
  FaCheckCircle,
  FaShieldAlt,
  FaUsers,
  FaClock,
  FaGem
} from 'react-icons/fa';
import hardwareService from '../services/hardwareService';
import toast from 'react-hot-toast';

const Hardware = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    products: '500+',
    brands: '50+',
    clients: '2000+',
    years: '10+'
  });

  // ============= DATA FLOW: Admin → Backend → Database → Frontend =============
  
  const fetchProducts = async (showToast = false) => {
    console.log('🔵 Fetching hardware products from database...');
    setLoading(true);
    setError(null);
    
    try {
      // Clear cache to get fresh data
     
      // Direct localStorage check (for debugging)
      const localData = localStorage.getItem('hardware_admin_products');
      console.log('📦 LOCALSTORAGE hardware:', localData ? JSON.parse(localData) : '[]');
      
      const response = await hardwareService.getAll();
      console.log('📦 Products from database:', response.data);
      
      // Make sure response.data is an array
      const allProducts = Array.isArray(response.data) ? response.data : [];
      
      setProducts(allProducts);
      
      // Update stats based on actual data
      const productCount = allProducts.length;
      setStats({
        products: productCount > 0 ? productCount + '+' : '500+',
        brands: '50+',
        clients: productCount > 0 ? (productCount * 4) + '+' : '2000+',
        years: '10+'
      });
      
      if (showToast) {
        toast.success('Products updated from database!');
      }
      
    } catch (error) {
      console.error('🔴 Error fetching products:', error);
      setError(error.message || 'Failed to load products');
      setProducts([]);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    console.log('🟣 Hardware component mounted');
    fetchProducts();
    
    // ============= REAL-TIME UPDATES WHEN ADMIN CHANGES DATA =============
    
    // Listen for storage events (when admin makes changes in another tab)
    const handleStorageChange = (e) => {
      console.log('🟡 Storage changed in Hardware:', e.key);
      if (e.key === 'hardware_admin_products' || 
          e.key === 'hardware_products' || 
          e.key === null) {
        fetchProducts(true);
      }
    };
    
    // Listen for custom events (when admin makes changes in same tab)
    const handleProductsUpdated = () => {
      console.log('🟡 Products updated event in Hardware');
      fetchProducts(true);
    };
    
    const handleHardwareProductsUpdated = () => {
      console.log('🟡 Hardware products updated event');
      fetchProducts(true);
    };
    
    // Mouse move effect (optimized)
    let rafId = null;
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 15,
          y: (e.clientY / window.innerHeight - 0.5) * 15
        });
        rafId = null;
      });
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleProductsUpdated);
    window.addEventListener('hardwareProductsUpdated', handleHardwareProductsUpdated);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleProductsUpdated);
      window.removeEventListener('hardwareProductsUpdated', handleHardwareProductsUpdated);
    };
  }, []);

  const testimonials = [
    {
      name: 'Suresh Patel',
      role: 'Contractor',
      text: 'Best hardware store in Jharsuguda! Quality products and competitive prices.',
      rating: 5
    },
    {
      name: 'Meena Sharma',
      role: 'Homeowner',
      text: 'Found all the hardware I needed for my renovation project. Great service!',
      rating: 5
    },
    {
      name: 'Rakesh Gupta',
      role: 'Builder',
      text: 'Regular supplier for our construction projects. Never disappointed.',
      rating: 5
    }
  ];

  // Stats array with real data
  const statsArray = [
    { value: stats.products, label: 'Hardware Products', icon: <FaWrench /> },
    { value: stats.brands, label: 'Premium Brands', icon: <FaGem /> },
    { value: stats.clients, label: 'Happy Customers', icon: <FaUsers /> },
    { value: stats.years, label: 'Years Experience', icon: <FaClock /> }
  ];

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const rotateIn = {
    hidden: { rotate: -10, opacity: 0, scale: 0.8 },
    visible: { rotate: 0, opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
        background: '#f8f5f0'
      }}>
        <div className="loader" style={{
          width: '60px',
          height: '60px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #c9a96e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontFamily: 'Jost, sans-serif', color: '#666' }}>Loading hardware products...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
        background: '#f8f5f0'
      }}>
        <h2 style={{ color: '#ef4444', fontFamily: 'Cormorant Garamond, serif' }}>Error</h2>
        <p style={{ color: '#666' }}>{error}</p>
        <button 
          onClick={() => fetchProducts(true)}
          style={{
            padding: '12px 30px',
            background: '#c9a96e',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontFamily: 'Jost, sans-serif',
            fontWeight: 500
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="hw-page">
      {/* Last Updated Indicator - Small and subtle */}
      {!loading && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{products.length} products loaded</span>
          <button 
            onClick={() => fetchProducts(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#c9a96e',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Refresh from database"
          >
            ↻
          </button>
        </div>
      )}

      {/* SEO Meta Data */}
      <Helmet>
        <title>Premium Hardware Store in Jharsuguda | Door Handles, Hinges, Ladders & More | New Prem Glass House</title>
        <meta name="description" content="Visit New Prem Glass House for premium hardware products in Jharsuguda. We offer door handles, hinges, ladders, Fevicol adhesives, aluminium sections, rubber beading, silicone sealant and cabinet hardware. 500+ products from 50+ brands." />
        <meta name="keywords" content="hardware store Jharsuguda, door handles Jharsuguda, hinges Jharsuguda, ladders Jharsuguda, Fevicol Jharsuguda, aluminium sections Jharsuguda, rubber beading Jharsuguda, silicone sealant Jharsuguda, cabinet hardware Jharsuguda, building hardware Odisha" />
        <link rel="canonical" href="https://newpremglasshouse.com/hardware" />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --gold: #c9a96e;
          --gold-light: #e8d5b0;
          --gold-dark: #a07840;
          --black: #0a0a0a;
          --dark: #111111;
          --dark-2: #1a1a1a;
          --dark-3: #222222;
          --warm-white: #f8f5f0;
          --off-white: #ede8df;
          --cream: #f2ede4;
          --gray-text: #888888;
          --light-gray: #d4d4d4;
          --white: #ffffff;
          --serif: 'Cormorant Garamond', serif;
          --display: 'DM Serif Display', serif;
          --sans: 'Jost', sans-serif;
          --shadow-sm: 0 10px 30px -15px rgba(0,0,0,0.2);
          --shadow-md: 0 20px 40px -20px rgba(0,0,0,0.3);
          --shadow-lg: 0 30px 60px -30px rgba(0,0,0,0.4);
          --shadow-gold: 0 20px 40px rgba(201,169,110,0.15);
        }

        html { overflow-x: hidden; }

        body {
          font-family: var(--sans);
          background: var(--warm-white);
          color: var(--dark);
          overflow-x: hidden;
        }

        .hw-page {
          overflow-x: hidden;
          background: var(--warm-white);
          min-height: 100vh;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 4rem;
        }

        @media (max-width: 1200px) {
          .container { padding: 0 3rem; }
        }
        @media (max-width: 768px) {
          .container { padding: 0 2rem; }
        }

        .mk-label {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1.2rem;
        }

        .mk-label span {
          font-family: var(--sans);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .mk-label-line {
          width: 30px;
          height: 1px;
          background: var(--gold);
        }

        .mk-h2 {
          font-family: var(--serif);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--dark);
        }

        .mk-h2 em { font-style: italic; color: var(--gold); }

        .mk-h2--light { color: var(--white); }

        /* Hero Section */
        .hw-hero {
          position: relative;
          min-height: 80vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 120px 0 80px;
          background: var(--dark);
        }

        .hw-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hw-hero__bg img {
          width: 100%;
          height: 200%;
          object-fit: cover;
          object-position: center 20%;
          opacity: 0.5;
          transform-origin: center;
          transition: transform 0.1s linear;
          will-change: transform;
        }

        .hw-hero__grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
          z-index: 1;
          pointer-events: none;
        }

        .hw-hero__vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.95) 0%,
            rgba(0,0,0,0.6) 40%,
            rgba(0,0,0,0.2) 70%,
            transparent 100%
          );
          z-index: 2;
        }

        .hw-hero__pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 30%, rgba(201, 169, 110, 0.15) 0px, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .hw-hero__content {
          position: relative;
          z-index: 3;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .hw-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 0.8rem 2rem;
          border-radius: 40px;
          color: var(--gold);
          border: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .hw-hero__title {
          font-family: var(--serif);
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 300;
          color: var(--white);
          margin-bottom: 1.5rem;
          line-height: 1;
        }

        .hw-hero__title em {
          font-style: italic;
          color: var(--gold);
        }

        .hw-hero__desc {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.9);
          max-width: 700px;
          margin: 0 auto 2rem;
          line-height: 1.8;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 2rem;
        }

        .hero-stat {
          text-align: center;
        }

        .hero-stat h4 {
          font-family: var(--serif);
          font-size: 2rem;
          color: var(--gold);
          margin-bottom: 0.3rem;
        }

        .hero-stat p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
        }

        .hero-buttons {
          margin-top: 2rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2.5rem;
          background: var(--gold);
          color: var(--dark);
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: var(--white);
          transform: translateY(-3px);
          box-shadow: var(--shadow-gold);
        }

        @media (max-width: 768px) {
          .hw-hero {
            min-height: 70vh;
            padding: 100px 0 60px;
          }
          
          .hw-hero__bg img {
            height: 100%;
            object-position: center;
          }
          
          .hw-hero__title { font-size: 3rem; }
          .hero-stats { flex-direction: column; gap: 1.5rem; }
        }

        @media (max-width: 480px) {
          .hw-hero__bg img {
            height: 100%;
            object-position: center;
          }
          
          .hw-hero__title { font-size: 2.2rem; }
        }

        .stats-section {
          padding: 80px 0;
          background: var(--white);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .stat-card {
          background: var(--white);
          padding: 40px 30px;
          border-radius: 24px;
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: all 0.4s ease;
          border: 1px solid rgba(0,0,0,0.02);
        }

        .stat-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-gold);
          border-color: var(--gold);
        }

        .stat-card svg {
          font-size: 3rem;
          color: var(--gold);
          margin-bottom: 1.5rem;
        }

        .stat-card h3 {
          font-family: var(--serif);
          font-size: 2.8rem;
          color: var(--dark);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .stat-card p {
          color: var(--gray-text);
          font-size: 0.9rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .categories-section {
          padding: 80px 0;
          background: linear-gradient(135deg, var(--cream), var(--warm-white));
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          margin-top: 3rem;
        }

        .category-card {
          background: var(--white);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all 0.4s ease;
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .category-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-gold);
        }

        .card-image {
          position: relative;
          height: 220px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .category-card:hover .card-image img {
          transform: scale(1.1);
        }

        .card-icon {
          position: absolute;
          bottom: -25px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 3;
          border: 3px solid var(--white);
          transition: transform 0.3s ease;
        }

        .category-card:hover .card-icon {
          transform: rotate(360deg) scale(1.1);
        }

        .card-content {
          padding: 35px 25px 25px;
          background: var(--white);
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .card-number {
          position: absolute;
          top: -38px;
          left: 22px;
          font-family: var(--serif);
          font-size: 5rem;
          font-weight: 700;
          color: rgba(201,169,110,0.1);
          line-height: 1;
          z-index: 1;
        }

        .card-title {
          font-family: var(--serif);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 10px;
          position: relative;
          z-index: 2;
        }

        .card-title::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 36px;
          height: 2px;
          background: var(--gold);
          transition: width 0.3s ease;
        }

        .category-card:hover .card-title::after {
          width: 66px;
        }

        .card-desc {
          color: var(--gray-text);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 18px;
          position: relative;
          z-index: 2;
          flex: 1;
        }

        .card-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .pill {
          background: rgba(201,169,110,0.08);
          color: var(--gold-dark);
          padding: 5px 14px;
          border-radius: 30px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.4px;
          transition: all 0.3s;
        }

        .category-card:hover .pill {
          background: var(--gold);
          color: var(--white);
        }

        .card-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          margin-top: auto;
          border-top: 1px solid rgba(0,0,0,0.05);
          color: var(--gold);
          font-weight: 600;
          font-size: 0.9rem;
          transition: color 0.3s;
        }

        .category-card:hover .card-cta {
          color: var(--gold-dark);
        }

        .card-cta svg {
          transition: transform 0.3s ease;
        }

        .category-card:hover .card-cta svg {
          transform: translateX(8px);
        }

        .admin-badge-small {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #4caf50;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.6rem;
          z-index: 10;
        }

        .testimonials-section {
          padding: 100px 0;
          background: linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%);
          position: relative;
          overflow: hidden;
        }

        .testimonials__bg-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--serif);
          font-size: clamp(8rem, 20vw, 20rem);
          font-weight: 700;
          color: rgba(255,255,255,0.02);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 60px;
          position: relative;
          z-index: 2;
        }

        .testimonial-card {
          padding: 3rem 2.5rem;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
          transition: all 0.4s ease;
          position: relative;
        }

        .testimonial-card:hover {
          transform: translateY(-8px);
          border-color: var(--gold);
        }

        .testimonial__quote {
          color: var(--gold);
          opacity: 0.4;
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }

        .testimonial__stars {
          display: flex;
          gap: 4px;
          margin-bottom: 1.5rem;
          color: var(--gold);
        }

        .testimonial__text {
          font-family: var(--serif);
          font-size: 1.15rem;
          font-weight: 300;
          font-style: italic;
          line-height: 1.8;
          color: rgba(255,255,255,0.9);
          margin-bottom: 2rem;
        }

        .testimonial__divider {
          width: 30px;
          height: 1px;
          background: var(--gold);
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }

        .testimonial__name {
          font-family: var(--sans);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--white);
          margin-bottom: 4px;
        }

        .testimonial__role {
          font-family: var(--sans);
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .cta-section {
          padding: 80px 0;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          position: relative;
          overflow: hidden;
        }

        .cta-box {
          text-align: center;
          color: var(--dark);
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
          z-index: -1;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cta-box h2 {
          font-family: var(--serif);
          font-size: 3.5rem;
          margin-bottom: 1rem;
          color: var(--dark);
        }

        .cta-box p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: var(--dark);
          opacity: 0.9;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-cta {
          background: var(--dark);
          color: var(--white);
          padding: 1rem 2.5rem;
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
          border: none;
          font-size: 1rem;
        }

        .btn-cta:hover {
          background: var(--white);
          color: var(--dark);
          transform: translateY(-3px);
        }

        .btn-cta-outline {
          background: transparent;
          color: var(--dark);
          padding: 1rem 2.5rem;
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
          border: 2px solid var(--dark);
          font-size: 1rem;
        }

        .btn-cta-outline svg {
          transform: rotate(90deg) !important;
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .btn-cta-outline:hover {
          background: var(--dark);
          color: var(--white);
          transform: translateY(-3px);
        }

        .btn-cta-outline:hover svg {
          transform: rotate(90deg) scale(1.1) !important;
        }

        .cta-info {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-top: 2rem;
          color: var(--dark);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 1024px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: 1fr; }
          .cta-buttons { flex-direction: column; }
          .cta-box h2 { font-size: 2.5rem; }
          .cta-info { flex-direction: column; gap: 1rem; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
          .categories-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .card-image { height: 200px; }
          .cta-box h2 { font-size: 2rem; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hw-hero">
        <div className="hw-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1600"
            alt="Hardware Tools and Equipment"
            style={{
              transform: `scale(1.05) translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          />
        </div>
        <div className="hw-hero__grain" />
        <div className="hw-hero__vignette" />
        <div className="hw-hero__pattern"></div>
        
        <div className="container">
          <div className="hw-hero__content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <div className="hw-hero__badge">
                <FaStore /> Premium Hardware Store
              </div>
            </motion.div>
            
            <motion.h1
              className="hw-hero__title"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Quality <em>Hardware Solutions</em>
            </motion.h1>
            
            <motion.p
              className="hw-hero__desc"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              Complete hardware solutions for all your needs — from door handles
              to adhesives, we have it all under one roof.
            </motion.p>

            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
            >
              <div className="hero-stat">
                <h4>{stats.products}</h4>
                <p>Products</p>
              </div>
              <div className="hero-stat">
                <h4>{stats.brands}</h4>
                <p>Brands</p>
              </div>
              <div className="hero-stat">
                <h4>{stats.clients}</h4>
                <p>Clients</p>
              </div>
            </motion.div>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8 }}
            >
              <Link to="/contact" className="btn-primary">
                Get Free Quote <FaArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="stats-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {statsArray.map((stat, i) => (
              <motion.div 
                key={i}
                className="stat-card"
                variants={fadeInScale}
                whileHover={{ y: -10 }}
              >
                {stat.icon}
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products/Categories Section - WITHOUT TOTAL PRODUCTS */}
      <section className="categories-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <div className="mk-label" style={{ justifyContent: 'center' }}>
              <div className="mk-label-line"></div>
              <span>OUR PRODUCTS</span>
              <div className="mk-label-line"></div>
            </div>
            <h2 className="mk-h2">
              Hardware <em>Range</em>
            </h2>
            <p style={{ color: 'var(--gray-text)', marginTop: '1rem' }}>
              Premium quality hardware products for every construction and interior need
            </p>
            
            {/* 🔥 TOTAL PRODUCTS SECTION HATAYA - YEH LINE DELETE KAR DIYA */}
            {/* <p style={{ fontSize: '1.2rem', color: 'var(--gold)', marginTop: '0.5rem' }}>
              Total {products.length} Products Available
            </p> */}
          </motion.div>

          {!products || products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--gray-text)' }}>
              No products found. Add some from admin panel!
            </div>
          ) : (
            <motion.div 
              className="categories-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {products.map((product, index) => (
                product && (
                  <motion.div
                    key={product.id || index}
                    variants={rotateIn}
                    onHoverStart={() => setActiveCategory(index)}
                    onHoverEnd={() => setActiveCategory(null)}
                  >
                    <div className="category-card">
                      <div className="card-image">
                        <img 
                          src={product.image || 'https://via.placeholder.com/800x600?text=Hardware'} 
                          alt={product.name || 'Hardware Product'} 
                          onError={handleImageError} 
                        />
                        <div
                          className="card-icon"
                          style={{ background: product.color || '#c9a96e' }}
                        >
                          {product.icon || <FaWrench />}
                        </div>
                        {product.isAdminAdded && (
                          <div className="admin-badge-small">Admin</div>
                        )}
                      </div>
                      <div className="card-content">
                        <div className="card-number">0{index + 1}</div>
                        <h3 className="card-title">{product.name || 'Hardware Product'}</h3>
                        <p className="card-desc">{product.description || 'Premium quality hardware'}</p>
                        <div className="card-pills">
                          {product.features?.slice(0, 3).map((f, i) => (
                            <span key={i} className="pill">{f}</span>
                          ))}
                        </div>
                        <div className="card-cta">
                          <span>View Details</span>
                          <FaArrowRight />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials__bg-text" aria-hidden="true">Reviews</div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mk-label">
              <div className="mk-label-line" />
              <span>Client Stories</span>
            </div>
            <h2 className="mk-h2 mk-h2--light">
              What Our Clients <em>Say</em>
            </h2>
          </motion.div>

          <motion.div
            className="testimonials-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="testimonial-card"
                variants={fadeInUp}
                whileHover={{ y: -8 }}
              >
                <div className="testimonial__quote"><FaQuoteLeft /></div>
                <div className="testimonial__stars">
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} />)}
                </div>
                <p className="testimonial__text">"{t.text}"</p>
                <div className="testimonial__divider" />
                <div className="testimonial__name">{t.name}</div>
                <div className="testimonial__role">{t.role}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-box"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Need Hardware Solutions?</h2>
            <p>Visit our store for premium quality hardware products</p>
            
            <div className="cta-buttons">
              <Link to="/contact" className="btn-cta">
                Get Free Quote <FaArrowRight />
              </Link>
              <a href="tel:+917328019093" className="btn-cta-outline">
                <FaPhone /> Call Now
              </a>
            </div>

            <div className="cta-info">
              <div className="info-item">
                <FaStore /> Bombay Chowk, Jharsuguda
              </div>
              <div className="info-item">
                <FaClock /> Open 9AM - 9PM
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hardware;