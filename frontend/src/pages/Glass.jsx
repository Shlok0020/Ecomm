// src/pages/Glass/Glass.jsx - WITH PROPER IMAGE HANDLING
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  FaSun,
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaImage
} from 'react-icons/fa';
import glassService from '../services/glassService';
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

// CategoryGrid Component - WITH CATEGORY IMAGES
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
                {category.image ? (
                  <motion.img 
                    src={getImageUrl(category.image)} 
                    alt={category.title} 
                    variants={imageZoom}
                    initial="rest"
                    whileHover="hover"
                    onError={(e) => handleImageError(e, 'https://via.placeholder.com/400x300?text=Category')}
                  />
                ) : (
                  <div className="card-media-placeholder">
                    <FaImage className="placeholder-icon" />
                    <span>No Image</span>
                  </div>
                )}
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
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [glassCategories, setGlassCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);

  // Check login status and load cart/wishlist on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
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

  // ============= FETCH GLASS PRODUCTS - WITH CATEGORY IMAGES =============
  const fetchGlassCategories = async (showToast = false) => {
    console.log('🔵 Fetching glass data from backend...');
    setLoading(true);
    setError(null);
    
    try {
      // Get ALL glass products from database
      const response = await glassService.getAll();
      const products = response?.data || [];
      console.log('📦 All glass products from database:', products.length);
      
      // Process products to ensure images have full URLs
      const processedProducts = products.map(product => ({
        ...product,
        image: getImageUrl(product.image),
        images: product.images ? product.images.map(img => getImageUrl(img)) : []
      }));
      
      // Default categories with MANUAL IMAGES for all main categories
      const defaultCats = [
        { 
          id: 'window', 
          label: 'Window Glass', 
          color: '#4f8a8b',
          title: 'Window Glass',
          description: 'Premium quality window glass for modern facades and interiors.',
          features: ['Toughened', 'Sound Proof', 'UV Protection'],
          icon: <FaWindowMaximize />,
          image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
          keywords: ['window', 'window-glass', 'window glass', 'clear glass', 'float glass']
        },
        { 
          id: 'mirror', 
          label: 'Mirror Glass', 
          color: '#bd7b4d',
          title: 'Mirror Glass',
          description: 'High quality silver backing mirror for interiors.',
          features: ['Crystal Clear', 'Silver Backing', 'Scratch Resistant'],
          icon: <FaImages />,
          image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
          keywords: ['mirror', 'mirror-glass', 'mirror glass', 'silver mirror', 'reflective']
        },
        { 
          id: 'fluted', 
          label: 'Flute Glass', 
          color: '#c45a5a',
          title: 'Flute Glass',
          description: 'Decorative fluted glass for modern interior design.',
          features: ['Textured Finish', 'Light Diffusion', 'Privacy'],
          icon: <FaThLarge />,
          image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070&auto=format&fit=crop',
          keywords: ['flute', 'fluted', 'flute-glass', 'fluted-glass', 'flute glass', 'fluted glass', 'textured']
        },
        { 
          id: 'toughened', 
          label: 'Toughened Glass', 
          color: '#6a4e8c',
          title: 'Toughened Glass',
          description: 'Safety glass for doors, windows and partitions.',
          features: ['Heat Strengthened', 'Impact Resistant', 'Safety Glass'],
          icon: <FaShieldAlt />,
          image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
          keywords: ['toughened', 'tempered', 'safety glass', 'toughened-glass', 'strengthened']
        }
      ];
      
      // Create a map to store products by category
      const productsByCategory = {};
      
      // Initialize empty arrays for each category
      defaultCats.forEach(cat => {
        productsByCategory[cat.id] = [];
      });
      
      // Also create an "other" category for products that don't match any category
      productsByCategory['other'] = [];
      
      // Distribute products to appropriate categories based on subcategory
      processedProducts.forEach(product => {
        if (!product) return;
        
        const subcategory = product.subcategory ? product.subcategory.toLowerCase() : '';
        let assigned = false;
        
        // Try to assign to a matching category
        for (const cat of defaultCats) {
          const matches = cat.keywords.some(keyword => 
            subcategory.includes(keyword.toLowerCase())
          );
          
          if (matches) {
            productsByCategory[cat.id].push(product);
            assigned = true;
            break;
          }
        }
        
        // If no match found, put in "other" category
        if (!assigned) {
          productsByCategory['other'].push(product);
        }
      });
      
      // Create categories with their products
      const categoriesWithProducts = defaultCats.map(cat => {
        const categoryProducts = productsByCategory[cat.id] || [];
        
        return {
          id: cat.id,
          title: cat.title,
          icon: cat.icon,
          description: cat.description,
          image: cat.image,
          color: cat.color,
          features: cat.features,
          types: categoryProducts.map(p => ({
            id: p._id || p.id,
            name: p.name || '',
            description: p.description || '',
            image: p.image || null,
            price: p.price || null,
            mrp: p.mrp || null,
            stock: p.stock || null,
            thickness: p.thickness || null,
            size: p.size || null,
            brand: p.brand || null,
            subcategory: p.subcategory || null,
            category: p.category || 'glass',
            rating: p.rating || null,
            reviews: p.reviews || null,
            isAdminAdded: true,
            createdAt: p.createdAt
          }))
        };
      });
      
      // Add "Other" category if there are products that don't match
      if (productsByCategory['other'].length > 0) {
        categoriesWithProducts.push({
          id: 'other',
          title: 'Other Glass Products',
          icon: <FaGlassCheers />,
          description: 'Additional glass products and varieties.',
          image: null,
          color: '#888888',
          features: ['Premium Quality', 'Various Types', 'Best Price'],
          types: productsByCategory['other'].map(p => ({
            id: p._id || p.id,
            name: p.name || '',
            description: p.description || '',
            image: p.image || null,
            price: p.price || null,
            mrp: p.mrp || null,
            stock: p.stock || null,
            thickness: p.thickness || null,
            size: p.size || null,
            brand: p.brand || null,
            subcategory: p.subcategory || null,
            category: p.category || 'glass',
            rating: p.rating || null,
            reviews: p.reviews || null,
            isAdminAdded: true,
            createdAt: p.createdAt
          }))
        });
      }

      console.log('🏷️ Final categories with products:', 
        categoriesWithProducts.map(c => ({
          category: c.title,
          hasImage: c.image ? 'Yes' : 'No',
          productCount: c.types.length
        }))
      );
      
      setGlassCategories(categoriesWithProducts);
      
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

  // Initial fetch on mount
  useEffect(() => {
    console.log('🟣 Glass component mounted - fetching from database');
    fetchGlassCategories();
    
    // Real-time updates
    const handleStorageChange = (e) => {
      console.log('🟡 Storage changed:', e.key);
      if (e.key === 'glass_products' || e.key === null) {
        fetchGlassCategories(true);
      }
    };
    
    const handleProductsUpdated = () => {
      console.log('🟡 Products updated event');
      fetchGlassCategories(true);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('glassProductsUpdated', handleProductsUpdated);
    
    // Mouse move effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('glassProductsUpdated', handleProductsUpdated);
    };
  }, []);

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'window': return <FaWindowMaximize />;
      case 'mirror': return <FaImages />;
      case 'fluted': return <FaThLarge />;
      case 'toughened': return <FaShieldAlt />;
      default: return <FaGlassCheers />;
    }
  };

  const handleCategoryClick = (categoryId) => {
    console.log('👆 Category clicked:', categoryId);
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
    setSelectedProduct(null);
  };

  const handleSubCategoryClick = (subCategory) => {
    console.log('👆 Subcategory clicked:', subCategory);
    setSelectedSubCategory(subCategory);
    setSelectedProduct(null);
  };

  const handleProductClick = (product) => {
    console.log('👆 Product clicked:', product);
    setSelectedProduct(product);
  };

  const handleBack = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
    } else if (selectedSubCategory) {
      setSelectedSubCategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const handleRefresh = () => {
    fetchGlassCategories(true);
  };

  // 🔥 ADD TO CART HANDLER
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    
    if (!product.price) {
      toast.error('Price not available');
      return;
    }
    
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = currentCart.find(item => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = currentCart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
      toast.success(`Added another ${product.name} to cart!`);
    } else {
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
      toast.success(`${product.name} added to cart!`);
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // 🔥 ADD TO WISHLIST HANDLER
  const handleAddToWishlist = (product, e) => {
    e.stopPropagation();
    
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const exists = currentWishlist.some(item => item.id === product.id);
    
    let updatedWishlist;
    if (exists) {
      updatedWishlist = currentWishlist.filter(item => item.id !== product.id);
      toast.success(`${product.name} removed from wishlist!`);
    } else {
      updatedWishlist = [...currentWishlist, product];
      toast.success(`${product.name} added to wishlist!`);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);
  };

  // 🔥 BUY NOW HANDLER
  const handleBuyNow = (product, e) => {
    if (e) e.stopPropagation();
    
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
          from: '/glass',
          product: product 
        } 
      });
      return;
    }
    
    navigate('/order', { 
      state: { 
        product: product,
        category: 'glass'
      } 
    });
  };

  const selectedCategoryData = glassCategories.find(c => c.id === selectedCategory);
  const selectedTypeData = selectedCategoryData?.types.find(t => t.id === selectedSubCategory);

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

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
          background: #f0f0f0;
        }

        .card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s;
        }

        .card-media-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
          color: #999;
          font-size: 0.9rem;
          gap: 10px;
        }

        .card-media-placeholder .placeholder-icon {
          font-size: 3rem;
          opacity: 0.5;
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

        /* 🔥 NEW PRODUCT CARD STYLES */
        .types-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
        }

        .type-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .type-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(201,169,110,0.15);
        }

        .type-card-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .type-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .type-card:hover .type-card-image {
          transform: scale(1.08);
        }

        .type-card-image-placeholder {
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

        .type-card-image-placeholder svg {
          font-size: 3rem;
          opacity: 0.4;
        }

        .type-card-image-placeholder span {
          font-size: 0.8rem;
        }

        .type-card-wishlist {
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

        .type-card-wishlist:hover {
          background: #ff4d4d;
          color: white;
          transform: scale(1.1);
        }

        .type-card-wishlist.active {
          background: #ff4d4d;
          color: white;
        }

        .type-card-content {
          padding: 18px 16px;
        }

        .type-card-title {
          font-family: var(--sans);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .type-card-description {
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

        .type-card-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
        }

        .type-card-rating-stars {
          display: flex;
          gap: 2px;
          color: #ffb800;
          font-size: 0.8rem;
        }

        .type-card-rating-number {
          font-size: 0.8rem;
          color: var(--gray-text);
          margin-left: 4px;
        }

        .type-card-reviews {
          font-size: 0.75rem;
          color: #999;
        }

        .type-card-price-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .type-card-price {
          display: flex;
          flex-direction: column;
        }

        .type-card-current-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--dark);
          line-height: 1.2;
        }

        .type-card-current-price small {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--gray-text);
        }

        .type-card-mrp {
          font-size: 0.8rem;
          color: #999;
          text-decoration: line-through;
        }

        .type-card-stock {
          font-size: 0.75rem;
          color: #28a745;
          font-weight: 500;
        }

        .type-card-actions {
          display: flex;
          gap: 8px;
        }

        .type-card-add-to-cart {
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

        .type-card-add-to-cart:hover {
          background: var(--gold-dark);
          transform: translateY(-2px);
        }

        .type-card-add-to-cart:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .type-card-buy-now {
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

        .type-card-buy-now:hover {
          background: #218838;
          transform: translateY(-2px);
        }

        .type-card-buy-now:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .type-card-admin-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #4caf50;
          color: white;
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
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

        /* 🔥 BUY NOW BUTTON STYLES */
        .btn-buy-now {
          background: #28a745;
          color: white;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-buy-now:hover {
          background: #218838;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3);
        }

        .btn-buy-now:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 1200px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
          .types-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 1024px) {
          .product-detail-card { grid-template-columns: 1fr; }
          .product-detail-content { padding: 60px; }
          .types-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .categories-grid { grid-template-columns: 1fr; }
          .types-grid { grid-template-columns: 1fr; }
          .category-header { flex-direction: column; text-align: center; }
          .product-actions { flex-direction: column; }
          .btn-buy-now { width: 100%; justify-content: center; }
        }

        @media (max-width: 480px) {
          .type-card-actions {
            flex-direction: column;
          }
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
                { value: glassCategories.reduce((acc, cat) => acc + cat.types.length, 0) + '+', label: 'Products' },
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
                        hidden: { opacity: 0, y: 20 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: { 
                            duration: 0.5,
                            delay: index * 0.1
                          }
                        }
                      }}
                      whileHover={{ 
                        y: -8,
                        boxShadow: '0 15px 30px rgba(201,169,110,0.15)',
                        transition: { duration: 0.3 }
                      }}
                      onClick={() => handleSubCategoryClick(type.id)}
                    >
                      {/* Product Image with proper URL */}
                      <div className="type-card-image-container">
                        {type.image ? (
                          <img 
                            src={getImageUrl(type.image)} 
                            alt={type.name}
                            className="type-card-image"
                            onError={(e) => handleImageError(e)}
                          />
                        ) : (
                          <div className="type-card-image-placeholder">
                            <FaImage />
                            <span>No Image</span>
                          </div>
                        )}
                        
                        {/* Wishlist Button */}
                        <motion.button
                          className={`type-card-wishlist ${isInWishlist(type.id) ? 'active' : ''}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleAddToWishlist(type, e)}
                        >
                          <FaHeart />
                        </motion.button>
                        
                        {/* Admin Badge */}
                        {type.isAdminAdded && (
                          <div className="type-card-admin-badge">
                            Admin Added
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="type-card-content">
                        <h3 className="type-card-title">{type.name}</h3>
                        {type.description && (
                          <p className="type-card-description">{type.description}</p>
                        )}
                        
                        {/* Rating - Only show if admin provided */}
                        {type.rating && (
                          <div className="type-card-rating">
                            <div className="type-card-rating-stars">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} color={i < Math.floor(type.rating) ? '#ffb800' : '#e0e0e0'} />
                              ))}
                            </div>
                            <span className="type-card-rating-number">{type.rating}</span>
                            {type.reviews && (
                              <span className="type-card-reviews">({type.reviews} reviews)</span>
                            )}
                          </div>
                        )}
                        
                        {/* Price Section - Only show if admin provided price */}
                        {type.price && (
                          <div className="type-card-price-section">
                            <div className="type-card-price">
                              <span className="type-card-current-price">
                                ₹{type.price}
                              </span>
                              {type.mrp && type.mrp > type.price && (
                                <span className="type-card-mrp">₹{type.mrp}</span>
                              )}
                            </div>
                            {type.stock && (
                              <span className="type-card-stock">{type.stock} in stock</span>
                            )}
                          </div>
                        )}
                        
                        {/* Action Buttons - Only enable if price exists */}
                        <div className="type-card-actions">
                          <motion.button
                            className="type-card-add-to-cart"
                            whileHover={{ scale: type.price ? 1.02 : 1 }}
                            whileTap={{ scale: type.price ? 0.98 : 1 }}
                            onClick={(e) => type.price && handleAddToCart(type, e)}
                            disabled={!type.price}
                          >
                            <FaShoppingCart /> {type.price ? 'Add' : 'Unavailable'}
                          </motion.button>
                          <motion.button
                            className="type-card-buy-now"
                            whileHover={{ scale: type.price ? 1.02 : 1 }}
                            whileTap={{ scale: type.price ? 0.98 : 1 }}
                            onClick={(e) => type.price && handleBuyNow(type, e)}
                            disabled={!type.price}
                          >
                            {type.price ? 'Buy' : 'N/A'}
                          </motion.button>
                        </div>
                      </div>
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
                  {selectedTypeData.image ? (
                    <motion.img 
                      src={getImageUrl(selectedTypeData.image)} 
                      alt={selectedTypeData.name}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
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
                    {selectedCategoryData?.title}
                  </motion.span>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {selectedTypeData.name}
                  </motion.h2>
                  
                  {selectedTypeData.description && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {selectedTypeData.description}
                    </motion.p>
                  )}
                  
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

                  {selectedTypeData.brand && (
                    <motion.div 
                      className="product-features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75 }}
                    >
                      <div className="product-feature">
                        <FaCheckCircle />
                        <span>Brand: {selectedTypeData.brand}</span>
                      </div>
                    </motion.div>
                  )}

                  {selectedTypeData.price && (
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
                  
                  {selectedTypeData.stock && (
                    <motion.div 
                      className="product-features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.85 }}
                    >
                      <div className="product-feature">
                        <FaCheckCircle />
                        <span>Stock: {selectedTypeData.stock} units</span>
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className="stats-row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    {selectedTypeData.rating && (
                      <motion.div 
                        className="stat-item"
                        whileHover={{ scale: 1.1, y: -5 }}
                      >
                        <span className="stat-number">{selectedTypeData.rating}</span>
                        <span className="stat-label">Rating</span>
                      </motion.div>
                    )}
                    {selectedTypeData.reviews && (
                      <motion.div 
                        className="stat-item"
                        whileHover={{ scale: 1.1, y: -5 }}
                      >
                        <span className="stat-number">{selectedTypeData.reviews}+</span>
                        <span className="stat-label">Reviews</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {selectedTypeData.price && (
                    <motion.div 
                      className="product-actions"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      {/* Add to Cart Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <button 
                          className="btn-primary"
                          onClick={() => handleAddToCart(selectedTypeData, { stopPropagation: () => {} })}
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>
                      </motion.div>
                      
                      {/* Buy Now Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <button 
                          className="btn-buy-now"
                          onClick={() => handleBuyNow(selectedTypeData)}
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
    </motion.div>
  );
};

export default Glass;