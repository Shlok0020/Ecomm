// src/pages/Plywood/Plywood.jsx - COMPLETE FIXED VERSION WITH DATA FLOW
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaArrowRight, 
  FaWhatsapp, 
  FaPhone,
  FaStore,
  FaStar,
  FaCheckCircle,
  FaTree,
  FaRuler,
  FaTag,
  FaIndustry,
  FaLeaf,
  FaGem,
  FaAward,
  FaClock,
  FaUsers,
  FaRulerCombined,
  FaRegHeart,
  FaEye,
  FaShieldAlt,
  FaFire,
  FaWater
} from 'react-icons/fa';
import plywoodService from '../services/plywoodService';
import toast from 'react-hot-toast';

const Plywood = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [activeProduct, setActiveProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    products: '1000+',
    brands: '50+',
    clients: '2000+',
    years: '10+'
  });
  
  const heroRef = useRef(null);

  // ============= DATA FLOW: Admin → Backend → Database → Frontend =============
  
  const fetchProducts = async (showToast = false) => {
    console.log('🔵 Fetching plywood products from database...');
    setLoading(true);
    setError(null);
    
    try {
      // Clear cache to get fresh data
      
      // Check localStorage directly (for debugging)
      const localData = localStorage.getItem('plywood_admin_products');
      console.log('📦 LOCALSTORAGE plywood_admin_products:', localData ? JSON.parse(localData) : '[]');
      
      const response = await plywoodService.getAll();
      console.log('📦 All products from database:', response.data);
      
      // Make sure response.data is an array
      const allProducts = Array.isArray(response.data) ? response.data : [];
      
      // 🔥 FIX: Better filtering for plywood products
      const plywoodProducts = allProducts.filter(p => {
        if (!p) return false;
        
        // Agar product already plywood category mein hai
        if (p.category && p.category.toLowerCase() === 'plywood') return true;
        
        // Agar grade set hai to plywood hi hoga
        if (p.grade && ['premium', 'commercial', 'marine', 'bwp', 'mr', 'fire', 'standard'].includes(p.grade.toLowerCase())) return true;
        
        // Agar category plywood related hai
        if (p.category && ['premium', 'commercial', 'marine', 'bwp', 'mr', 'fire', 'standard'].includes(p.category.toLowerCase())) return true;
        
        // Name mein ply hai to
        if (p.name && p.name.toLowerCase().includes('ply')) return true;
        
        // Description mein plywood hai to
        if (p.description && p.description.toLowerCase().includes('plywood')) return true;
        
        // Brand mein ply related hai to
        if (p.brand && (
          p.brand.toLowerCase().includes('ply') || 
          p.brand.toLowerCase().includes('green') || 
          p.brand.toLowerCase().includes('century') ||
          p.brand.toLowerCase().includes('kitply')
        )) return true;
        
        return false;
      });
      
      console.log('✅ Filtered plywood products:', plywoodProducts);
      console.log('👑 Admin plywood products:', plywoodProducts.filter(p => p.isAdminAdded).length);
      
      setProducts(plywoodProducts);
      
      // Update stats based on actual data
      const productCount = plywoodProducts.length;
      setStats({
        products: productCount > 0 ? productCount + '+' : '1000+',
        brands: '50+',
        clients: productCount > 0 ? (productCount * 2) + '+' : '2000+',
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
    console.log('🟣 Plywood component mounted');
    fetchProducts();
    
    // ============= REAL-TIME UPDATES WHEN ADMIN CHANGES DATA =============
    
    // Listen for storage events (when admin makes changes in another tab)
    const handleStorageChange = (e) => {
      console.log('🟡 Storage changed in Plywood:', e.key);
      if (e.key === 'plywood_admin_products' || 
          e.key === 'plywood_products' || 
          e.key === null) {
        fetchProducts(true);
      }
    };
    
    // Listen for custom events (when admin makes changes in same tab)
    const handleProductsUpdated = () => {
      console.log('🟡 Products updated event in Plywood');
      fetchProducts(true);
    };
    
    const handlePlywoodProductsUpdated = () => {
      console.log('🟡 Plywood products updated event');
      fetchProducts(true);
    };
    
    // Mouse move effect
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
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleProductsUpdated);
    window.addEventListener('plywoodProductsUpdated', handlePlywoodProductsUpdated);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleProductsUpdated);
      window.removeEventListener('plywoodProductsUpdated', handlePlywoodProductsUpdated);
    };
  }, []);

  // Filter products based on selected grade
  const filteredProducts = selectedGrade === 'all' 
    ? products
    : products.filter(p => {
        if (!p.grade && !p.category) return false;
        const grade = (p.grade || p.category || '').toLowerCase();
        return grade === selectedGrade.toLowerCase();
      });

  const grades = [
    { value: 'all', label: 'All Grades', color: '#c9a96e' },
    { value: 'premium', label: 'Premium Grade', color: '#c45a5a' },
    { value: 'commercial', label: 'Commercial Grade', color: '#4f8a8b' },
    { value: 'marine', label: 'Marine Grade', color: '#2c3e50' }
  ];

  const statsArray = [
    { value: stats.products, label: 'Products', icon: <FaTree /> },
    { value: stats.brands, label: 'Brands', icon: <FaIndustry /> },
    { value: stats.clients, label: 'Clients', icon: <FaUsers /> },
    { value: stats.years, label: 'Years', icon: <FaAward /> }
  ];

  const heroFeatures = [
    { icon: <FaShieldAlt />, text: 'IS:710 Certified' },
    { icon: <FaWater />, text: '100% Waterproof' },
    { icon: <FaFire />, text: 'Fire Retardant' },
    { icon: <FaLeaf />, text: 'Eco-Friendly' }
  ];

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/500x300?text=Plywood+Product';
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  // Debug button (optional - remove in production)
  const DebugButton = () => (
    <button
      onClick={() => {
        console.log('🔍 Current products:', products);
        console.log('📦 LocalStorage:', localStorage.getItem('plywood_admin_products'));
        fetchProducts(true);
        alert('Check console (F12) for data');
      }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '10px 20px',
        background: '#bd7b4d',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      🔍 Debug
    </button>
  );

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
          borderTop: '4px solid #bd7b4d',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontFamily: 'Jost, sans-serif', color: '#666' }}>Loading plywood products from database...</p>
        <DebugButton />
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
        <DebugButton />
        <button 
          onClick={() => fetchProducts(true)}
          style={{
            padding: '12px 30px',
            background: '#bd7b4d',
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
    <div className="plywood-page">
      {/* Last Updated Indicator - Small and subtle */}
      {!loading && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
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
              color: '#bd7b4d',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Refresh from database"
          >
            ↻
          </button>
        </div>
      )}
      
      <DebugButton />
      
      <Helmet>
        <title>Premium Plywood Dealers in Jharsuguda | Marine, BWP, Commercial Plywood | New Prem Glass House</title>
        <meta name="description" content="Shop premium plywood at New Prem Glass House in Jharsuguda. We offer marine plywood, BWP grade, commercial plywood, fire retardant ply, and more from top brands like Century, Greenply, Kitply. 1000+ products available." />
        <meta name="keywords" content="plywood dealers Jharsuguda, marine plywood Jharsuguda, BWP plywood Jharsuguda, commercial plywood Jharsuguda, Century plywood Jharsuguda, Greenply Jharsuguda, Kitply Jharsuguda, fire retardant plywood, waterproof plywood Odisha" />
        <link rel="canonical" href="https://newpremglasshouse.com/plywood" />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        * {
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
          --shadow-gold: 0 20px 40px rgba(201, 169, 110, 0.15);
          
          /* Plywood specific colors - warm wood tones */
          --wood-light: #bd7b4d;
          --wood-dark: #8b5a2b;
          --wood-grain: #a5673f;
        }

        body {
          font-family: var(--sans);
          background: var(--warm-white);
          color: var(--dark);
          overflow-x: hidden;
        }

        .plywood-page {
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

        /* Hero Section */
        .plywood-hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 120px 0 100px;
          margin-top: -60px;
          background: var(--black);
        }

        .plywood-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .plywood-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.55;
          transform-origin: center;
          transition: transform 0.1s linear;
          will-change: transform;
        }

        .plywood-hero__grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
          z-index: 1;
          pointer-events: none;
        }

        .plywood-hero__vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.92) 0%,
            rgba(0,0,0,0.5) 40%,
            rgba(0,0,0,0.15) 70%,
            transparent 100%
          );
          z-index: 2;
        }

        .plywood-hero__content {
          position: relative;
          z-index: 3;
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
          transform: translateY(60px);
        }

        .plywood-hero__badge {
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

        .plywood-hero__title {
          font-family: var(--serif);
          font-size: clamp(3.5rem, 8vw, 5.5rem);
          font-weight: 300;
          color: var(--white);
          margin-bottom: 1.5rem;
          line-height: 1;
        }

        .plywood-hero__title em {
          font-style: italic;
          color: var(--gold);
        }

        .plywood-hero__desc {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.8);
          max-width: 700px;
          margin: 0 auto 2rem;
          line-height: 1.8;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .hero-stat {
          text-align: center;
          min-width: 120px;
        }

        .hero-stat h4 {
          font-family: var(--serif);
          font-size: 2.5rem;
          color: var(--gold);
          margin-bottom: 0.3rem;
        }

        .hero-stat p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hero-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 3rem 0 2rem;
          flex-wrap: wrap;
        }

        .hero-feature {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1.5rem;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--white);
        }

        .hero-feature svg {
          color: var(--gold);
          font-size: 1.2rem;
        }

        .hero-feature span {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .hero-btn-primary {
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

        .hero-btn-primary:hover {
          background: var(--white);
          transform: translateY(-3px);
          box-shadow: var(--shadow-gold);
        }

        .hero-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2.5rem;
          background: transparent;
          color: var(--white);
          border: 2px solid var(--gold);
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .hero-btn-outline svg {
          transform: rotate(90deg) !important;
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .hero-btn-outline:hover {
          background: var(--gold);
          color: var(--dark);
          transform: translateY(-3px);
        }

        .hero-btn-outline:hover svg {
          transform: rotate(90deg) scale(1.1) !important;
        }

        .stats-section {
          padding: 80px 0;
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
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

        .filters-section {
          padding: 40px 0;
        }

        .filter-wrapper {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.8rem 2rem;
          border: none;
          border-radius: 40px;
          background: var(--white);
          color: var(--dark);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-sm);
          font-size: 1rem;
          font-family: var(--sans);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .filter-btn:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-gold);
          color: var(--gold);
        }

        .filter-btn.active {
          background: var(--gold);
          color: var(--white);
          border-color: var(--gold);
        }

        .products-section {
          padding: 60px 0 100px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          margin-top: 3rem;
        }

        .product-card {
          background: var(--white);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid rgba(0,0,0,0.02);
        }

        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-gold);
        }

        .product-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--gold);
          color: var(--white);
          padding: 0.4rem 1.2rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 2;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-image {
          height: 250px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .product-card:hover .product-image img {
          transform: scale(1.1);
        }

        .product-content {
          padding: 25px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-content h3 {
          font-family: var(--serif);
          font-size: 1.5rem;
          margin-bottom: 0.8rem;
          color: var(--dark);
          line-height: 1.3;
        }

        .brand {
          color: var(--wood-dark);
          font-weight: 600;
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .brand svg {
          color: var(--gold);
        }

        .product-content p {
          color: var(--gray-text);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .thickness {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0 1.5rem;
          flex-shrink: 0;
        }

        .thickness .badge {
          background: var(--cream);
          padding: 0.3rem 0.8rem;
          border-radius: 30px;
          font-size: 0.7rem;
          color: var(--gray-text);
          font-weight: 500;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .price-container {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          font-weight: bold;
          color: var(--wood-light);
          font-size: 1.2rem;
        }

        .mrp {
          color: var(--gray-text);
          text-decoration: line-through;
          font-size: 0.9rem;
        }

        .cta-section {
          padding: 80px 0;
        }

        .cta-box {
          background: linear-gradient(135deg, var(--wood-light), var(--wood-dark));
          border-radius: 40px;
          padding: 80px;
          text-align: center;
          color: var(--white);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .cta-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cta-content {
          position: relative;
          z-index: 2;
        }

        .cta-box h2 {
          font-family: var(--serif);
          font-size: 3.5rem;
          margin-bottom: 1rem;
          color: var(--white);
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .cta-box p {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          opacity: 1;
          color: var(--white);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
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
          box-shadow: var(--shadow-gold);
        }

        .btn-cta-outline {
          background: transparent;
          color: var(--white);
          padding: 1rem 2.5rem;
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
          border: 2px solid var(--white);
          font-size: 1rem;
        }

        .btn-cta-outline svg {
          transform: rotate(90deg) !important;
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .btn-cta-outline:hover {
          background: var(--white);
          color: var(--wood-dark);
          transform: translateY(-3px);
        }

        .btn-cta-outline:hover svg {
          transform: rotate(90deg) scale(1.1) !important;
        }

        @media (max-width: 1200px) {
          .products-grid { grid-template-columns: repeat(3, 1fr); }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-features { gap: 1rem; }
        }

        @media (max-width: 768px) {
          .plywood-hero { 
            min-height: 80vh; 
            padding: 100px 0 60px;
            margin-top: -80px;
          }
          
          .plywood-hero__title { font-size: 3rem; }
          
          .plywood-hero__content {
            transform: translateY(80px);
          }
          
          .hero-stats { 
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin: 2rem 0;
          }
          
          .hero-stat {
            min-width: auto;
          }
          
          .hero-stat h4 {
            font-size: 2rem;
          }
          
          .hero-features { 
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          
          .hero-feature {
            padding: 0.6rem 1rem;
          }
          
          .hero-feature span {
            font-size: 0.8rem;
          }
          
          .hero-buttons { 
            flex-direction: column; 
            align-items: center; 
          }
          
          .hero-btn-primary, .hero-btn-outline {
            width: 100%;
            justify-content: center;
          }
          
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .filter-wrapper { gap: 0.8rem; }
          .filter-btn { padding: 0.6rem 1.5rem; font-size: 0.9rem; }
          .cta-buttons { flex-direction: column; }
          .cta-box { padding: 40px 20px; }
          .cta-box h2 { font-size: 2.2rem; }
        }

        @media (max-width: 480px) {
          .plywood-hero {
            margin-top: -70px;
          }
          
          .plywood-hero__title { font-size: 2.5rem; }
          
          .plywood-hero__content {
            transform: translateY(60px);
          }
          
          .hero-stat h4 {
            font-size: 1.8rem;
          }
          
          .hero-stat p {
            font-size: 0.8rem;
          }
          
          .hero-features { 
            grid-template-columns: 1fr; 
          }
          
          .products-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: 1fr; }
          .product-image { height: 200px; }
        }
        
        @media (max-width: 360px) {
          .plywood-hero {
            margin-top: -60px;
          }
          
          .plywood-hero__content {
            transform: translateY(40px);
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="plywood-hero">
        <div className="plywood-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1600"
            alt="Premium Plywood"
            style={{
              transform: `scale(1.05) translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          />
        </div>
        <div className="plywood-hero__grain" />
        <div className="plywood-hero__vignette" />

        <div className="container">
          <div className="plywood-hero__content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="plywood-hero__badge">
                <FaLeaf /> Premium Plywood Store
              </div>
            </motion.div>
            
            <motion.h1
              className="plywood-hero__title"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Premium <em>Plywood</em>
            </motion.h1>
            
            <motion.p
              className="plywood-hero__desc"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              India's most trusted plywood brand with 50+ years of excellence. 
              We offer a wide range of premium plywood products for every application.
            </motion.p>

            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
              <div className="hero-stat">
                <h4>{stats.years}</h4>
                <p>Years</p>
              </div>
            </motion.div>

            <motion.div 
              className="hero-features"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {heroFeatures.map((feature, index) => (
                <div key={index} className="hero-feature">
                  {feature.icon}
                  <span>{feature.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/contact" className="hero-btn-primary">
                <span>Get Free Quote</span>
                <FaArrowRight />
              </Link>
              <a href="tel:+917328019093" className="hero-btn-outline">
                <span>Call Now</span>
                <FaPhone />
              </a>
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

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <motion.div 
            className="filter-wrapper"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {grades.map(grade => (
              <motion.button
                key={grade.value}
                className={`filter-btn ${selectedGrade === grade.value ? 'active' : ''}`}
                onClick={() => setSelectedGrade(grade.value)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {grade.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
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
              <span>OUR COLLECTION</span>
              <div className="mk-label-line"></div>
            </div>
            <h2 className="mk-h2">
              Premium <em>Plywood Range</em>
            </h2>
            <p style={{ color: 'var(--gray-text)', marginTop: '1rem' }}>
              High-quality plywood for every need, from commercial to premium grades
            </p>
            
            {/* Product count */}
            <div style={{ 
              marginTop: '20px',
              padding: '10px 20px',
              background: 'rgba(189,123,77,0.1)',
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem' }}>
                Total Products: <strong style={{ color: 'var(--wood-light)' }}>
                  {products.length}
                </strong>
                {products.filter(p => p.isAdminAdded).length > 0 && (
                  <span> (New: {products.filter(p => p.isAdminAdded).length})</span>
                )}
              </p>
            </div>
          </motion.div>

          {!products || products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--gray-text)' }}>
              No plywood products found. Add some from admin panel!
            </div>
          ) : (
            <motion.div 
              className="products-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {filteredProducts.map((product, index) => (
                product && (
                  <motion.div 
                    key={product.id || index}
                    className="product-card"
                    variants={fadeInScale}
                    whileHover={{ y: -10 }}
                    onHoverStart={() => setActiveProduct(product.id)}
                    onHoverEnd={() => setActiveProduct(null)}
                  >
                    <div className="product-badge">
                      {product.grade === 'premium' ? 'Premium' : 
                       product.grade === 'commercial' ? 'Commercial' : 
                       product.grade === 'marine' ? 'Marine' : 
                       product.grade === 'bwp' ? 'BWP' :
                       product.grade === 'mr' ? 'MR' :
                       product.grade || product.category || 'Premium'}
                    </div>
                    <div className="product-image">
                      <img 
                        src={product.image || 'https://via.placeholder.com/500x300?text=Plywood'} 
                        alt={product.name || 'Plywood Product'}
                        onError={handleImageError}
                        loading="lazy"
                      />
                    </div>
                    <div className="product-content">
                      <h3>{product.name || 'Plywood Product'}</h3>
                      <p className="brand">
                        <FaIndustry /> {product.brand || 'New Prem'}
                      </p>
                      <p>{product.description || 'Premium quality plywood'}</p>
                      <div className="thickness">
                        {product.thickness && Array.isArray(product.thickness) 
                          ? product.thickness.map(t => (
                              <span key={t} className="badge">{t}</span>
                            ))
                          : product.thickness && <span className="badge">{product.thickness}</span>
                        }
                        {!product.thickness && ['4mm', '6mm', '9mm', '12mm', '15mm', '18mm'].map(t => (
                          <span key={t} className="badge">{t}</span>
                        ))}
                      </div>
                      
                      {/* Price section */}
                      <div className="price-container">
                        <span className="price">₹{product.price || 0}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="mrp">₹{product.mrp}</span>
                        )}
                      </div>
                      
                      {product.isAdminAdded && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: '#4caf50',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.6rem',
                          zIndex: 10
                        }}>
                          New
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              ))}
            </motion.div>
          )}
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
            <div className="cta-content">
              <h2>Need Plywood Solutions?</h2>
              <p>Visit our store for premium quality plywood products from top brands</p>
              
              <div className="cta-buttons">
                <Link to="/contact" className="btn-cta">
                  <span>Get Free Quote</span>
                  <FaArrowRight />
                </Link>
                <a href="tel:+917328019093" className="btn-cta-outline">
                  <span>Call Now</span>
                  <FaPhone />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Plywood;