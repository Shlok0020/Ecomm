// src/pages/Hardware/Hardware.jsx - WITH PROPER IMAGE HANDLING
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  FaGem,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaImage,
  FaArrowLeft,
  FaEye
} from 'react-icons/fa';
import hardwareService from '../services/hardwareService';
import toast from 'react-hot-toast';

// ============= IMAGE URL HELPER =============
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
  return `http://localhost:5000/uploads/${imagePath}`;
};

const handleImageError = (e, fallbackUrl = 'https://via.placeholder.com/300x200?text=No+Image') => {
  e.target.onerror = null;
  e.target.src = fallbackUrl;
};
// ============================================

const Hardware = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Check login status and load cart/wishlist on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart:', error);
        localStorage.removeItem('cart');
      }
    }
    
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

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

  // Fetch hardware products
  const fetchProducts = async (showToast = false) => {
    console.log('🔵 Fetching hardware products from database...');
    setLoading(true);
    setError(null);
    
    try {
      const response = await hardwareService.getAll();
      console.log('📦 Products from database:', response.data);
      
      const allProducts = Array.isArray(response.data) ? response.data : [];
      
      // Process products to ensure images have full URLs
      const processedProducts = allProducts.map(product => ({
        ...product,
        id: product._id || product.id || `prod-${Date.now()}-${Math.random()}`,
        image: getImageUrl(product.image),
        images: product.images ? product.images.map(img => getImageUrl(img)) : []
      }));
      
      setProducts(processedProducts);
      
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
    
    // Real-time updates
    const handleStorageChange = (e) => {
      console.log('🟡 Storage changed in Hardware:', e.key);
      if (e.key === 'hardware_admin_products' || 
          e.key === 'hardware_products' || 
          e.key === null) {
        fetchProducts(true);
      }
    };
    
    const handleProductsUpdated = () => {
      console.log('🟡 Products updated event in Hardware');
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
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleProductsUpdated);
    window.addEventListener('hardwareProductsUpdated', handleProductsUpdated);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleProductsUpdated);
      window.removeEventListener('hardwareProductsUpdated', handleProductsUpdated);
    };
  }, []);

  // 🔥 FIXED ADD TO CART HANDLER - Multiple products support
  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Prevent card click
    e.preventDefault();
    
    console.log('Adding to cart:', product); // Debug log
    
    if (!product.price) {
      toast.error('Price not available');
      return;
    }
    
    // Create a unique ID for the product
    const productId = product._id || product.id;
    
    if (!productId) {
      toast.error('Invalid product');
      return;
    }
    
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart (compare by ID)
    const existingItem = currentCart.find(item => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
    
    let updatedCart;
    if (existingItem) {
      // Increase quantity if already in cart
      updatedCart = currentCart.map(item => {
        const itemId = item._id || item.id;
        if (itemId === productId) {
          return { 
            ...item, 
            quantity: (item.quantity || 1) + 1 
          };
        }
        return item;
      });
      toast.success(`Added another ${product.name} to cart!`);
    } else {
      // Add new item with proper ID structure
      const cartItem = {
        ...product,
        id: productId,
        _id: productId,
        quantity: 1,
        category: 'hardware'
      };
      updatedCart = [...currentCart, cartItem];
      toast.success(`${product.name} added to cart!`);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Dispatch custom event for navbar to update
    window.dispatchEvent(new Event('cartUpdated'));
    
    console.log('Updated cart:', updatedCart); // Debug log
  };

  // 🔥 FIXED ADD TO WISHLIST HANDLER
  const handleAddToWishlist = (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const productId = product._id || product.id;
    
    if (!productId) {
      toast.error('Invalid product');
      return;
    }
    
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
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
        _id: productId
      };
      updatedWishlist = [...currentWishlist, wishlistItem];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  // 🔥 BUY NOW HANDLER
  const handleBuyNow = (product, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
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
          from: '/hardware',
          product: {
            ...product,
            id: product._id || product.id,
            category: 'hardware'
          }
        } 
      });
      return;
    }
    
    navigate('/order', { 
      state: { 
        product: {
          ...product,
          id: product._id || product.id,
          category: 'hardware'
        }
      } 
    });
  };

  // Handle product click for detail view
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Handle back from detail view
  const handleBack = () => {
    setSelectedProduct(null);
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
  };

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

  const statsArray = [
    { value: products.length > 0 ? products.length + '+' : '500+', label: 'Products', icon: <FaWrench /> },
    { value: '50+', label: 'Brands', icon: <FaGem /> },
    { value: products.length > 0 ? (products.length * 4) + '+' : '2000+', label: 'Customers', icon: <FaUsers /> },
    { value: '10+', label: 'Years', icon: <FaClock /> }
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

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  };

  if (loading && products.length === 0) {
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
            borderTop: '4px solid #c9a96e',
            borderRadius: '50%'
          }}
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontFamily: 'Jost, sans-serif', color: '#666' }}
        >
          Loading hardware products...
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
        <h2 style={{ color: '#ef4444', fontFamily: 'Cormorant Garamond, serif' }}>Error Loading Data</h2>
        <p style={{ color: '#666' }}>{error}</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="hw-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <Helmet>
        <title>Premium Hardware Store in Jharsuguda | New Prem Glass House</title>
        <meta name="description" content="Visit New Prem Glass House for premium hardware products in Jharsuguda. 500+ products from 50+ brands." />
        <link rel="canonical" href="https://newpremglasshouse.com/hardware" />
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

        .hw-page {
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

        .mk-h2--light { color: white; }

        /* Hero Section */
        .hw-hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, var(--dark), #1a1a1a);
          overflow: hidden;
          padding: 120px 0 100px;
        }

        .hw-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hw-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
        }

        .hw-hero__vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 40%, transparent 100%);
          z-index: 2;
        }

        .hw-hero__content {
          position: relative;
          z-index: 3;
          max-width: 1000px;
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
          margin-bottom: 2rem;
        }

        .hw-hero__title {
          font-family: var(--serif);
          font-size: clamp(3.5rem, 8vw, 5.5rem);
          font-weight: 300;
          color: white;
          margin-bottom: 1.5rem;
        }

        .hw-hero__title em {
          font-style: italic;
          color: var(--gold);
        }

        .hw-hero__desc {
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
          transition: all 0.3s;
        }

        .btn-primary:hover {
          background: white;
          transform: translateY(-3px);
        }

        /* Stats Section */
        .stats-section {
          padding: 80px 0;
          background: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .stat-card {
          background: white;
          padding: 40px 30px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 10px 30px -15px rgba(0,0,0,0.2);
          transition: all 0.4s ease;
        }

        .stat-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(201,169,110,0.15);
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
        }

        .stat-card p {
          color: var(--gray-text);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Products Section */
        .products-section {
          padding: 80px 0 100px;
          background: linear-gradient(135deg, #f8f5f0, #f0e9e0);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
          margin-top: 3rem;
        }

        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(201,169,110,0.15);
        }

        .product-card-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .product-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-card-image {
          transform: scale(1.08);
        }

        .product-card-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
          color: #999;
          gap: 8px;
        }

        .product-card-image-placeholder svg {
          font-size: 3rem;
          opacity: 0.4;
        }

        .product-card-wishlist {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 2;
          border: none;
        }

        .product-card-wishlist:hover {
          background: #ff4d4d;
          color: white;
          transform: scale(1.1);
        }

        .product-card-wishlist.active {
          background: #ff4d4d;
          color: white;
        }

        .product-card-admin-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #4caf50;
          color: white;
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 20px;
          z-index: 2;
        }

        .product-card-content {
          padding: 18px 16px;
        }

        .product-card-title {
          font-family: var(--sans);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-card-description {
          font-size: 0.85rem;
          color: var(--gray-text);
          margin-bottom: 12px;
          line-height: 1.4;
          height: 38px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .product-card-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
        }

        .product-card-rating-stars {
          display: flex;
          gap: 2px;
          color: #ffb800;
          font-size: 0.8rem;
        }

        .product-card-rating-number {
          font-size: 0.8rem;
          color: var(--gray-text);
        }

        .product-card-price-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .product-card-price {
          display: flex;
          flex-direction: column;
        }

        .product-card-current-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--dark);
        }

        .product-card-mrp {
          font-size: 0.8rem;
          color: #999;
          text-decoration: line-through;
        }

        .product-card-stock {
          font-size: 0.75rem;
          color: #28a745;
          font-weight: 500;
        }

        .product-card-actions {
          display: flex;
          gap: 8px;
        }

        .product-card-add-to-cart {
          flex: 1;
          background: var(--gold);
          color: white;
          border: none;
          border-radius: 30px;
          padding: 10px 12px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .product-card-add-to-cart:hover:not(:disabled) {
          background: var(--gold-dark);
          transform: translateY(-2px);
        }

        .product-card-add-to-cart:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .product-card-buy-now {
          background: #28a745;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 10px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .product-card-buy-now:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-2px);
        }

        .product-card-buy-now:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        /* Back Button */
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

        /* Product Detail */
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
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-detail-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-detail-image-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: #999;
        }

        .product-detail-image-placeholder svg {
          font-size: 5rem;
          opacity: 0.3;
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

        /* Testimonials Section */
        .testimonials-section {
          padding: 100px 0;
          background: linear-gradient(135deg, var(--dark) 0%, #1a1a1a 100%);
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
          text-transform: uppercase;
          color: white;
          margin-bottom: 4px;
        }

        .testimonial__role {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--gold);
        }

        /* CTA Section */
        .cta-section {
          padding: 80px 0;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
        }

        .cta-box {
          text-align: center;
          color: var(--dark);
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-box h2 {
          font-family: var(--serif);
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }

        .cta-box p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
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
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
        }

        .btn-cta:hover {
          background: white;
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
          border: 2px solid var(--dark);
        }

        .btn-cta-outline:hover {
          background: var(--dark);
          color: white;
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

        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .products-grid { grid-template-columns: repeat(3, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 1024px) {
          .product-detail-card { grid-template-columns: 1fr; }
          .product-detail-content { padding: 60px; }
          .products-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: 1fr; }
          .product-actions { flex-direction: column; }
          .cta-buttons { flex-direction: column; }
          .cta-info { flex-direction: column; gap: 1rem; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
          .products-grid { grid-template-columns: 1fr; }
          .product-card-actions { flex-direction: column; }
        }
      `}</style>

      <AnimatePresence mode="wait">
        {!selectedProduct ? (
          /* Main Products View */
          <motion.div
            key="products"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Hero Section */}
            <section className="hw-hero">
              <div className="hw-hero__bg">
                <motion.img
                  src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1600"
                  alt="Hardware Tools"
                  animate={{
                    x: mousePosition.x * 2,
                    y: mousePosition.y * 2,
                    scale: 1.05
                  }}
                />
              </div>
              <div className="hw-hero__vignette" />
              
              <div className="container">
                <div className="hw-hero__content">
                  <motion.div variants={fadeInUp}>
                    <div className="hw-hero__badge">
                      <FaStore /> Premium Hardware Store
                    </div>
                  </motion.div>
                  
                  <motion.h1
                    className="hw-hero__title"
                    variants={fadeInUp}
                  >
                    Quality <em>Hardware Solutions</em>
                  </motion.h1>
                  
                  <motion.p
                    className="hw-hero__desc"
                    variants={fadeInUp}
                  >
                    Complete hardware solutions for all your needs — from door handles
                    to adhesives, we have it all under one roof.
                  </motion.p>

                  <motion.div 
                    className="hero-stats"
                    variants={staggerContainer}
                  >
                    {[
                      { value: products.length > 0 ? products.length + '+' : '500+', label: 'Products' },
                      { value: '50+', label: 'Brands' },
                      { value: products.length > 0 ? (products.length * 4) + '+' : '2000+', label: 'Customers' }
                    ].map((stat, index) => (
                      <motion.div 
                        key={index} 
                        className="hero-stat"
                        variants={fadeInUp}
                      >
                        <h4>{stat.value}</h4>
                        <p>{stat.label}</p>
                      </motion.div>
                    ))}
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
                    <span>OUR PRODUCTS</span>
                    <div className="mk-label-line"></div>
                  </div>
                  <h2 className="mk-h2">
                    Hardware <em>Range</em>
                  </h2>
                  <p style={{ color: 'var(--gray-text)', marginTop: '1rem' }}>
                    Premium quality hardware products for every construction and interior need
                  </p>
                </motion.div>

                {products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px', color: 'var(--gray-text)' }}>
                    No products found. Add some from admin panel!
                  </div>
                ) : (
                  <motion.div 
                    className="products-grid"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product._id || product.id || `product-${index}`}
                        variants={fadeInScale}
                        whileHover={{ y: -8 }}
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="product-card">
                          <div className="product-card-image-container">
                            {product.image ? (
                              <img 
                                src={getImageUrl(product.image)} 
                                alt={product.name}
                                className="product-card-image"
                                onError={(e) => handleImageError(e)}
                              />
                            ) : (
                              <div className="product-card-image-placeholder">
                                <FaImage />
                                <span>No Image</span>
                              </div>
                            )}
                            
                            {/* Wishlist Button */}
                            <motion.button
                              className={`product-card-wishlist ${isInWishlist(product._id || product.id) ? 'active' : ''}`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleAddToWishlist(product, e)}
                            >
                              {isInWishlist(product._id || product.id) ? <FaHeart /> : <FaRegHeart />}
                            </motion.button>
                            
                            {product.isAdminAdded && (
                              <div className="product-card-admin-badge">
                                Admin
                              </div>
                            )}
                          </div>
                          
                          <div className="product-card-content">
                            <h3 className="product-card-title">{product.name || 'Hardware Product'}</h3>
                            <p className="product-card-description">
                              {product.description || 'Premium quality hardware'}
                            </p>
                            
                            {product.rating && (
                              <div className="product-card-rating">
                                <div className="product-card-rating-stars">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} color={i < Math.floor(product.rating) ? '#ffb800' : '#e0e0e0'} />
                                  ))}
                                </div>
                                <span className="product-card-rating-number">{product.rating}</span>
                              </div>
                            )}
                            
                            {product.price && (
                              <>
                                <div className="product-card-price-section">
                                  <div className="product-card-price">
                                    <span className="product-card-current-price">
                                      ₹{product.price}
                                    </span>
                                    {product.mrp && product.mrp > product.price && (
                                      <span className="product-card-mrp">₹{product.mrp}</span>
                                    )}
                                  </div>
                                  {product.stock && (
                                    <span className="product-card-stock">{product.stock} in stock</span>
                                  )}
                                </div>
                                
                                <div className="product-card-actions">
                                  <motion.button
                                    className="product-card-add-to-cart"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => handleAddToCart(product, e)}
                                  >
                                    <FaShoppingCart /> Add
                                  </motion.button>
                                  <motion.button
                                    className="product-card-buy-now"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => handleBuyNow(product, e)}
                                  >
                                    Buy
                                  </motion.button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </section>
          </motion.div>
        ) : (
          /* Product Detail View */
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
              >
                <FaArrowLeft /> Back to Products
              </motion.button>

              <motion.div 
                className="product-detail-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="product-detail-image"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedProduct.image ? (
                    <motion.img 
                      src={getImageUrl(selectedProduct.image)} 
                      alt={selectedProduct.name}
                      whileHover={{ scale: 1.1 }}
                      onError={(e) => handleImageError(e, 'https://via.placeholder.com/800x600?text=Product+Image')}
                    />
                  ) : (
                    <div className="product-detail-image-placeholder">
                      <FaImage />
                      <span>No Image Available</span>
                    </div>
                  )}
                </motion.div>
                
                <div className="product-detail-content">
                  <motion.span 
                    className="product-detail-badge"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Hardware
                  </motion.span>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {selectedProduct.name}
                  </motion.h2>
                  
                  {selectedProduct.description && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {selectedProduct.description}
                    </motion.p>
                  )}
                  
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <motion.div 
                      className="product-features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      {selectedProduct.features.map((feature, i) => (
                        <div key={i} className="product-feature">
                          <FaCheckCircle />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {selectedProduct.brand && (
                    <motion.div 
                      className="product-features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="product-feature">
                        <FaCheckCircle />
                        <span>Brand: {selectedProduct.brand}</span>
                      </div>
                    </motion.div>
                  )}

                  {selectedProduct.price && (
                    <motion.div 
                      className="product-features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="product-feature">
                        <FaCheckCircle />
                        <span>Price: ₹{selectedProduct.price}</span>
                      </div>
                    </motion.div>
                  )}
                  
                  {selectedProduct.stock && (
                    <motion.div 
                      className="product-features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.85 }}
                    >
                      <div className="product-feature">
                        <FaCheckCircle />
                        <span>Stock: {selectedProduct.stock} units</span>
                      </div>
                    </motion.div>
                  )}
                  
                  {selectedProduct.rating && (
                    <motion.div 
                      className="stats-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <motion.div 
                        className="stat-item"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="stat-number">{selectedProduct.rating}</span>
                        <span className="stat-label">Rating</span>
                      </motion.div>
                    </motion.div>
                  )}

                  {selectedProduct.price && (
                    <motion.div 
                      className="product-actions"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button 
                          className="btn-primary"
                          onClick={() => handleAddToCart(selectedProduct, { stopPropagation: () => {} })}
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button 
                          className="btn-cta"
                          onClick={() => handleBuyNow(selectedProduct)}
                          style={{ background: '#28a745' }}
                        >
                          Buy Now
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Testimonials Section - Only show in main view */}
      {!selectedProduct && (
        <>
          <section className="testimonials-section">
            <div className="testimonials__bg-text" aria-hidden="true">Reviews</div>
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                viewport={{ once: true }}
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
        </>
      )}
    </motion.div>
  );
};

export default Hardware;