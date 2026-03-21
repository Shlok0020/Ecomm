// src/pages/Plywood/Plywood.jsx - ENHANCED WITH VISIBLE HERO & LEFT/RIGHT CARD ANIMATIONS (FILTER COUNT REMOVED) (FREE DELIVERY CARD REMOVED)
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaArrowRight, 
  FaPhone,
  FaStar,
  FaIndustry,
  FaLeaf,
  FaShieldAlt,
  FaFire,
  FaWater,
  FaShoppingCart,
  FaHeart,
  FaImage,
  FaFilter,
  FaTimes,
  FaBoxOpen,
  FaTruck,
  FaCrown,
  FaStore,
  FaEye,
  FaCheckCircle,
  FaAward,
  FaClock,
  FaGem,
  FaRecycle,
  FaShieldVirus,
  FaSearch,
  FaChevronRight,
  FaInfoCircle,
  FaWhatsapp,
  FaRegHeart
} from 'react-icons/fa';
import { HiOutlineSparkles, HiSparkles } from 'react-icons/hi';
import { GiWoodPile, GiTreeBranch } from 'react-icons/gi';
import plywoodService from '../services/plywoodService';
import toast from 'react-hot-toast';

// ============= IMAGE URL HELPER =============
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `api.newpremglasshouse.in${imagePath}`;
  return `api.newpremglasshouse.in/uploads/${imagePath}`;
};

const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400';
};

// ============= SMOOTH ANIMATION VARIANTS =============

// Page transition
const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.5 }
  }
};

// Hero section animations - FIXED VISIBILITY
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};

const heroFeatureVariants = {
  hidden: { opacity: 0, scale: 0.8, x: -20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.6
    }
  },
  hover: {
    scale: 1.05,
    y: -3,
    transition: { type: "spring", stiffness: 400 }
  }
};

// CARD ANIMATIONS - COME FROM LEFT/RIGHT WHEN SCROLLING
const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: (custom) => ({
    opacity: 0,
    x: custom % 2 === 0 ? -150 : 150,
    y: 50,
    scale: 0.8,
    rotate: custom % 2 === 0 ? -5 : 5
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 24,
      mass: 1.2,
      duration: 1,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    y: -12,
    scale: 1.03,
    boxShadow: "0 30px 50px -20px rgba(189,123,77,0.4)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      duration: 0.4
    }
  }
};

// Benefit card animations - come from sides
const benefitCardVariants = {
  hidden: (custom) => ({
    opacity: 0,
    x: custom % 2 === 0 ? -100 : 100,
    y: 30,
    scale: 0.9
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 22,
      duration: 0.8
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 40px -15px rgba(189,123,77,0.25)",
    transition: { type: "spring", stiffness: 400 }
  }
};

// Brand card animations
const brandCardVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.5,
    rotate: -10
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.8
    }
  },
  hover: {
    scale: 1.1,
    y: -5,
    transition: { type: "spring", stiffness: 400 }
  }
};

// Section title animations
const sectionTitleVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};

// Button animations
const buttonVariants = {
  hover: {
    scale: 1.05,
    y: -3,
    boxShadow: "0 10px 25px rgba(189,123,77,0.3)",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  tap: {
    scale: 0.95,
    y: 0
  }
};

// Image zoom animation
const imageZoomVariants = {
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.6
    }
  }
};

// Badge entrance animation
const badgeVariants = {
  hidden: { 
    opacity: 0,
    x: -20,
    scale: 0.5,
    rotate: -10
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      delay: 0.2
    }
  }
};

