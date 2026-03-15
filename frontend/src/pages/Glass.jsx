// src/pages/Glass/Glass.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaArrowRight, 
  FaPhone,
  FaStore,
  FaCheckCircle,
  FaGlassCheers,
  FaWindowMaximize,
  FaImages,
  FaThLarge,
  FaArrowLeft,
  FaGem,
  FaShieldAlt,
  FaFire,
  FaWater,
  FaSun
} from 'react-icons/fa';
import glassService from '../services/glassService';
import toast from 'react-hot-toast';

// 🔥 CategoryGrid Component (BILKUL SAME)
const CategoryGrid = ({ categories, onCategoryClick }) => {
  const containerRef = useRef(null);
  const isContainerInView = useInView(containerRef, { once: true, amount: 0.1 });
  
  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -15 }
  };

  const iconRotate = {
    rest: { rotate: 0 },
    hover: { rotate: 360 }
  };

  const imageZoom = {
    rest: { scale: 1 },
    hover: { scale: 1.15 }
  };

  const lineExpand = {
    rest: { width: 60 },
    hover: { width: 100 }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="categories-grid"
      variants={staggerContainer}
      initial="hidden"
      animate={isContainerInView ? "visible" : "hidden"}
    >
      {categories.map((category, index) => {
        const cardRef = useRef(null);
        const isCardInView = useInView(cardRef, { once: true, amount: 0.3 });
        
        return (
          <motion.div
            key={category.id}
            ref={cardRef}
            variants={fadeInScale}
            initial="hidden"
            animate={isCardInView ? "visible" : "hidden"}
            whileHover="hover"
            onClick={() => onCategoryClick(category.id)}
          >
            <motion.div 
              className="category-card"
              variants={cardHover}
              initial="rest"
              whileHover="hover"
            >
              <div className="card-media">
                <motion.img 
                  src={category.image} 
                  alt={category.title} 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=500';
                  }}
                  variants={imageZoom}
                  initial="rest"
                  whileHover="hover"
                />
                <div className="card-overlay"></div>
                <motion.div 
                  className="card-icon-badge"
                  variants={iconRotate}
                  initial="rest"
                  whileHover="hover"
                >
                  {category.icon}
                </motion.div>
              </div>
              <div className="card-content">
                <motion.div 
                  className="card-number"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isCardInView ? { opacity: 0.1, x: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  0{index + 1}
                </motion.div>
                <motion.h3 
                  className="card-title"
                  initial={{ opacity: 0 }}
                  animate={isCardInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 }}
                >
                  {category.title}
                  <motion.div 
                    className="card-title::after"
                    variants={lineExpand}
                    initial="rest"
                    whileHover="hover"
                  />
                </motion.h3>
                <motion.p 
                  className="card-description"
                  initial={{ opacity: 0 }}
                  animate={isCardInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  {category.description}
                </motion.p>
                <motion.div 
                  className="card-features"
                  variants={staggerContainer}
                  initial="hidden"
                  animate={isCardInView ? "visible" : "hidden"}
                >
                  {category.features.map((feature, i) => (
                    <motion.span 
                      key={i} 
                      className="card-feature"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaCheckCircle /> {feature}
                    </motion.span>
                  ))}
                </motion.div>
                <div className="card-footer">
                  <motion.span 
                    className="card-link"
                    whileHover={{ x: 5 }}
                  >
                    Explore <FaArrowRight />
                  </motion.span>
                  <motion.span 
                    className="card-price-tag"
                    whileHover={{ scale: 1.05 }}
                  >
                    {category.types?.length || 0} Products
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const Glass = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [glassCategories, setGlassCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);

  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / maxScroll) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ============= DATA FLOW: Admin → Backend → Database → Frontend → User =============
  
  // Fetch glass categories from backend via service
  const fetchGlassCategories = async (showToast = false) => {
    console.log('🔵 Fetching glass data from backend...');
    setLoading(true);
    setError(null);
    
    try {
      // Clear cache to get fresh data from database
     
      
      // 1️⃣ Get ALL products from database (added by admin)
      const response = await glassService.getAll();
      const products = response?.data || [];
      console.log('📦 Products from database:', products);
      
      // 2️⃣ Get categories from database
      const dbCategories = await glassService.getAllCategories();
      console.log('📚 Categories from database:', dbCategories);
      
      // 3️⃣ Default categories (fallback)
      const defaultCats = [
        { id: 'window', label: 'Window Glass', color: '#4f8a8b' },
        { id: 'mirror', label: 'Mirror Glass', color: '#bd7b4d' },
        { id: 'fluted', label: 'Fluted Glass', color: '#c45a5a' },
        { id: 'toughened', label: 'Toughened Glass', color: '#6a4e8c' }
      ];
      
      // 4️⃣ Merge database categories with defaults
      let categoriesToUse = [];
      
      if (dbCategories && dbCategories.length > 0) {
        // Use categories from database first
        categoriesToUse = dbCategories.map(cat => ({
          id: cat.id || cat.name?.toLowerCase().replace(/\s+/g, '_'),
          label: cat.name || cat.label,
          color: cat.color || getCategoryColor(cat.id || cat.name),
          description: cat.description || ''
        }));
      }
      
      // Add default categories if missing
      defaultCats.forEach(defCat => {
        if (!categoriesToUse.some(c => c.id === defCat.id)) {
          categoriesToUse.push(defCat);
        }
      });
      
      // 5️⃣ Map products to categories (DATA FROM DATABASE)
      const categoriesWithProducts = categoriesToUse.map(cat => {
        // Filter products that belong to this category
        const categoryProducts = products.filter(p => 
          p.category && 
          (p.category.toLowerCase() === cat.id.toLowerCase() || 
           p.category.toLowerCase() === cat.label?.toLowerCase())
        );
        
        // Also include products with custom categories
        const customProducts = products.filter(p => 
          p.category && 
          !defaultCats.some(dc => dc.id === p.category.toLowerCase()) &&
          p.category.toLowerCase() === cat.id.toLowerCase()
        );
        
        const allProducts = [...categoryProducts, ...customProducts];
        
        return {
          id: cat.id,
          title: cat.label || cat.title || cat.id,
          icon: getCategoryIcon(cat.id),
          description: cat.description || `Premium quality ${cat.label?.toLowerCase() || 'glass'} products`,
          image: allProducts[0]?.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
          color: cat.color || getCategoryColor(cat.id),
          features: ['Premium Quality', 'Durable', 'Beautiful Finish'],
          types: allProducts.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            image: p.image,
            price: p.price,
            mrp: p.mrp,
            stock: p.stock,
            thickness: p.thickness,
            size: p.size,
            brand: p.brand,
            isAdminAdded: true, // All products from database are admin added
            createdAt: p.createdAt
          }))
        };
      });

      console.log('🏷️ Final categories with products:', categoriesWithProducts);
      setGlassCategories(categoriesWithProducts);
      setLastUpdated(new Date().toLocaleTimeString());
      
      if (showToast) {
        toast.success('Products updated from database!');
      }
      
    } catch (error) {
      console.error('🔴 Error fetching from database:', error);
      setError(error.message || 'Failed to load products');
      toast.error('Failed to load products from server');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    console.log('🟣 Glass component mounted - fetching from database');
    fetchGlassCategories();
    
    // ============= REAL-TIME UPDATES WHEN ADMIN CHANGES DATA =============
    
    // Listen for storage events (when admin makes changes in another tab)
    const handleStorageChange = (e) => {
      console.log('🟡 Storage changed - admin updated data:', e.key);
      if (e.key === 'glass_products' || e.key === 'glass_categories' || e.key === null) {
        console.log('🔄 Fetching fresh data from database due to admin change');
        fetchGlassCategories(true);
      }
    };
    
    // Listen for custom events (when admin makes changes in same tab)
    const handleProductsUpdated = () => {
      console.log('🟡 Products updated event - admin changed data');
      fetchGlassCategories(true);
    };
    
    const handleCategoriesUpdated = () => {
      console.log('🟡 Categories updated event - admin changed categories');
      fetchGlassCategories(true);
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('glassProductsUpdated', handleProductsUpdated);
    window.addEventListener('glassCategoriesUpdated', handleCategoriesUpdated);
    
    // Mouse move effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('glassProductsUpdated', handleProductsUpdated);
      window.removeEventListener('glassCategoriesUpdated', handleCategoriesUpdated);
    };
  }, []);

  // ============= HELPER FUNCTIONS =============
  
  const getCategoryIcon = (category) => {
    if (category?.startsWith('cat_')) return <FaGem />;
    
    switch(category?.toLowerCase()) {
      case 'window': return <FaWindowMaximize />;
      case 'mirror': return <FaImages />;
      case 'fluted': return <FaThLarge />;
      case 'toughened': return <FaGem />;
      default: return <FaGlassCheers />;
    }
  };

  const getCategoryColor = (category) => {
    if (category?.startsWith('cat_')) return '#c9a96e';
    
    switch(category?.toLowerCase()) {
      case 'window': return '#4f8a8b';
      case 'mirror': return '#bd7b4d';
      case 'fluted': return '#c45a5a';
      case 'toughened': return '#6a4e8c';
      default: return '#c9a96e';
    }
  };

  const handleCategoryClick = (categoryId) => {
    console.log('👆 Category clicked:', categoryId);
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryClick = (subCategory) => {
    console.log('👆 Subcategory clicked:', subCategory);
    setSelectedSubCategory(subCategory);
  };

  const handleBack = () => {
    if (selectedSubCategory) {
      setSelectedSubCategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const handleRefresh = () => {
    fetchGlassCategories(true);
  };

  const selectedCategoryData = glassCategories.find(c => c.id === selectedCategory);
  const selectedTypeData = selectedCategoryData?.types.find(t => t.id === selectedSubCategory);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '20px',
          background: '#f8f5f0'
        }}
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #c6a87d',
            borderRadius: '50%'
          }}
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontFamily: 'Jost, sans-serif', color: '#666' }}
        >
          Loading glass products from database...
        </motion.p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '20px',
          background: '#f8f5f0'
        }}
      >
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          style={{ color: '#ef4444', fontFamily: 'Cormorant Garamond, serif' }}
        >
          Error Loading Data
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: '#666' }}
        >
          {error}
        </motion.p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchGlassCategories(true)}
          style={{
            padding: '12px 30px',
            background: '#c6a87d',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontFamily: 'Jost, sans-serif',
            fontWeight: 500
          }}
        >
          Retry
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="glass-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <Helmet>
        <title>Premium Glass Products in Jharsuguda | New Prem Glass House</title>
        <meta name="description" content="Explore premium glass products at New Prem Glass House in Jharsuguda." />
        <link rel="canonical" href="https://newpremglasshouse.com/glass" />
      </Helmet>

      {/* Progress Bar */}
      <motion.div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #c9a96e, #e8d5b0)',
          transformOrigin: '0%',
          zIndex: 9999
        }}
        animate={{ scaleX: scrollProgress / 100 }}
      />

      {/* Last Updated Indicator (Optional - can remove if you want) */}
      {lastUpdated && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 15px',
          borderRadius: '20px',
          fontSize: '12px',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span>Last updated: {lastUpdated}</span>
          <button 
            onClick={handleRefresh}
            style={{
              background: 'none',
              border: 'none',
              color: '#c9a96e',
              cursor: 'pointer',
              marginLeft: '5px'
            }}
          >
            ↻
          </button>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600;700&display=swap');

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
          --warm-white: #f8f5f0;
          --gray-text: #888888;
          --serif: 'Cormorant Garamond', serif;
          --sans: 'Jost', sans-serif;
        }

        body {
          font-family: var(--sans);
          background: var(--warm-white);
          overflow-x: hidden;
        }

        .glass-page {
          overflow-x: hidden;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 4rem;
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

        .glass-hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, var(--dark), #1a1a1a);
          overflow: hidden;
          padding: 120px 0 100px;
        }

        .glass-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .glass-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
        }

        .glass-hero__vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 40%, transparent 100%);
          z-index: 2;
        }

        .glass-hero__content {
          position: relative;
          z-index: 3;
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        .glass-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 0.8rem 2rem;
          border-radius: 40px;
          color: var(--gold);
          margin-bottom: 2rem;
        }

        .glass-hero__title {
          font-family: var(--serif);
          font-size: clamp(3.5rem, 8vw, 5.5rem);
          font-weight: 300;
          color: white;
          margin-bottom: 1.5rem;
        }

        .glass-hero__title em {
          font-style: italic;
          color: var(--gold);
        }

        .glass-hero__desc {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.7);
          max-width: 700px;
          margin: 0 auto 2rem;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .hero-stat h4 {
          font-family: var(--serif);
          font-size: 2.5rem;
          color: var(--gold);
        }

        .hero-stat p {
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
        }

        .hero-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 3rem 0;
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
          color: white;
        }

        .hero-feature svg {
          color: var(--gold);
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
          transition: all 0.3s;
        }

        .hero-btn-primary:hover {
          background: white;
          transform: translateY(-3px);
        }

        .hero-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2.5rem;
          background: transparent;
          color: white;
          border: 2px solid var(--gold);
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }

        .hero-btn-outline:hover {
          background: var(--gold);
          color: var(--dark);
        }

        .rotate-90 {
          transform: rotate(90deg) !important;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 2rem;
          background: white;
          color: var(--dark);
          border: none;
          border-radius: 40px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 2rem;
        }

        .back-btn:hover {
          transform: translateX(-5px);
          color: var(--gold);
        }

        .categories-section {
          padding: 80px 0 100px;
          background: linear-gradient(135deg, #f8f5f0, #f0e9e0);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 3rem;
        }

        .category-card {
          background: white;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          transition: all 0.5s;
          height: 680px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .category-card:hover {
          transform: translateY(-20px) scale(1.02);
          box-shadow: 0 40px 60px -15px rgba(201,169,110,0.4);
        }

        .card-media {
          position: relative;
          height: 340px;
          overflow: hidden;
        }

        .card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s;
        }

        .category-card:hover .card-media img {
          transform: scale(1.15);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%);
        }

        .card-icon-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 70px;
          height: 70px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          z-index: 3;
          border: 3px solid white;
          transition: all 0.4s;
        }

        .category-card:hover .card-icon-badge {
          transform: rotate(360deg) scale(1.1);
          background: white;
          color: var(--gold);
        }

        .card-content {
          padding: 30px;
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .card-number {
          position: absolute;
          top: -60px;
          left: 30px;
          font-family: var(--serif);
          font-size: 8rem;
          font-weight: 700;
          color: rgba(201,169,110,0.1);
          line-height: 1;
          z-index: 0;
        }

        .card-title {
          font-family: var(--serif);
          font-size: 2.2rem;
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 15px;
          position: relative;
          z-index: 1;
        }

        .card-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 3px;
          background: var(--gold);
          transition: width 0.4s;
        }

        .category-card:hover .card-title::after {
          width: 100px;
        }

        .card-description {
          color: var(--gray-text);
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 15px 0;
          height: 45px;
          overflow: hidden;
        }

        .card-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }

        .card-feature {
          background: rgba(201,169,110,0.08);
          color: var(--gold-dark);
          padding: 6px 10px;
          border-radius: 30px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid rgba(0,0,0,0.06);
        }

        .card-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gold);
          font-weight: 600;
          font-size: 0.9rem;
          background: rgba(201,169,110,0.1);
          padding: 8px 16px;
          border-radius: 40px;
        }

        .card-price-tag {
          background: var(--dark);
          color: white;
          padding: 6px 16px;
          border-radius: 40px;
          font-size: 0.8rem;
        }

        .types-section {
          padding: 100px 0;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 4rem;
          padding: 3rem;
          background: white;
          border-radius: 30px;
        }

        .category-header-icon {
          width: 100px;
          height: 100px;
          background: var(--gold);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: white;
        }

        .category-header-content h2 {
          font-family: var(--serif);
          font-size: 3rem;
          color: var(--dark);
        }

        .types-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .type-card {
          background: white;
          border-radius: 24px;
          padding: 35px;
          box-shadow: 0 10px 30px -15px rgba(0,0,0,0.2);
          transition: all 0.4s;
          cursor: pointer;
          text-align: center;
        }

        .type-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(201,169,110,0.2);
        }

        .type-icon {
          width: 60px;
          height: 60px;
          background: #f2ede4;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: var(--gold);
          font-size: 1.8rem;
        }

        .type-card:hover .type-icon {
          background: var(--gold);
          color: white;
        }

        .type-card h3 {
          font-family: var(--serif);
          font-size: 1.8rem;
          margin-bottom: 0.8rem;
        }

        .type-card p {
          color: var(--gray-text);
        }

        .product-detail {
          padding: 100px 0;
        }

        .product-detail-card {
          background: white;
          border-radius: 40px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          box-shadow: 0 30px 60px -30px rgba(0,0,0,0.4);
        }

        .product-detail-image {
          height: 600px;
          overflow: hidden;
        }

        .product-detail-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-detail-content {
          padding: 80px;
        }

        .product-detail-badge {
          background: #f2ede4;
          color: var(--gold-dark);
          padding: 0.6rem 2rem;
          border-radius: 40px;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .product-detail-content h2 {
          font-family: var(--serif);
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }

        .product-features {
          margin: 2rem 0;
        }

        .product-feature {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .product-feature svg {
          color: var(--gold);
        }

        .stats-row {
          display: flex;
          gap: 2rem;
          margin: 2rem 0;
          padding-top: 2rem;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .stat-number {
          font-family: var(--serif);
          font-size: 2rem;
          color: var(--gold);
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--gray-text);
        }

        .product-actions {
          display: flex;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .btn-primary {
          background: var(--gold);
          color: var(--dark);
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          text-decoration: none;
        }

        .btn-outline {
          background: transparent;
          color: var(--dark);
          padding: 1rem 2.5rem;
          border: 2px solid var(--dark);
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          text-decoration: none;
        }

        @media (max-width: 1200px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
          .types-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 1024px) {
          .product-detail-card { grid-template-columns: 1fr; }
          .product-detail-content { padding: 60px; }
        }

        @media (max-width: 768px) {
          .categories-grid { grid-template-columns: 1fr; }
          .types-grid { grid-template-columns: 1fr; }
          .category-header { flex-direction: column; text-align: center; }
          .product-actions { flex-direction: column; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="glass-hero" ref={heroRef}>
        <div className="glass-hero__bg">
          <motion.img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"
            alt="Premium Glass Products"
            animate={{
              x: mousePosition.x * 2,
              y: mousePosition.y * 2,
              scale: 1.05
            }}
            transition={{ type: "spring", stiffness: 50, damping: 30 }}
          />
        </div>
        <div className="glass-hero__vignette" />
        
        <div className="container">
          <div className="glass-hero__content">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <div className="glass-hero__badge">
                <FaStore /> Premium Glass Collection
              </div>
            </motion.div>
            
            <motion.h1
              className="glass-hero__title"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              Discover Our <em>Glass Range</em>
            </motion.h1>
            
            <motion.p
              className="glass-hero__desc"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              India's most trusted glass manufacturer with premium quality products.
            </motion.p>

            <motion.div 
              className="hero-stats"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                { value: '1000+', label: 'Products' },
                { value: '50+', label: 'Brands' },
                { value: '2000+', label: 'Clients' },
                { value: '10+', label: 'Years' }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="hero-stat"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <motion.h4
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                  >
                    {stat.value}
                  </motion.h4>
                  <p>{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="hero-features"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                { icon: <FaShieldAlt />, text: 'Toughened Glass' },
                { icon: <FaSun />, text: 'UV Protection' },
                { icon: <FaWater />, text: 'Water Resistant' },
                { icon: <FaFire />, text: 'Fire Resistant' }
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="hero-feature"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="hero-buttons"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/contact" className="hero-btn-primary">
                  Get Free Quote <FaArrowRight />
                </Link>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href="tel:+917328019093" className="hero-btn-outline">
                  <FaPhone className="rotate-90" /> Call Now
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <AnimatePresence mode="wait">
        {!selectedCategory && (
          <motion.section 
            key="categories"
            className="categories-section"
            ref={categoriesRef}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="container">
              <motion.div 
                className="mk-label"
                style={{ justifyContent: 'center', marginBottom: '1rem' }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mk-label-line"></div>
                <span>OUR PRODUCTS</span>
                <div className="mk-label-line"></div>
              </motion.div>
              
              <motion.h2 
                className="mk-h2" 
                style={{ textAlign: 'center' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Glass <em>Categories</em>
              </motion.h2>

              {glassCategories.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '50px', color: 'var(--gray-text)' }}
                >
                  No categories found
                </motion.div>
              ) : (
                <CategoryGrid 
                  categories={glassCategories} 
                  onCategoryClick={handleCategoryClick}
                />
              )}
            </div>
          </motion.section>
        )}

        {selectedCategory && !selectedSubCategory && selectedCategoryData && (
          <motion.section 
            key="types"
            className="types-section"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="container">
              <motion.button 
                className="back-btn" 
                onClick={handleBack}
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaArrowLeft /> Back to Categories
              </motion.button>

              <motion.div 
                className="category-header"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <motion.div 
                  className="category-header-icon"
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {selectedCategoryData.icon}
                </motion.div>
                <div className="category-header-content">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedCategoryData.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {selectedCategoryData.description}
                  </motion.p>
                </div>
              </motion.div>

              {selectedCategoryData.types.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '50px', color: 'var(--gray-text)' }}
                >
                  No products in this category yet
                </motion.div>
              ) : (
                <motion.div 
                  className="types-grid"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {selectedCategoryData.types.map((type, index) => (
                    <motion.div
                      key={type.id}
                      className="type-card"
                      variants={{
                        hidden: { rotate: -10, opacity: 0, scale: 0.8 },
                        visible: { 
                          rotate: 0, 
                          opacity: 1, 
                          scale: 1,
                          transition: { 
                            duration: 0.6,
                            type: "spring",
                            stiffness: 100
                          }
                        }
                      }}
                      whileHover={{ 
                        y: -10,
                        boxShadow: '0 20px 40px rgba(201,169,110,0.2)',
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubCategoryClick(type.id)}
                    >
                      <motion.div 
                        className="type-icon"
                        whileHover={{ 
                          rotate: 360,
                          backgroundColor: 'var(--gold)',
                          color: 'white'
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <FaGlassCheers />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {type.name}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {type.description}
                      </motion.p>
                      {type.price > 0 && (
                        <motion.div 
                          style={{ 
                            marginTop: '15px', 
                            fontWeight: 'bold', 
                            color: 'var(--gold)',
                            fontSize: '1.2rem'
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                        >
                          ₹{type.price}
                        </motion.div>
                      )}
                      {type.isAdminAdded && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          style={{
                            marginTop: '10px',
                            fontSize: '0.7rem',
                            background: '#4caf50',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            display: 'inline-block'
                          }}
                        >
                          Admin Added
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {selectedSubCategory && selectedTypeData && (
          <motion.section 
            key="detail"
            className="product-detail"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="container">
              <motion.button 
                className="back-btn" 
                onClick={handleBack}
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <FaArrowLeft /> Back to {selectedCategoryData?.title}
              </motion.button>

              <motion.div 
                className="product-detail-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <motion.div 
                  className="product-detail-image"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <motion.img 
                    src={selectedTypeData.image || selectedCategoryData?.image} 
                    alt={selectedTypeData.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=500';
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
                <div className="product-detail-content">
                  <motion.span 
                    className="product-detail-badge"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedCategoryData?.title}
                  </motion.span>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {selectedTypeData.name}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {selectedTypeData.description}
                  </motion.p>
                  
                  {selectedTypeData.thickness && selectedTypeData.thickness.length > 0 && (
                    <motion.div 
                      className="product-features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="product-feature">
                        <FaCheckCircle />
                        <span>Thickness: {Array.isArray(selectedTypeData.thickness) ? selectedTypeData.thickness.join(', ') : selectedTypeData.thickness}</span>
                      </div>
                    </motion.div>
                  )}

                  {selectedTypeData.size && (
                    <motion.div 
                      className="product-features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="product-feature">
                        <FaCheckCircle />
                        <span>Size: {selectedTypeData.size}</span>
                      </div>
                    </motion.div>
                  )}

                  {selectedTypeData.price > 0 && (
                    <motion.div 
                      className="product-features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="product-feature">
                        <FaCheckCircle />
                        <span>Price: ₹{selectedTypeData.price}</span>
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className="stats-row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    {[
                      { value: '500+', label: 'Projects' },
                      { value: '4.9', label: 'Rating' },
                      { value: '24/7', label: 'Support' }
                    ].map((stat, index) => (
                      <motion.div 
                        key={index} 
                        className="stat-item"
                        whileHover={{ scale: 1.1, y: -5 }}
                      >
                        <span className="stat-number">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div 
                    className="product-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/contact" className="btn-primary">
                        <span>Get Quote</span>
                        <FaArrowRight />
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <a href="tel:+917328019093" className="btn-outline">
                        <FaPhone className="rotate-90" /> Call Now
                      </a>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Glass;