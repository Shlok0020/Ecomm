// src/pages/Interiors/Interiors.jsx - WITH PROPER IMAGE HANDLING
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FaArrowRight,
  FaPhone,
  FaStar,
  FaEye,
  FaRegHeart,
  FaRulerCombined,
  FaQuoteLeft,
  FaCouch,
  FaBed,
  FaTv,
  FaHome,
  FaCheckCircle,
  FaPalette,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
  FaGem,
  FaAward,
  FaUsers,
  FaShoppingCart,
  FaImage
} from 'react-icons/fa';
import interiorService from '../services/interiorService';
import toast from 'react-hot-toast';

// ============= IMAGE URL HELPER =============
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
  return `http://localhost:5000/uploads/${imagePath}`;
};

const handleImageError = (e, fallbackUrl = 'https://via.placeholder.com/800x600/1a1a1a/c9a96e?text=Interior+Project') => {
  e.target.onerror = null;
  e.target.src = fallbackUrl;
};
// ===========================================

const Interiors = () => {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    projects: '500+',
    clients: '1000+',
    years: '10+'
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // ============= DATA FLOW: Admin → Backend → Database → Frontend =============
  
  const fetchProjects = async (showToast = false) => {
    console.log('🔵 Fetching interior projects from database...');
    setLoading(true);
    setError(null);
    
    try {
      const response = await interiorService.getAll();
      console.log('📦 Projects from database:', response.data);
      
      // Make sure response.data is an array
      const allProjects = Array.isArray(response.data) ? response.data : [];
      
      // Process projects to ensure images have full URLs
      const processedProjects = allProjects.map(project => ({
        ...project,
        id: project._id || project.id || `project-${Date.now()}-${Math.random()}`,
        image: getImageUrl(project.image),
        images: project.images ? project.images.map(img => getImageUrl(img)) : []
      }));
      
      // 🔥 FILTER OUT "Shreyyanshi Glass" project
      const filteredProjects = processedProjects.filter(p => {
        if (!p || !p.name) return true;
        const nameLower = p.name.toLowerCase();
        return !nameLower.includes('shreyyanshi') && 
               !nameLower.includes('shreyanshi') && 
               !nameLower.includes('glass house');
      });
      
      console.log('📦 Filtered projects:', filteredProjects.length);
      setProjects(filteredProjects);
      
      // Update stats based on actual data
      const projectCount = filteredProjects.length;
      setStats({
        projects: projectCount > 0 ? projectCount + '+' : '500+',
        clients: projectCount > 0 ? (projectCount * 2) + '+' : '1000+',
        years: '10+'
      });
      
      if (showToast) {
        toast.success('Projects updated from database!');
      }
      
    } catch (error) {
      console.error('🔴 Error fetching projects:', error);
      setError(error.message || 'Failed to load projects');
      setProjects([]);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    console.log('🟣 Interiors component mounted');
    fetchProjects();
    
    // ============= REAL-TIME UPDATES WHEN ADMIN CHANGES DATA =============
    
    // Listen for storage events (when admin makes changes in another tab)
    const handleStorageChange = (e) => {
      console.log('🟡 Storage changed in Interiors:', e.key);
      if (e.key === 'interiors_admin_projects' || 
          e.key === 'interior_products' || 
          e.key === 'interiors_products' ||
          e.key === null) {
        fetchProjects(true);
      }
    };
    
    // Listen for custom events (when admin makes changes in same tab)
    const handleProductsUpdated = () => {
      console.log('🟡 Products updated event in Interiors');
      fetchProjects(true);
    };
    
    const handleInteriorProductsUpdated = () => {
      console.log('🟡 Interior products updated event');
      fetchProjects(true);
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
    window.addEventListener('interiorProductsUpdated', handleInteriorProductsUpdated);
    window.addEventListener('interiorsProductsUpdated', handleInteriorProductsUpdated);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleProductsUpdated);
      window.removeEventListener('interiorProductsUpdated', handleInteriorProductsUpdated);
      window.removeEventListener('interiorsProductsUpdated', handleInteriorProductsUpdated);
    };
  }, []);

  // 🔥 BUY NOW HANDLER
  const handleBuyNow = (project) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      // Redirect to login page
      toast.error('Please login first');
      navigate('/login', { 
        state: { 
          from: '/interiors',
          product: {
            id: project.id,
            name: project.title || project.name || 'Interior Project',
            description: project.description || 'Premium interior design service',
            price: project.price || 0,
            image: project.image,
            category: 'interiors'
          }
        } 
      });
      return;
    }
    
    // If logged in, go to order page
    navigate('/order', { 
      state: { 
        product: {
          id: project.id,
          name: project.title || project.name || 'Interior Project',
          description: project.description || 'Premium interior design service',
          price: project.price || 0,
          image: project.image,
          category: 'interiors'
        }
      } 
    });
  };

  const testimonials = [
    {
      name: 'Rajesh Agarwal',
      role: 'Homeowner',
      text: 'Best interior designers in Jharsuguda! Transformed our home completely with stunning designs.',
      rating: 5,
      location: 'Jharsuguda'
    },
    {
      name: 'Priya Singh',
      role: 'Architect',
      text: 'Exceptional quality of work and modular solutions. Highly recommended!',
      rating: 5,
      location: 'Sambalpur'
    },
    {
      name: 'Amit Kumar',
      role: 'Builder',
      text: 'Working with them for 5+ years. Consistent quality and professional service.',
      rating: 5,
      location: 'Rourkela'
    }
  ];

  // Stats array with real data
  const statsArray = [
    { value: stats.projects, label: 'Projects', icon: <FaAward /> },
    { value: stats.clients, label: 'Clients', icon: <FaUsers /> },
    { value: stats.years, label: 'Years', icon: <FaClock /> }
  ];

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

  if (loading && projects.length === 0) {
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
        <p style={{ fontFamily: 'Jost, sans-serif', color: '#666' }}>Loading interior projects...</p>
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
          onClick={() => fetchProjects(true)}
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
    <div className="int-page">
      {/* REMOVED: Last Updated Indicator - Fixed position refresh button */}
      
      <Helmet>
        <title>Premium Interior Designers in Jharsuguda | Modular Kitchen, Bedroom & Home Interiors | New Prem Glass House</title>
        <meta name="description" content="Transform your space with New Prem Glass House interior designers in Jharsuguda. We specialize in modular kitchens, bedroom interiors, TV units, and full home interiors. 500+ projects completed." />
        <meta name="keywords" content="interior designers Jharsuguda, modular kitchen Jharsuguda, bedroom interior Jharsuguda, TV unit design Jharsuguda, home interior Jharsuguda, best interior designers Odisha, false ceiling Jharsuguda, wardrobe design Jharsuguda" />
        <link rel="canonical" href="https://newpremglasshouse.com/interiors" />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        *, *::before, *::after {
          margin: 0; padding: 0; box-sizing: border-box;
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

        .int-page {
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

        .mk-h2--light { 
          color: var(--white); 
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .mk-h2 em { font-style: italic; color: var(--gold); }

        /* Hero Section */
        .int-hero {
          position: relative;
          min-height: 80vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 120px 0 80px;
          background: var(--dark);
        }

        .int-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .int-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
          transform-origin: center;
          transition: transform 0.1s linear;
          will-change: transform;
        }

        .int-hero__grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
          z-index: 1;
          pointer-events: none;
        }

        .int-hero__vignette {
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

        .int-hero__pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 30%, rgba(201, 169, 110, 0.15) 0px, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .int-hero__content {
          position: relative;
          z-index: 3;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .int-hero__badge {
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

        .int-hero__title {
          font-family: var(--serif);
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 300;
          color: var(--white);
          margin-bottom: 1.5rem;
          line-height: 1;
        }

        .int-hero__title em {
          font-style: italic;
          color: var(--gold);
        }

        .int-hero__desc {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.8);
          max-width: 700px;
          margin: 0 auto 2rem;
          line-height: 1.8;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
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
          color: rgba(255,255,255,0.7);
        }

        /* Stats Section */
        .stats-section {
          padding: 80px 0;
          background: var(--white);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 1000px;
          margin: 0 auto;
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

        /* Gallery Section */
        .gallery-section {
          padding: 60px 0 100px;
          background: var(--white);
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 3rem;
        }

        .gallery-item {
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

        .gallery-item:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-gold);
        }

        .item-image {
          position: relative;
          height: 320px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .gallery-item:hover .item-image img {
          transform: scale(1.1);
        }

        .item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.9) 0%,
            rgba(0,0,0,0.4) 50%,
            transparent 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 25px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .gallery-item:hover .item-overlay {
          opacity: 1;
        }

        .item-category {
          font-family: var(--sans);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 8px;
          transform: translateY(20px);
          transition: transform 0.4s ease 0.1s;
        }

        .item-title {
          font-family: var(--serif);
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 10px;
          transform: translateY(20px);
          transition: transform 0.4s ease 0.15s;
        }

        .item-meta {
          display: flex;
          gap: 15px;
          transform: translateY(20px);
          transition: transform 0.4s ease 0.2s;
        }

        .item-meta span {
          display: flex;
          align-items: center;
          gap: 5px;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
        }

        .gallery-item:hover .item-category,
        .gallery-item:hover .item-title,
        .gallery-item:hover .item-meta {
          transform: translateY(0);
        }

        .item-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 12px;
          transform: translateY(20px);
          transition: transform 0.4s ease 0.25s;
        }

        .gallery-item:hover .item-features {
          transform: translateY(0);
        }

        .feature-pill {
          background: rgba(201, 169, 110, 0.15);
          color: var(--gold);
          padding: 2px 8px;
          border-radius: 30px;
          font-size: 0.6rem;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .item-view-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1rem;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.4s ease;
          z-index: 3;
        }

        .gallery-item:hover .item-view-btn {
          opacity: 1;
          transform: scale(1);
        }

        /* 🔥 BUY NOW BUTTON STYLES */
        .btn-buy-now-small {
          background: #28a745;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 0.5rem 1.2rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          margin: 1rem 1rem 1rem 0;
          z-index: 10;
        }

        .btn-buy-now-small:hover {
          background: #218838;
          transform: scale(1.05);
        }

        .project-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: white;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .project-price {
          font-weight: bold;
          color: var(--gold);
          font-size: 1.1rem;
        }

        .admin-badge-small {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: #4caf50;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.6rem;
          z-index: 3;
        }

        /* Testimonials Section */
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

        .testimonial__quote-icon {
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

        .testimonial__location {
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
        }

        /* CTA Section */
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

        .btn-cta-outline:hover {
          background: var(--dark);
          color: var(--white);
          transform: translateY(-3px);
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

        /* Responsive */
        @media (max-width: 1200px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-grid { grid-template-columns: repeat(3, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 1024px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .int-hero { min-height: 70vh; padding: 100px 0 60px; }
          .int-hero__title { font-size: 3rem; }
          .hero-stats { flex-direction: column; gap: 1.5rem; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: 1fr; }
          .filter-wrapper { gap: 0.8rem; }
          .filter-btn { padding: 0.6rem 1.5rem; font-size: 0.9rem; }
          .cta-buttons { flex-direction: column; }
          .cta-box h2 { font-size: 2.5rem; }
          .cta-info { flex-direction: column; gap: 1rem; }
        }

        @media (max-width: 480px) {
          .int-hero__title { font-size: 2.2rem; }
          .gallery-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: 1fr; }
          .item-image { height: 250px; }
          .cta-box h2 { font-size: 2rem; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="int-hero">
        <div className="int-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"
            alt="Luxury Interior Design"
            style={{
              transform: `scale(1.05) translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          />
        </div>
        <div className="int-hero__grain" />
        <div className="int-hero__vignette" />
        <div className="int-hero__pattern"></div>
        
        <div className="container">
          <div className="int-hero__content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <div className="int-hero__badge">
                <FaGem /> Since 2010
              </div>
            </motion.div>
            
            <motion.h1
              className="int-hero__title"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Creating Beautiful <em>Interiors</em>
            </motion.h1>
            
            <motion.p
              className="int-hero__desc"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              Transforming houses into dream homes with innovative design, 
              premium materials, and expert craftsmanship.
            </motion.p>

            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
            >
              <div className="hero-stat">
                <h4>{stats.projects}</h4>
                <p>Projects</p>
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

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="mk-label" style={{ justifyContent: 'center' }}>
              <div className="mk-label-line"></div>
              <span>OUR PORTFOLIO</span>
              <div className="mk-label-line"></div>
            </div>
            <h2 className="mk-h2">
              Interior <em>Projects</em>
            </h2>
            <p style={{ color: 'var(--gray-text)', marginTop: '1rem' }}>
              Explore our latest interior design work across various categories
            </p>
          </div>

          {!projects || projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--gray-text)' }}>
              No projects found. Add some from admin panel!
            </div>
          ) : (
            <motion.div 
              className="gallery-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {projects.map((project) => (
                project && (
                  <motion.div 
                    key={project.id}
                    className="gallery-item"
                    variants={fadeInScale}
                    whileHover={{ y: -10 }}
                    onHoverStart={() => setActiveProject(project.id)}
                    onHoverEnd={() => setActiveProject(null)}
                  >
                    <div className="item-image">
                      <img 
                        src={getImageUrl(project.image) || 'https://via.placeholder.com/800x600/1a1a1a/c9a96e?text=Interior+Project'} 
                        alt={project.title || project.name || 'Interior Project'}
                        onError={(e) => handleImageError(e)}
                        loading="lazy"
                      />
                      
                      <AnimatePresence>
                        {activeProject === project.id && (
                          <motion.div 
                            className="item-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="item-category">{project.categoryLabel || project.category || 'Interior'}</div>
                            <h3 className="item-title">{project.title || project.name || 'Interior Project'}</h3>
                            <div className="item-meta">
                              <span><FaRulerCombined /> {project.area || project.size || 'N/A'}</span>
                              <span><FaRegHeart /> {project.likes || 0}</span>
                              <span><FaEye /> {project.views || 0}</span>
                            </div>
                            <div className="item-features">
                              {project.features?.slice(0, 2).map((feature, i) => (
                                <span key={i} className="feature-pill">{feature}</span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="item-view-btn">
                        <FaEye />
                      </div>
                      
                      {project.isAdminAdded && (
                        <div className="admin-badge-small">Admin</div>
                      )}
                    </div>
                    
                    {/* 🔥 BUY NOW BUTTON */}
                    <div className="project-footer">
                      <span className="project-price">₹{project.price || 0}</span>
                      <motion.button
                        className="btn-buy-now-small"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(project);
                        }}
                      >
                        <FaShoppingCart /> Book Now
                      </motion.button>
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
                <div className="testimonial__quote-icon">
                  <FaQuoteLeft />
                </div>
                <div className="testimonial__stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <FaStar key={j} />
                  ))}
                </div>
                <p className="testimonial__text">"{t.text}"</p>
                <div className="testimonial__divider" />
                <div className="testimonial__name">{t.name}</div>
                <div className="testimonial__role">{t.role}</div>
                <div className="testimonial__location">{t.location}</div>
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
            <h2>Ready to Transform Your Space?</h2>
            <p>Let's bring your vision to life with our expert interior design services</p>
            
            <div className="cta-buttons">
              <Link to="/contact" className="btn-cta">
                Get Free Consultation <FaArrowRight />
              </Link>
              <a href="tel:+917328019093" className="btn-cta-outline">
                <FaPhone /> Call Now
              </a>
            </div>

            <div className="cta-info">
              <div className="info-item">
                <FaMapMarkerAlt /> Bombay Chowk, Jharsuguda
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

export default Interiors;