// Pulse animation
const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Float animation
const floatVariants = {
  float: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ============= SCROLL REVEAL COMPONENT =============
const ScrollReveal = ({ children, variants, custom, className, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0.2,
    margin: "0px 0px -50px 0px"
  });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={custom}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

const Plywood = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filteredCount, setFilteredCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Parallax effect for hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  // Smooth scroll progress
  const { scrollYProgress: pageScroll } = useScroll();
  const scaleX = useSpring(pageScroll, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check login status and load cart/wishlist
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading localStorage:', error);
    }
  }, []);

  const fetchProducts = async (showToast = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await plywoodService.getAll();
      const allProducts = Array.isArray(response.data) ? response.data : [];
      
      const processedProducts = allProducts.map(product => ({
        ...product,
        id: product._id || product.id || `product-${Date.now()}-${Math.random()}`,
        image: getImageUrl(product.image),
        images: product.images ? product.images.map(img => getImageUrl(img)) : []
      }));
      
      const plywoodProducts = processedProducts.filter(p => {
        if (!p) return false;
        if (p.category && p.category.toLowerCase() === 'plywood') return true;
        if (p.grade && ['premium', 'commercial', 'marine', 'bwp', 'mr', 'fire'].includes(p.grade.toLowerCase())) return true;
        if (p.name && p.name.toLowerCase().includes('ply')) return true;
        if (p.description && p.description.toLowerCase().includes('plywood')) return true;
        return false;
      });
      
      setProducts(plywoodProducts);
      setFilteredCount(plywoodProducts.length);
      
      if (showToast) {
        toast.success('Products updated!', {
          duration: 2000,
          style: { background: '#c9a96e20', color: '#c9a96e' }
        });
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to load products');
      setProducts([]);
      setFilteredCount(0);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20
        });
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!product.price) {
      toast.error('Price not available');
      return;
    }
    
    try {
      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      const productId = product._id || product.id;
      const existingItem = currentCart.find(item => {
        const itemId = item._id || item.id;
        return itemId === productId;
      });
      
      let updatedCart;
      if (existingItem) {
        updatedCart = currentCart.map(item => {
          const itemId = item._id || item.id;
          if (itemId === productId) {
            return { ...item, quantity: (item.quantity || 1) + 1 };
          }
          return item;
        });
        toast.success(`Added another ${product.name} to cart!`);
      } else {
        const cartItem = {
          ...product,
          id: productId,
          _id: productId,
          quantity: 1,
          category: 'plywood'
        };
        updatedCart = [...currentCart, cartItem];
        toast.success(`${product.name} added to cart!`);
      }
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      const productId = product._id || product.id;
      const exists = currentWishlist.some(item => {
        const itemId = item._id || item.id;
        return itemId === productId;
      });
      
      let updatedWishlist;
      if (exists) {
        updatedWishlist = currentWishlist.filter(item => {
          const itemId = item._id || item.id;
          return itemId !== productId;
        });
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setWishlistItems(updatedWishlist);
        toast.success(`${product.name} removed from wishlist!`);
      } else {
        const wishlistItem = {
          ...product,
          id: productId,
          _id: productId,
          category: 'plywood'
        };
        updatedWishlist = [...currentWishlist, wishlistItem];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setWishlistItems(updatedWishlist);
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!product.price) {
      toast.error('Price not available');
      return;
    }
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      toast.error('Please login first');
      navigate('/login', { 
        state: { 
          from: '/plywood',
          product: {
            ...product,
            category: 'plywood'
          }
        } 
      });
      return;
    }
    
    navigate('/order', { 
      state: { 
        product: {
          ...product,
          category: 'plywood'
        }
      } 
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
  };

  const filteredProducts = selectedGrade === 'all' 
    ? products
    : products.filter(p => {
        if (!p.grade && !p.category) return false;
        const grade = (p.grade || p.category || '').toLowerCase();
        return grade === selectedGrade.toLowerCase();
      });

  useEffect(() => {
    setFilteredCount(filteredProducts.length);
  }, [filteredProducts]);

  const grades = [
    { value: 'all', label: 'All Grades', icon: FaBoxOpen, color: '#c9a96e' },
    { value: 'premium', label: 'Premium', icon: FaCrown, color: '#c45a5a' },
    { value: 'commercial', label: 'Commercial', icon: FaStore, color: '#4f8a8b' },
    { value: 'marine', label: 'Marine', icon: FaWater, color: '#2c3e50' },
    { value: 'bwp', label: 'BWP', icon: FaShieldAlt, color: '#8e44ad' },
    { value: 'mr', label: 'MR', icon: FaWater, color: '#16a085' }
  ];

  const heroFeatures = [
    { icon: FaShieldAlt, text: 'IS:710 Certified', color: '#c9a96e' },
    { icon: FaWater, text: '100% Waterproof', color: '#3498db' },
    { icon: FaFire, text: 'Fire Retardant', color: '#e67e22' },
    { icon: FaLeaf, text: 'Eco-Friendly', color: '#27ae60' }
  ];

  // BENEFITS ARRAY - FREE DELIVERY CARD REMOVED
  const benefits = [
    { icon: FaShieldVirus, title: '5 Year Warranty', desc: 'On all premium products', color: '#27ae60' },
    { icon: FaRecycle, title: 'Eco-Friendly', desc: 'Sustainable materials', color: '#2ecc71' },
    { icon: FaAward, title: 'IS:710 Certified', desc: 'Quality assured', color: '#f39c12' },
    { icon: FaClock, title: 'Quick Delivery', desc: 'Within 24-48 hours', color: '#3498db' },
    { icon: FaGem, title: 'Premium Quality', desc: 'Best in class', color: '#9b59b6' }
  ];

  // UPDATED BRANDS WITH ACTUAL PLYWOOD BRAND NAMES AND LARGER HIGH-QUALITY IMAGES
  const brands = [
    { 
      name: 'Century Ply', 
      logo: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=300&fit=crop',
      desc: 'India\'s leading plywood brand'
    },
    { 
      name: 'Greenply', 
      logo: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=600&h=300&fit=crop',
      desc: 'Eco-friendly premium plywood'
    },
    { 
      name: 'Kitply', 
      logo: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&h=300&fit=crop',
      desc: 'Trusted since 1982'
    },
    { 
      name: 'Archid', 
      logo: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=600&h=300&fit=crop',
      desc: 'Architectural excellence'
    }
  ];

  if (loading && products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          color: 'white'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: '60px',
              height: '60px',
              border: '3px solid rgba(201,169,110,0.3)',
              borderTop: '3px solid #c9a96e',
              borderRadius: '50%',
              margin: '0 auto 20px'
            }}
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: '#c9a96e' }}
          >
            Loading premium plywood collection...
          </motion.p>
        </div>
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
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          color: 'white',
          padding: '20px'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaBoxOpen style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '20px' }} />
          </motion.div>
          <h2 style={{ color: '#ef4444', marginBottom: '10px' }}>Oops! Something went wrong</h2>
          <p style={{ color: '#999', marginBottom: '20px' }}>{error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchProducts(true)}
            style={{
              padding: '12px 30px',
              background: '#c9a96e',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #c9a96e, #bd7b4d, #8b5a2b)',
          transformOrigin: '0%',
          scaleX,
          zIndex: 1000
        }}
      />

      <motion.div 
        className="plywood-page"
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Helmet>
          <title>Premium Plywood Dealers in Jharsuguda | New Prem Glass House</title>
          <meta name="description" content="Shop premium plywood at New Prem Glass House in Jharsuguda. Marine plywood, BWP grade, commercial plywood from top brands." />
        </Helmet>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          :root {
            --gold: #c9a96e;
            --gold-light: #e8d5b0;
            --gold-dark: #a07840;
            --wood-light: #bd7b4d;
            --wood-dark: #8b5a2b;
            --dark: #1a1a1a;
            --white: #ffffff;
            --gray: #666;
            --light-gray: #f5f5f5;
            --serif: 'Cormorant Garamond', serif;
            --sans: 'Jost', sans-serif;
          }

          body {
            font-family: var(--sans);
            background: var(--white);
            color: var(--dark);
            overflow-x: hidden;
          }

          .plywood-page {
            overflow-x: hidden;
          }

          .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
          }

          @media (max-width: 768px) {
            .container {
              padding: 0 15px;
            }
          }

          /* Hero Section - FIXED VISIBILITY */
          .hero-section {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: white;
          }

          .hero-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
          }

          .hero-bg img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.3;
          }

          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
            z-index: 2;
          }

          .hero-content {
            position: relative;
            z-index: 3;
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
            padding: 0 20px;
          }

          .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(201,169,110,0.15);
            backdrop-filter: blur(10px);
            padding: 10px 25px;
            border-radius: 50px;
            border: 1px solid rgba(201,169,110,0.3);
            color: var(--gold);
            font-size: 0.9rem;
            margin-bottom: 30px;
          }

          .hero-title {
            font-family: var(--serif);
            font-size: clamp(2.5rem, 8vw, 5rem);
            font-weight: 300;
            line-height: 1.2;
            margin-bottom: 20px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            color:white;
          }

          .hero-title em {
            color: var(--gold);
            font-style: italic;
            display: inline-block;
          }

          .hero-description {
            font-size: clamp(1rem, 2vw, 1.3rem);
            color: rgba(255,255,255,0.9);
            max-width: 700px;
            margin: 0 auto 40px;
            line-height: 1.8;
            text-shadow: 0 1px 5px rgba(0,0,0,0.3);
          }

          .hero-features {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-bottom: 40px;
          }

          .hero-feature {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 20px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 40px;
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            font-size: 0.9rem;
          }

          .hero-feature svg {
            color: var(--gold);
            font-size: 1rem;
          }

          .hero-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 14px 35px;
            background: var(--gold);
            color: var(--dark);
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1rem;
          }

          .btn-primary:hover {
            background: white;
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(201,169,110,0.3);
          }

          .btn-outline {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 14px 35px;
            background: transparent;
            color: white;
            border: 2px solid var(--gold);
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 1rem;
          }

          .btn-outline:hover {
            background: var(--gold);
            color: var(--dark);
            transform: translateY(-3px);
          }

          /* Filters Section */
          .filters-section {
            padding: 30px 0;
            background: white;
            box-shadow: 0 5px 20px rgba(0,0,0,0.05);
            position: sticky;
            top: 0;
            z-index: 20;
          }

          .filter-header {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 20px;
          }

          .filter-toggle {
            display: none;
            align-items: center;
            gap: 8px;
            padding: 8px 20px;
            background: var(--gold);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-size: 14px;
          }

          @media (max-width: 768px) {
            .filter-toggle {
              display: flex;
            }
          }

          .filter-wrapper {
            display: flex;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
          }

          @media (max-width: 768px) {
            .filter-wrapper {
              display: ${showFilters ? 'flex' : 'none'};
              flex-direction: column;
              align-items: stretch;
              margin-top: 20px;
            }
          }

          .filter-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 10px 25px;
            background: #f5f5f5;
            border: none;
            border-radius: 40px;
            color: #333;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
          }

          .filter-btn:hover {
            background: var(--gold);
            color: white;
            transform: translateY(-2px);
          }

          .filter-btn.active {
            background: var(--gold);
            color: white;
          }

          /* Products Section */
          .products-section {
            padding: 60px 0;
          }

          .section-header {
            text-align: center;
            margin-bottom: 40px;
          }

          .section-label {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
          }

          .section-label span {
            font-size: 0.8rem;
            letter-spacing: 3px;
            color: var(--gold);
          }

          .section-label-line {
            width: 40px;
            height: 1px;
            background: var(--gold);
          }

          .section-title {
            font-family: var(--serif);
            font-size: clamp(2rem, 5vw, 3.5rem);
            color: var(--dark);
          }

          .section-title em {
            color: var(--gold);
            font-style: italic;
          }

          .products-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
          }

          @media (max-width: 1200px) {
            .products-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (max-width: 992px) {
            .products-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 576px) {
            .products-grid {
              grid-template-columns: 1fr;
            }
          }

          /* Product Card */
          .product-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
          }

          .product-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(189,123,77,0.2);
          }

          .product-image-container {
            position: relative;
            height: 250px;
            overflow: hidden;
            background: #f5f5f5;
          }

          @media (max-width: 768px) {
            .product-image-container {
              height: 200px;
            }
          }

          .product-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }

          .product-card:hover .product-image {
            transform: scale(1.1);
          }

          .product-image-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            color: #999;
          }

          .product-wishlist {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
            color: #666;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            z-index: 10;
            transition: all 0.3s ease;
          }

          .product-wishlist:hover {
            transform: scale(1.1);
          }

          .product-wishlist.active {
            background: #ff4d4d;
            color: white;
          }

          .product-badge {
            position: absolute;
            top: 15px;
            left: 15px;
            background: var(--gold);
            color: white;
            font-size: 0.75rem;
            padding: 5px 15px;
            border-radius: 25px;
            font-weight: 500;
            z-index: 10;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }

          .product-content {
            padding: 20px;
          }

          .product-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .product-description {
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 10px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            height: 40px;
          }

          .product-brand {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.8rem;
            color: var(--wood-dark);
            margin-bottom: 8px;
          }

          .product-thickness {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 10px;
          }

          .thickness-tag {
            background: #f5f5f5;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 0.7rem;
            color: #666;
          }

          .product-rating {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 10px;
          }

          .rating-stars {
            display: flex;
            gap: 2px;
            color: #ffb800;
            font-size: 0.8rem;
          }

          .product-price-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .current-price {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--gold);
          }

          .current-price small {
            font-size: 0.8rem;
            font-weight: 400;
            color: #999;
          }

          .product-mrp {
            font-size: 0.8rem;
            color: #999;
            text-decoration: line-through;
          }

          .product-stock {
            font-size: 0.75rem;
            font-weight: 500;
          }

          .product-actions {
            display: flex;
            gap: 8px;
          }

          @media (max-width: 576px) {
            .product-actions {
              flex-direction: column;
            }
          }

          .btn-add-cart {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 10px 12px;
            background: var(--gold);
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-add-cart:hover:not(:disabled) {
            background: var(--gold-dark);
            transform: translateY(-2px);
          }

          .btn-buy-now {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 10px 12px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-buy-now:hover:not(:disabled) {
            background: #218838;
            transform: translateY(-2px);
          }

          /* Benefits Section */
          .benefits-section {
            padding: 80px 0;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          }

          .benefits-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin-top: 40px;
          }

          @media (max-width: 992px) {
            .benefits-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 576px) {
            .benefits-grid {
              grid-template-columns: 1fr;
            }
          }

          .benefit-card {
            background: white;
            border-radius: 30px;
            padding: 40px 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
          }

          .benefit-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%);
            animation: rotate 20s linear infinite;
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .benefit-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 25px;
            background: linear-gradient(135deg, #f8f5f0, #f2ede4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: var(--gold);
            position: relative;
            z-index: 2;
          }

          .benefit-title {
            font-family: var(--serif);
            font-size: 1.3rem;
            margin-bottom: 10px;
            color: var(--dark);
            position: relative;
            z-index: 2;
          }

          .benefit-desc {
            color: #666;
            font-size: 0.95rem;
            line-height: 1.6;
            position: relative;
            z-index: 2;
          }

          /* Brands Section - UPDATED WITH DARKER TEXT */
          .brands-section {
            padding: 60px 0;
            background: #fafaf8;
          }

          .brands-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 35px;
            margin-top: 50px;
          }

          @media (max-width: 992px) {
            .brands-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 30px;
            }
          }

          @media (max-width: 576px) {
            .brands-grid {
              grid-template-columns: 1fr;
              gap: 25px;
            }
          }

          .brand-card {
            background: white;
            border-radius: 24px;
            padding: 40px 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            transition: all 0.4s ease;
            border: 1px solid rgba(201,169,110,0.1);
          }

          .brand-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(201,169,110,0.2);
            border-color: rgba(201,169,110,0.3);
          }

          .brand-card img {
            max-width: 100%;
            height: 120px;
            width: auto;
            object-fit: contain;
            filter: grayscale(100%);
            transition: all 0.4s ease;
            margin-bottom: 20px;
            display: block;
            margin-left: auto;
            margin-right: auto;
          }

          .brand-card:hover img {
            filter: grayscale(0%);
            transform: scale(1.05);
          }

          .brand-name {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--dark);
            margin-top: 15px;
            font-family: var(--sans);
            letter-spacing: -0.3px;
          }

          .brand-desc {
            font-size: 0.9rem;
            color: #000000;
            margin-top: 10px;
            line-height: 1.5;
            font-weight: 500;
            opacity: 0.9;
          }

          /* CTA Section */
          .cta-section {
            padding: 80px 0;
          }

          .cta-box {
            background: linear-gradient(135deg, var(--wood-light), var(--wood-dark));
            border-radius: 50px;
            padding: 80px 40px;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
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
          }

          .cta-box h2 {
            font-family: var(--serif);
            font-size: clamp(2rem, 5vw, 3.5rem);
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: clamp(3.5rem, 12vw, 5rem);
            }
          }

          @media (max-width: 480px) {
            .hero-title {
              font-size: clamp(4rem, 10vw, 4rem);
            }
          }

          .cta-box p {
            font-size: 1.1rem;
            margin-bottom: 30px;
            opacity: 0.9;
            position: relative;
            z-index: 2;
          }

          .cta-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            position: relative;
            z-index: 2;
          }

          .btn-cta {
            padding: 14px 35px;
            background: var(--dark);
            color: white;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
          }

          .btn-cta:hover {
            background: white;
            color: var(--dark);
            transform: translateY(-3px);
          }

          .btn-cta-outline {
            padding: 14px 35px;
            background: transparent;
            color: white;
            border: 2px solid white;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
          }

          .btn-cta-outline:hover {
            background: white;
            color: var(--wood-dark);
            transform: translateY(-3px);
          }

          /* Quick View Modal */
          .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }

          .quick-view-content {
            background: white;
            border-radius: 40px;
            max-width: 1000px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 40px;
            position: relative;
          }

          .close-quick-view {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #f0f0f0;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.2rem;
            color: #666;
            transition: all 0.3s ease;
          }

          .close-quick-view:hover {
            background: #ef4444;
            color: white;
            transform: rotate(90deg);
          }
        `}</style>

        {/* Hero Section - FIXED VISIBILITY */}
        <section className="hero-section" ref={heroRef}>
          <div className="hero-bg">
            <motion.img
              src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1600"
              alt="Premium Plywood"
              style={{
                y: heroParallax,
                scale: 1.1,
              }}
            />
          </div>
          <div className="hero-overlay" />

          <motion.div 
            className="hero-content"
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={heroItemVariants} className="hero-badge">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <GiWoodPile />
              </motion.div>
              <span>Premium Plywood Store</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <HiOutlineSparkles />
              </motion.div>
            </motion.div>

            <motion.h1 variants={heroItemVariants} className="hero-title">
              Premium <em>Plywood</em>
            </motion.h1>

            <motion.p variants={heroItemVariants} className="hero-description">
              Discover our extensive collection of high-quality plywood, from commercial to premium marine grades. 
              Perfect for all your construction and furniture needs.
            </motion.p>

            <motion.div 
              className="hero-features"
              variants={heroContainerVariants}
            >
              {heroFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="hero-feature"
                  variants={heroFeatureVariants}
                  whileHover="hover"
                >
                  <feature.icon style={{ color: feature.color }} />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="hero-buttons"
              variants={heroContainerVariants}
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link to="/contact" className="btn-primary">
                  <span>Get Free Quote</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FaArrowRight />
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <a href="tel:+917328019093" className="btn-outline">
                  <span>Call Now</span>
                  <motion.div
                    animate={{ rotate: [90, 95, 90] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FaPhone />
                  </motion.div>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Filters Section - "4 Products" REMOVED */}
        <section className="filters-section">
          <div className="container">
            <div className="filter-header">
              <motion.button 
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFilter />
                <span>Filter</span>
                {showFilters ? <FaTimes /> : <FaChevronRight />}
              </motion.button>
            </div>

            <motion.div 
              className="filter-wrapper"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {grades.map(grade => (
                <motion.button
                  key={grade.value}
                  className={`filter-btn ${selectedGrade === grade.value ? 'active' : ''}`}
                  onClick={() => setSelectedGrade(grade.value)}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ backgroundColor: selectedGrade === grade.value ? grade.color : '' }}
                >
                  <grade.icon />
                  {grade.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Products Section - CARDS COME FROM LEFT/RIGHT */}
        <section className="products-section" ref={productsRef}>
          <div className="container">
            <ScrollReveal variants={sectionTitleVariants} className="section-header">
              <div className="section-label">
                <div className="section-label-line"></div>
                <motion.span
                  animate={{ letterSpacing: ['3px', '5px', '3px'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  OUR COLLECTION
                </motion.span>
                <div className="section-label-line"></div>
              </div>
              <h2 className="section-title">
                Premium <motion.em
                  animate={{ color: ['#c9a96e', '#bd7b4d', '#c9a96e'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >Plywood Range</motion.em>
              </h2>
            </ScrollReveal>

            {!products || products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '50px' }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FaBoxOpen style={{ fontSize: '4rem', color: '#c9a96e', marginBottom: '20px' }} />
                </motion.div>
                <p style={{ color: '#666' }}>No plywood products found.</p>
              </motion.div>
            ) : (
              <motion.div 
                className="products-grid"
                variants={cardContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {filteredProducts.map((product, index) => (
                  <ScrollReveal
                    key={product._id || product.id || index}
                    variants={cardVariants}
                    custom={index}
                  >
                    <motion.div
                      className="product-card"
                      variants={cardVariants}
                      whileHover="hover"
                      onHoverStart={() => setHoveredProduct(product._id || product.id)}
                      onHoverEnd={() => setHoveredProduct(null)}
                      onClick={() => setQuickViewProduct(product)}
                    >
                      {/* Product Image */}
                      <div className="product-image-container">
                        <motion.div
                          variants={imageZoomVariants}
                          whileHover="hover"
                          style={{ height: '100%', width: '100%' }}
                        >
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name || 'Plywood Product'}
                              className="product-image"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="product-image-placeholder">
                              <FaImage size={40} />
                            </div>
                          )}
                        </motion.div>
                        
                        {/* Wishlist Button */}
                        <motion.button
                          className={`product-wishlist ${isInWishlist(product._id || product.id) ? 'active' : ''}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(product, e);
                          }}
                        >
                          <FaHeart />
                        </motion.button>
                        
                        {/* Grade Badge */}
                        <motion.div 
                          className="product-badge"
                          variants={badgeVariants}
                        >
                          {product.grade || product.category || 'Premium'}
                        </motion.div>

                        {/* Quick View Icon */}
                        {hoveredProduct === (product._id || product.id) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            style={{
                              position: 'absolute',
                              bottom: '10px',
                              right: '10px',
                              background: 'white',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                              zIndex: 10
                            }}
                            whileHover={{ scale: 1.1, backgroundColor: '#c9a96e', color: 'white' }}
                          >
                            <FaEye />
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="product-content">
                        <h3 className="product-title">
                          {product.name || 'Plywood Product'}
                        </h3>
                        
                        {product.description && (
                          <p className="product-description">
                            {product.description}
                          </p>
                        )}
                        
                        {product.brand && (
                          <div className="product-brand">
                            <FaIndustry /> {product.brand}
                          </div>
                        )}
                        
                        {product.thickness && (
                          <div className="product-thickness">
                            {Array.isArray(product.thickness) 
                              ? product.thickness.map(t => (
                                  <span key={t} className="thickness-tag">{t}</span>
                                ))
                              : <span className="thickness-tag">{product.thickness}</span>
                            }
                          </div>
                        )}
                        
                        {product.rating && (
                          <div className="product-rating">
                            <div className="rating-stars">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={i < Math.floor(product.rating) ? {
                                    scale: [1, 1.2, 1],
                                    color: ['#ffb800', '#ffd700', '#ffb800']
                                  } : {}}
                                  transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                                >
                                  <FaStar color={i < Math.floor(product.rating) ? '#ffb800' : '#e0e0e0'} />
                                </motion.div>
                              ))}
                            </div>
                            <span className="rating-number">{product.rating}</span>
                          </div>
                        )}
                        
                        {product.price && (
                          <div className="product-price-section">
                            <div>
                              <span className="current-price">
                                ₹{product.price}
                                <small>/sheet</small>
                              </span>
                              {product.mrp && product.mrp > product.price && (
                                <span className="product-mrp">₹{product.mrp}</span>
                              )}
                            </div>
                            
                            {product.stock !== undefined && (
                              <motion.span 
                                className="product-stock"
                                animate={product.stock < 10 && product.stock > 0 ? {
                                  scale: [1, 1.1, 1],
                                  color: ['#ffc107', '#ffa000', '#ffc107']
                                } : {}}
                                style={{
                                  color: product.stock <= 0 ? '#dc3545' : 
                                         product.stock < 10 ? '#ffc107' : '#28a745'
                                }}
                              >
                                {product.stock <= 0 ? 'Out' : 
                                 product.stock < 10 ? `${product.stock} left` : 'In stock'}
                              </motion.span>
                            )}
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="product-actions">
                          <motion.button
                            className="btn-add-cart"
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (product.price && product.stock > 0) {
                                handleAddToCart(product, e);
                              }
                            }}
                            disabled={!product.price || product.stock <= 0}
                          >
                            <FaShoppingCart /> 
                            {!product.price ? 'Unavailable' : 
                             product.stock <= 0 ? 'Out' : 'Add'}
                          </motion.button>
                          <motion.button
                            className="btn-buy-now"
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (product.price && product.stock > 0) {
                                handleBuyNow(product, e);
                              }
                            }}
                            disabled={!product.price || product.stock <= 0}
                          >
                            {!product.price ? 'N/A' : 
                             product.stock <= 0 ? 'Sold' : 'Buy'}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Benefits Section - FREE DELIVERY CARD REMOVED */}
        <section className="benefits-section">
          <div className="container">
            <ScrollReveal variants={sectionTitleVariants} className="section-header">
              <div className="section-label">
                <div className="section-label-line"></div>
                <span>WHY CHOOSE US</span>
                <div className="section-label-line"></div>
              </div>
              <h2 className="section-title">
                Premium <em>Benefits</em>
              </h2>
            </ScrollReveal>

            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <ScrollReveal
                  key={index}
                  variants={benefitCardVariants}
                  custom={index}
                >
                  <motion.div
                    className="benefit-card"
                    variants={benefitCardVariants}
                    whileHover="hover"
                  >
                    <motion.div 
                      className="benefit-icon"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <benefit.icon style={{ color: benefit.color }} />
                    </motion.div>
                    <h3 className="benefit-title">{benefit.title}</h3>
                    <p className="benefit-desc">{benefit.desc}</p>
                    <motion.div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, ${benefit.color}, transparent)`
                      }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Brands Section - UPDATED WITH DARKER TEXT */}
        <section className="brands-section">
          <div className="container">
            <ScrollReveal variants={sectionTitleVariants} className="section-header">
              <div className="section-label">
                <div className="section-label-line"></div>
                <span>TRUSTED BRANDS</span>
                <div className="section-label-line"></div>
              </div>
              <h2 className="section-title">
                Top <em>Manufacturers</em>
              </h2>
            </ScrollReveal>

            <div className="brands-grid">
              {brands.map((brand, index) => (
                <ScrollReveal
                  key={index}
                  variants={brandCardVariants}
                  custom={index}
                >
                  <motion.div
                    className="brand-card"
                    variants={brandCardVariants}
                    whileHover="hover"
                  >
                    <motion.img 
                      src={brand.logo} 
                      alt={brand.name}
                      onError={handleImageError}
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="brand-name">{brand.name}</div>
                    <div className="brand-desc">{brand.desc}</div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section" ref={ctaRef}>
          <div className="container">
            <ScrollReveal variants={sectionTitleVariants}>
              <motion.div 
                className="cta-box"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.h2
                    animate={{ 
                      scale: [1, 1.02, 1],
                      textShadow: [
                        "0 2px 4px rgba(0,0,0,0.2)",
                        "0 4px 8px rgba(0,0,0,0.3)",
                        "0 2px 4px rgba(0,0,0,0.2)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Need Plywood Solutions?
                  </motion.h2>
                  <motion.p
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Visit our store for premium quality plywood products from top brands
                  </motion.p>
                  
                  <div className="cta-buttons">
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link to="/contact" className="btn-cta">
                        <span>Get Free Quote</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <FaArrowRight />
                        </motion.div>
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <a href="tel:+917328019093" className="btn-cta-outline">
                        <span>Call Now</span>
                        <motion.div
                          animate={{ rotate: [90, 95, 90] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <FaPhone />
                        </motion.div>
                      </a>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </ScrollReveal>
          </div>
        </section>

        {/* Quick View Modal */}
        <AnimatePresence>
          {quickViewProduct && (
            <motion.div
              className="quick-view-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
            >
              <motion.div
                className="quick-view-content"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="close-quick-view"
                  onClick={() => setQuickViewProduct(null)}
                >
                  <FaTimes />
                </button>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  <div>
                    <motion.img 
                      src={getImageUrl(quickViewProduct.image)} 
                      alt={quickViewProduct.name}
                      style={{ width: '100%', borderRadius: '20px' }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', marginBottom: '10px' }}>
                      {quickViewProduct.name}
                    </h2>
                    <p style={{ color: '#666', marginBottom: '20px' }}>{quickViewProduct.description}</p>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>
                        ₹{quickViewProduct.price}
                        <small style={{ fontSize: '1rem', color: '#999', marginLeft: '10px' }}>/sheet</small>
                      </div>
                      {quickViewProduct.mrp && (
                        <div style={{ color: '#999', textDecoration: 'line-through' }}>
                          MRP: ₹{quickViewProduct.mrp}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      <div style={{ background: '#f5f5f5', padding: '5px 15px', borderRadius: '20px' }}>
                        Grade: {quickViewProduct.grade || 'Premium'}
                      </div>
                      {quickViewProduct.thickness && (
                        <div style={{ background: '#f5f5f5', padding: '5px 15px', borderRadius: '20px' }}>
                          Thickness: {quickViewProduct.thickness}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <motion.button
                        className="btn-add-cart"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={(e) => {
                          handleAddToCart(quickViewProduct, e);
                          setQuickViewProduct(null);
                        }}
                        style={{ flex: 1, padding: '12px' }}
                      >
                        <FaShoppingCart /> Add to Cart
                      </motion.button>
                      <motion.button
                        className="btn-buy-now"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={(e) => {
                          handleBuyNow(quickViewProduct, e);
                          setQuickViewProduct(null);
                        }}
                        style={{ flex: 1, padding: '12px' }}
                      >
                        Buy Now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Plywood;