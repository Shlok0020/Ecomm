// src/pages/Glass/Glass.jsx - FIXED CART FUNCTIONALITY
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  FaShieldAlt,
  FaFire,
  FaWater,
  FaSun,
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaImage,
  FaRuler,
  FaCube,
  FaAward,
  FaTags,
  FaBoxOpen,
  FaSearch,
  FaCrown,
  FaBolt
} from 'react-icons/fa';
import glassService from '../services/glassService';
import toast from 'react-hot-toast';

// ============= IMAGE URL HELPER =============
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `api.newpremglasshouse.in${imagePath}`;
  return `api.newpremglasshouse.in/uploads/${imagePath}`;
};

const handleImageError = (e, fallbackUrl = 'https://via.placeholder.com/300x200?text=No+Image') => {
  e.target.onerror = null;
  e.target.src = fallbackUrl;
};
// ============================================

// CategoryGrid Component - SIDE ENTRANCE ANIMATIONS (NO BADGES)
const CategoryGrid = ({ categories, onCategoryClick }) => {
  const containerRef = useRef(null);
  const isContainerInView = useInView(containerRef, { once: true, amount: 0.1 });
  
  // Side entrance animations for categories (alternating left/right)
  const getCardVariants = (index) => {
    const side = index % 2 === 0 ? 'left' : 'right';
    
    return {
      hidden: { 
        opacity: 0, 
        x: side === 'left' ? -200 : 200,
        scale: 0.8
      },
      visible: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: { 
          duration: 0.8, 
          type: "spring", 
          bounce: 0.3,
          delay: index * 0.1
        }
      }
    };
  };

  // Hover animations
  const hoverVariant = {
    scale: 1.02,
    y: -10,
    boxShadow: '0 30px 60px -15px rgba(201,169,110,0.4)',
    transition: { duration: 0.3, type: "spring", stiffness: 300 }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="categories-grid"
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
            variants={getCardVariants(index)}
            initial="hidden"
            animate={isCardInView ? "visible" : "hidden"}
            whileHover={hoverVariant}
            onClick={() => onCategoryClick(category.id)}
            className="category-card-wrapper"
          >
            <motion.div 
              className="category-card"
              whileHover={{
                transition: { duration: 0.2 }
              }}
            >
              <div className="card-media">
                {category.image ? (
                  <motion.img 
                    src={getImageUrl(category.image)} 
                    alt={category.title} 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    loading="lazy"
                    onError={(e) => handleImageError(e)}
                  />
                ) : (
                  <div className="card-media-placeholder">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                      }}
                      transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <FaImage className="placeholder-icon" />
                    </motion.div>
                    <span>No Image</span>
                  </div>
                )}
                <div className="card-overlay"></div>
                <motion.div 
                  className="card-icon-badge"
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1,
                    backgroundColor: 'white',
                    color: 'var(--gold)'
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {category.icon}
                </motion.div>
              </div>
              
              <div className="card-content">
                <motion.div 
                  className="card-number"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isCardInView ? { opacity: 0.1, x: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  0{index + 1}
                </motion.div>
                
                <motion.h3 
                  className="card-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isCardInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                >
                  {category.title}
                  <motion.div 
                    className="card-title-line"
                    whileHover={{ width: 120 }}
                    transition={{ duration: 0.3 }}
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
                  initial={{ opacity: 0 }}
                  animate={isCardInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  {category.features.map((feature, i) => (
                    <motion.span 
                      key={i} 
                      className="card-feature"
                      whileHover={{ 
                        scale: 1.05,
                        x: 2,
                        backgroundColor: 'rgba(201,169,110,0.15)'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaCheckCircle /> {feature}
                    </motion.span>
                  ))}
                </motion.div>
                
                <div className="card-footer">
                  <motion.span 
                    className="card-link"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Explore <FaArrowRight />
                  </motion.span>
                  
                  <motion.div 
                    className="card-stats"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.span 
                      className="card-stat-number"
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      {category.types?.length || 0}
                    </motion.span>
                    <span className="card-stat-label">Products</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// Product Card Component - SIDE ENTRANCE ANIMATIONS (WITH FIXED CART)
const ProductCard = ({ product, onProductClick, onAddToCart, onBuyNow, onWishlist, isInWishlist, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  // ✅ Create a unique ID for the product
  const productId = product._id || product.id || `prod-${index}`;
  
  // Side entrance based on index (alternating left/right)
  const getEntranceVariant = () => {
    const side = index % 2 === 0 ? 'left' : 'right';
    
    return {
      hidden: { 
        opacity: 0, 
        x: side === 'left' ? -100 : 100,
        scale: 0.9
      },
      visible: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: { 
          duration: 0.6, 
          type: "spring", 
          bounce: 0.3,
          delay: index * 0.05
        }
      }
    };
  };

  // Hover animation
  const hoverVariant = {
    y: -10,
    scale: 1.02,
    boxShadow: '0 25px 50px -12px rgba(201,169,110,0.4)',
    transition: { duration: 0.3, type: "spring", stiffness: 300 }
  };

  return (
    <motion.div
      ref={cardRef}
      className="product-card"
      variants={getEntranceVariant()}
      initial="hidden"
      animate="visible"
      whileHover={hoverVariant}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onProductClick(product)}
    >
      <motion.button
        className={`product-wishlist-btn ${isInWishlist(productId) ? 'active' : ''}`}
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onWishlist(product, e);
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={isInWishlist(productId) ? { 
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 0.3 }}
        >
          <FaHeart />
        </motion.div>
      </motion.button>

      <div className="product-card-image">
        {product.image ? (
          <motion.img 
            src={getImageUrl(product.image)} 
            alt={product.name}
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            loading="lazy"
            onError={(e) => handleImageError(e)}
          />
        ) : (
          <div className="product-image-placeholder">
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <FaImage />
            </motion.div>
          </div>
        )}
      </div>

      <div className="product-card-info">
        <div className="product-card-header">
          <h3 className="product-title">{product.name}</h3>
          {product.rating && (
            <motion.div 
              className="product-rating"
              whileHover={{ scale: 1.1 }}
              animate={{ 
                boxShadow: ['0 0 0 rgba(255,184,0,0)', '0 0 10px rgba(255,184,0,0.3)', '0 0 0 rgba(255,184,0,0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaStar className="star-icon" />
              <span>{product.rating}</span>
            </motion.div>
          )}
        </div>

        {product.description && (
          <motion.p 
            className="product-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {product.description}
          </motion.p>
        )}

        <div className="product-specs">
          {product.thickness && (
            <motion.span 
              className="spec-item"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: 'rgba(201,169,110,0.15)'
              }}
              transition={{ duration: 0.2 }}
            >
              <FaRuler /> {product.thickness}
            </motion.span>
          )}
          {product.size && (
            <motion.span 
              className="spec-item"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: 'rgba(201,169,110,0.15)'
              }}
              transition={{ duration: 0.2 }}
            >
              <FaCube /> {product.size}
            </motion.span>
          )}
          {product.brand && (
            <motion.span 
              className="spec-item"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: 'rgba(201,169,110,0.15)'
              }}
              transition={{ duration: 0.2 }}
            >
              <FaAward /> {product.brand}
            </motion.span>
          )}
        </div>

        {product.price && (
          <motion.div 
            className="product-price-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="price-tag">
              <span className="currency">₹</span>
              <span className="amount">{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="original-price">₹{product.mrp}</span>
                  <motion.span 
                    className="discount"
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </motion.span>
                </>
              )}
            </div>
          </motion.div>
        )}

        {product.price && (
          <motion.div 
            className="product-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className="add-to-cart-btn"
              whileHover={{ scale: 1.03, backgroundColor: '#a07840' }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, e);
              }}
            >
              <FaShoppingCart /> Add
            </motion.button>
            <motion.button
              className="buy-now-btn"
              whileHover={{ scale: 1.03, backgroundColor: '#1e7e34' }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onBuyNow(product, e);
              }}
            >
              Buy
            </motion.button>
          </motion.div>
        )}
      </div>
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
  const [wishlistItems, setWishlistItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const heroRef = useRef(null);
  const pageTopRef = useRef(null);

  // Smooth scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, selectedSubCategory, selectedProduct]);

  // Load wishlist on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Scroll progress animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / maxScroll) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse move effect - throttled for performance
  useEffect(() => {
    let timeoutId;
    const handleMouseMove = (e) => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 10,
          y: (e.clientY / window.innerHeight - 0.5) * 10
        });
        timeoutId = null;
      }, 50);
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // ============= FETCH GLASS PRODUCTS =============
  const fetchGlassCategories = useCallback(async (showToast = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await glassService.getAll();
      const products = response?.data || [];
      
      const processedProducts = products.map(product => ({
        ...product,
        id: product._id || product.id, // ✅ Ensure both id and _id exist
        _id: product._id,
        image: getImageUrl(product.image)
      }));
      
      const defaultCats = [
        { 
          id: 'window', 
          title: 'Window Glass',
          description: 'Premium quality window glass for modern facades and interiors.',
          features: ['Toughened', 'Sound Proof', 'UV Protection'],
          icon: <FaWindowMaximize />,
          image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
          keywords: ['window', 'window-glass', 'clear glass']
        },
        { 
          id: 'mirror', 
          title: 'Mirror Glass',
          description: 'High quality silver backing mirror for interiors.',
          features: ['Crystal Clear', 'Silver Backing', 'Scratch Resistant'],
          icon: <FaImages />,
          image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
          keywords: ['mirror', 'mirror-glass', 'silver mirror']
        },
        { 
          id: 'fluted', 
          title: 'Flute Glass',
          description: 'Decorative fluted glass for modern interior design.',
          features: ['Textured Finish', 'Light Diffusion', 'Privacy'],
          icon: <FaThLarge />,
          image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070&auto=format&fit=crop',
          keywords: ['flute', 'fluted', 'flute-glass', 'textured']
        },
        { 
          id: 'toughened', 
          title: 'Toughened Glass',
          description: 'Safety glass for doors, windows and partitions.',
          features: ['Heat Strengthened', 'Impact Resistant', 'Safety Glass'],
          icon: <FaShieldAlt />,
          image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
          keywords: ['toughened', 'tempered', 'safety glass']
        }
      ];
      
      const productsByCategory = {};
      defaultCats.forEach(cat => { productsByCategory[cat.id] = []; });
      productsByCategory['other'] = [];
      
      processedProducts.forEach(product => {
        if (!product) return;
        
        const subcategory = product.subcategory ? product.subcategory.toLowerCase() : '';
        let assigned = false;
        
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
        
        if (!assigned) {
          productsByCategory['other'].push(product);
        }
      });
      
      const categoriesWithProducts = defaultCats.map(cat => ({
        id: cat.id,
        title: cat.title,
        icon: cat.icon,
        description: cat.description,
        image: cat.image,
        features: cat.features,
        types: productsByCategory[cat.id] || []
      }));
      
      if (productsByCategory['other'].length > 0) {
        categoriesWithProducts.push({
          id: 'other',
          title: 'Other Glass Products',
          icon: <FaGlassCheers />,
          description: 'Additional glass products and varieties.',
          image: null,
          features: ['Premium Quality', 'Various Types', 'Best Price'],
          types: productsByCategory['other']
        });
      }
      
      setGlassCategories(categoriesWithProducts);
      
      if (showToast) {
        toast.success('Products updated!');
      }
      
    } catch (error) {
      console.error('Error fetching:', error);
      setError(error.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchGlassCategories();
    
    const handleProductsUpdated = () => {
      fetchGlassCategories(true);
    };
    
    window.addEventListener('glassProductsUpdated', handleProductsUpdated);
    
    return () => {
      window.removeEventListener('glassProductsUpdated', handleProductsUpdated);
    };
  }, [fetchGlassCategories]);

  // Handlers - memoized
  const handleCategoryClick = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
    setSelectedProduct(null);
  }, []);

  const handleSubCategoryClick = useCallback((subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedProduct(null);
  }, []);

  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const handleBack = useCallback(() => {
    if (selectedProduct) {
      setSelectedProduct(null);
    } else if (selectedSubCategory) {
      setSelectedSubCategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  }, [selectedProduct, selectedSubCategory, selectedCategory]);

  // 🔥 FIXED ADD TO CART HANDLER
  const handleAddToCart = useCallback((product, e) => {
    e.stopPropagation();
    
    if (!product.price) {
      toast.error('Price not available');
      return;
    }
    
    // ✅ Use _id as primary identifier
    const productId = product._id || product.id;
    
    if (!productId) {
      toast.error('Invalid product');
      return;
    }
    
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = currentCart.findIndex(item => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
    
    let updatedCart;
    if (existingItemIndex >= 0) {
      // Update quantity if exists
      updatedCart = currentCart.map((item, index) => {
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
      // Add new item with both id and _id
      const cartItem = {
        ...product,
        id: productId,
        _id: productId,
        quantity: 1
      };
      updatedCart = [...currentCart, cartItem];
      toast.success(`${product.name} added to cart!`);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event for navbar to update
    window.dispatchEvent(new Event('cartUpdated'));
    
    console.log('Cart updated:', updatedCart);
  }, []);

  // 🔥 FIXED ADD TO WISHLIST HANDLER
  const handleAddToWishlist = useCallback((product, e) => {
    e.stopPropagation();
    
    const productId = product._id || product.id;
    
    if (!productId) {
      toast.error('Invalid product');
      return;
    }
    
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if exists using ID
    const exists = currentWishlist.some(item => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
    
    let updatedWishlist;
    if (exists) {
      // Remove from wishlist
      updatedWishlist = currentWishlist.filter(item => {
        const itemId = item._id || item.id;
        return itemId !== productId;
      });
      toast.success(`${product.name} removed from wishlist!`);
    } else {
      // Add to wishlist with both ids
      const wishlistItem = {
        ...product,
        id: productId,
        _id: productId
      };
      updatedWishlist = [...currentWishlist, wishlistItem];
      toast.success(`${product.name} added to wishlist!`);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);
  }, []);

  // 🔥 FIXED BUY NOW HANDLER
  const handleBuyNow = useCallback((product, e) => {
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
          product: {
            ...product,
            id: product._id || product.id
          }
        } 
      });
      return;
    }
    
    navigate('/order', { 
      state: { 
        product: {
          ...product,
          id: product._id || product.id
        },
        category: 'glass'
      } 
    });
  }, [navigate]);

  // Memoized values
  const selectedCategoryData = useMemo(() => 
    glassCategories.find(c => c.id === selectedCategory), 
    [glassCategories, selectedCategory]
  );

  const selectedTypeData = useMemo(() => 
    selectedCategoryData?.types.find(t => t.id === selectedSubCategory), 
    [selectedCategoryData, selectedSubCategory]
  );

  // 🔥 FIXED isInWishlist function
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
  }, [wishlistItems]);

  // Filter products - memoized
  const getFilteredProducts = useCallback((products) => {
    if (!products) return [];
    let filtered = [...products];
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeFilter === 'price-low') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (activeFilter === 'price-high') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (activeFilter === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    return filtered;
  }, [searchQuery, activeFilter]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const pageTransition = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <div ref={pageTopRef} className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading premium glass products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={pageTopRef} className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={() => fetchGlassCategories(true)}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <div ref={pageTopRef} />
      <motion.div 
        className="glass-page"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <Helmet>
          <title>Premium Glass Products | New Prem Glass House</title>
          <meta name="description" content="Explore premium glass products at New Prem Glass House in Jharsuguda." />
        </Helmet>

        <motion.div 
          className="progress-bar"
          style={{ scaleX: scrollProgress / 100 }}
        />

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Jost:wght@200;300;400;500;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          :root {
            --gold: #c9a96e;
            --gold-light: #e8d5b0;
            --gold-dark: #a07840;
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
            min-height: 100vh;
          }

          .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
          }

          .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--gold), var(--gold-light));
            transform-origin: 0%;
            z-index: 9999;
          }

          .loading-container {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 2rem;
            background: var(--warm-white);
          }

          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--gold);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .loading-text {
            font-family: var(--sans);
            color: var(--gray-text);
          }

          .error-container {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 1.5rem;
            background: var(--warm-white);
            padding: 2rem;
            text-align: center;
          }

          .error-container h2 {
            font-family: var(--serif);
            color: #ef4444;
            font-size: 2rem;
          }

          .error-container p {
            color: var(--gray-text);
          }

          .error-container button {
            padding: 12px 30px;
            background: var(--gold);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-family: var(--sans);
            font-weight: 500;
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
            font-size: clamp(2rem, 5vw, 4.5rem);
            font-weight: 300;
            line-height: 1.1;
            color: var(--dark);
          }

          .mk-h2 em {
            font-style: italic;
            color: var(--gold);
          }

          .glass-hero {
            position: relative;
            min-height: 90vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, var(--dark), #1a1a1a);
            overflow: hidden;
            padding: 80px 0 60px;
          }

          @media (max-width: 768px) {
            .glass-hero {
              min-height: 80vh;
              padding: 100px 0 40px;
              align-items: flex-start;
            }
          }

          @media (max-width: 480px) {
            .glass-hero {
              padding: 90px 0 30px;
            }
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
            padding: 0 1rem;
          }

          .glass-hero__badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 0.8rem 1.5rem;
            border-radius: 40px;
            color: var(--gold);
            margin-bottom: 1rem;
            font-size: 0.9rem;
          }

          .glass-hero__title {
            font-family: var(--serif);
            font-size: clamp(4rem, 8vw, 5.5rem);
            font-weight: 300;
            color: white;
            margin-bottom: 1.5rem;
          }

          .glass-hero__title em {
            font-style: italic;
            color: var(--gold);
          }

          .glass-hero__desc {
            font-size: clamp(1rem, 2vw, 1.2rem);
            color: rgba(255,255,255,0.7);
            max-width: 700px;
            margin: 0 auto 2rem;
          }

          .hero-stats {
            display: flex;
            justify-content: center;
            gap: clamp(1.5rem, 4vw, 3rem);
            margin: 2rem 0;
            flex-wrap: wrap;
          }

          /* Mobile: 2x2 grid for stats */
          @media (max-width: 768px) {
            .hero-stats {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1rem;
              max-width: 400px;
              margin-left: auto;
              margin-right: auto;
            }
            
            .hero-stat {
              background: rgba(255,255,255,0.05);
              backdrop-filter: blur(10px);
              padding: 1rem 0.5rem;
              border-radius: 20px;
              border: 1px solid rgba(255,255,255,0.1);
              text-align: center;
            }
            
            .hero-stat h4 {
              font-size: 1.8rem;
              margin-bottom: 0.2rem;
            }
            
            .hero-stat p {
              font-size: 0.75rem;
            }
          }
          
          @media (max-width: 480px) {
            .hero-stats {
              gap: 0.75rem;
              max-width: 320px;
            }
            
            .hero-stat {
              padding: 0.8rem 0.3rem;
            }
            
            .hero-stat h4 {
              font-size: 1.5rem;
            }
            
            .hero-stat p {
              font-size: 0.7rem;
            }
          }

          .hero-stat h4 {
            font-family: var(--serif);
            font-size: clamp(1.8rem, 4vw, 2.5rem);
            color: var(--gold);
          }

          .hero-stat p {
            color: rgba(255,255,255,0.7);
            text-transform: uppercase;
            font-size: 0.8rem;
          }

          .hero-features {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
            flex-wrap: wrap;
          }

          .hero-feature {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.6rem 1.2rem;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border-radius: 50px;
            color: white;
            font-size: 0.9rem;
          }

          .hero-feature svg {
            color: var(--gold);
          }

          .hero-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
            flex-wrap: wrap;
          }

          .hero-btn-primary,
          .hero-btn-outline {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.8rem 2rem;
            border-radius: 40px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s;
          }

          .hero-btn-primary {
            background: var(--gold);
            color: var(--dark);
          }

          .hero-btn-primary:hover {
            background: white;
            transform: translateY(-2px);
          }

          .hero-btn-outline {
            background: transparent;
            color: white;
            border: 2px solid var(--gold);
          }

          .hero-btn-outline:hover {
            background: var(--gold);
            color: var(--dark);
          }

          .rotate-90 {
            transform: rotate(90deg);
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
            margin-bottom: 2rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }

          .back-btn:hover {
            transform: translateX(-3px);
            color: var(--gold);
          }

          .categories-section {
            padding: 60px 0 80px;
            background: linear-gradient(135deg, #f8f5f0, #f0e9e0);
          }

          .categories-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin-top: 3rem;
          }

          .category-card-wrapper {
            overflow: hidden;
            border-radius: 40px;
          }

          .category-card {
            background: white;
            border-radius: 40px;
            overflow: hidden;
            box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15);
            height: auto;
            min-height: 650px;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            will-change: transform;
          }

          .card-media {
            position: relative;
            height: 320px;
            overflow: hidden;
            background: #f0f0f0;
          }

          .card-media img {
            width: 100%;
            height: 100%;
            object-fit: cover;
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
            gap: 10px;
          }

          .card-media-placeholder svg {
            font-size: 3rem;
            opacity: 0.5;
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
            width: 60px;
            height: 60px;
            background: var(--gold);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.8rem;
            z-index: 3;
            border: 3px solid white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }

          .card-content {
            padding: 30px;
            flex: 1;
            display: flex;
            flex-direction: column;
            background: white;
            position: relative;
          }

          .card-number {
            position: absolute;
            top: -20px;
            right: 30px;
            font-family: var(--serif);
            font-size: 5rem;
            font-weight: 700;
            color: rgba(201,169,110,0.1);
            line-height: 1;
            z-index: 0;
          }

          .card-title {
            font-family: var(--serif);
            font-size: clamp(1.8rem, 3vw, 2.2rem);
            font-weight: 600;
            color: var(--dark);
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
          }

          .card-title-line {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 60px;
            height: 3px;
            background: var(--gold);
          }

          .card-description {
            color: var(--gray-text);
            font-size: 0.95rem;
            line-height: 1.5;
            margin: 15px 0 20px;
          }

          .card-features {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
          }

          .card-feature {
            background: rgba(201,169,110,0.08);
            color: var(--gold-dark);
            padding: 6px 12px;
            border-radius: 30px;
            font-size: 0.8rem;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
            padding-top: 20px;
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

          .card-stats {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }

          .card-stat-number {
            font-family: var(--serif);
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--dark);
            line-height: 1;
          }

          .card-stat-label {
            font-size: 0.75rem;
            color: var(--gray-text);
          }

          .types-section {
            padding: 60px 0 80px;
          }

          .category-header {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 3rem;
            padding: 2rem;
            background: white;
            border-radius: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          }

          .category-header-icon {
            width: 70px;
            height: 70px;
            background: var(--gold);
            border-radius: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
          }

          .category-header-content h2 {
            font-family: var(--serif);
            font-size: clamp(2rem, 4vw, 3rem);
            color: var(--dark);
            margin-bottom: 0.5rem;
          }

          .category-header-content p {
            color: var(--gray-text);
          }

          .filter-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 2rem;
            align-items: center;
            justify-content: space-between;
          }

          .search-box {
            flex: 1;
            min-width: 250px;
            position: relative;
          }

          .search-box input {
            width: 100%;
            padding: 12px 20px;
            padding-right: 45px;
            border: 1px solid rgba(201,169,110,0.2);
            border-radius: 40px;
            font-family: var(--sans);
            font-size: 0.95rem;
          }

          .search-box input:focus {
            outline: none;
            border-color: var(--gold);
          }

          .search-box svg {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gold);
          }

          .filter-options {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }

          .filter-btn {
            padding: 8px 16px;
            border: 1px solid rgba(201,169,110,0.2);
            border-radius: 30px;
            background: white;
            color: var(--gray-text);
            font-size: 0.85rem;
            cursor: pointer;
          }

          .filter-btn.active {
            background: var(--gold);
            color: white;
            border-color: var(--gold);
          }

          .products-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
            margin-top: 2rem;
          }

          .product-card {
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 20px rgba(0,0,0,0.06);
            cursor: pointer;
            position: relative;
            will-change: transform;
          }

          .product-wishlist-btn {
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
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 10;
            border: none;
          }

          .product-wishlist-btn.active {
            background: #ff4d4d;
            color: white;
          }

          .product-card-image {
            position: relative;
            height: 200px;
            overflow: hidden;
            background: #f5f5f5;
          }

          .product-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .product-image-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
            color: #999;
          }

          .product-image-placeholder svg {
            font-size: 3rem;
            opacity: 0.4;
          }

          .product-card-info {
            padding: 18px 16px;
          }

          .product-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
          }

          .product-title {
            font-family: var(--sans);
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--dark);
            flex: 1;
            margin-right: 10px;
          }

          .product-rating {
            display: flex;
            align-items: center;
            gap: 4px;
            background: rgba(255, 184, 0, 0.1);
            padding: 4px 8px;
            border-radius: 20px;
          }

          .product-rating .star-icon {
            color: #ffb800;
            font-size: 0.8rem;
          }

          .product-rating span {
            font-size: 0.8rem;
            font-weight: 600;
          }

          .product-description {
            font-size: 0.85rem;
            color: var(--gray-text);
            margin-bottom: 12px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .product-specs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 15px;
          }

          .spec-item {
            background: rgba(201,169,110,0.08);
            color: var(--gold-dark);
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .product-price-section {
            margin-bottom: 15px;
          }

          .price-tag {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .price-tag .currency {
            font-size: 0.9rem;
            color: var(--gray-text);
          }

          .price-tag .amount {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--dark);
          }

          .price-tag .original-price {
            font-size: 0.8rem;
            color: #999;
            text-decoration: line-through;
          }

          .price-tag .discount {
            font-size: 0.7rem;
            background: #28a745;
            color: white;
            padding: 2px 6px;
            border-radius: 12px;
          }

          .product-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .add-to-cart-btn,
          .buy-now-btn {
            padding: 8px;
            border: none;
            border-radius: 30px;
            font-size: 0.8rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: pointer;
          }

          .add-to-cart-btn {
            background: var(--gold);
            color: white;
          }

          .buy-now-btn {
            background: #28a745;
            color: white;
          }

          .add-to-cart-btn:disabled,
          .buy-now-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          .product-detail-section {
            padding: 60px 0 80px;
          }

          .product-detail-card {
            background: white;
            border-radius: 40px;
            overflow: hidden;
            display: grid;
            grid-template-columns: 1fr 1fr;
            box-shadow: 0 30px 60px -30px rgba(0,0,0,0.3);
          }

          .product-detail-image {
            height: 500px;
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
            padding: 50px;
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
            font-size: clamp(2.5rem, 4vw, 3.5rem);
            margin-bottom: 1rem;
          }

          .product-detail-description {
            color: var(--gray-text);
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .product-detail-features {
            margin: 2rem 0;
          }

          .product-detail-feature {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .product-detail-feature svg {
            color: var(--gold);
          }

          .product-detail-stats {
            display: flex;
            gap: 2rem;
            margin: 2rem 0;
            padding-top: 2rem;
            border-top: 1px solid rgba(0,0,0,0.05);
          }

          .detail-stat-number {
            font-family: var(--serif);
            font-size: 2rem;
            color: var(--gold);
          }

          .detail-stat-label {
            font-size: 0.8rem;
            color: var(--gray-text);
          }

          .product-detail-actions {
            display: flex;
            gap: 1.5rem;
            margin-top: 2rem;
            flex-wrap: wrap;
          }

          @media (max-width: 1200px) {
            .categories-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .products-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (max-width: 1024px) {
            .products-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .product-detail-card {
              grid-template-columns: 1fr;
            }
            .product-detail-image {
              height: 400px;
            }
          }

          @media (max-width: 768px) {
            .container {
              padding: 0 1rem;
            }
            .categories-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
            .category-card {
              min-height: auto;
            }
            .card-media {
              height: 250px;
            }
            .products-grid {
              grid-template-columns: 1fr;
            }
            .category-header {
              flex-direction: column;
              text-align: center;
              gap: 1rem;
            }
            .filter-bar {
              flex-direction: column;
            }
            .search-box {
              width: 100%;
            }
            .product-detail-actions {
              flex-direction: column;
            }
            .hero-buttons {
              flex-direction: column;
            }
            .hero-btn-primary,
            .hero-btn-outline {
              width: 100%;
              justify-content: center;
            }
          }

          @media (max-width: 480px) {
            .product-actions {
              grid-template-columns: 1fr;
            }
            .product-card-header {
              flex-direction: column;
              gap: 0.5rem;
            }
            .product-rating {
              align-self: flex-start;
            }
          }
        `}</style>

        <section className="glass-hero" ref={heroRef}>
          <div className="glass-hero__bg">
            <motion.img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"
              alt="Premium Glass"
              animate={{
                x: mousePosition.x,
                y: mousePosition.y
              }}
              transition={{ type: "spring", stiffness: 30, damping: 20 }}
            />
          </div>
          <div className="glass-hero__vignette" />
          
          <div className="container">
            <div className="glass-hero__content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="glass-hero__badge">
                  <FaStore /> Premium Glass Collection
                </div>
              </motion.div>
              
              <motion.h1
                className="glass-hero__title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Discover Our <br/><em>Glass Range</em>
              </motion.h1>
              
              <motion.p
                className="glass-hero__desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                India's most trusted glass manufacturer with premium quality products.
              </motion.p>

              <motion.div 
                className="hero-stats"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.5 }
                  }
                }}
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
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.5 }
                      }
                    }}
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
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.7 }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                {[
                  { icon: <FaShieldAlt />, text: 'Toughened' },
                  { icon: <FaSun />, text: 'UV Protection' },
                  { icon: <FaWater />, text: 'Water Resistant' },
                  { icon: <FaFire />, text: 'Fire Resistant' }
                ].map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="hero-feature"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.5 }
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.4 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="hero-buttons"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.9 }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: { duration: 0.5 }
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/contact" className="hero-btn-primary">
                    Get Free Quote <FaArrowRight />
                  </Link>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: { duration: 0.5 }
                    }
                  }}
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

        <AnimatePresence mode="wait">
          {!selectedCategory && (
            <motion.section 
              key="categories"
              className="categories-section"
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 }
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <div className="container">
                <motion.div 
                  className="mk-label"
                  style={{ justifyContent: 'center' }}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mk-label-line"></div>
                  <span>OUR PRODUCTS</span>
                  <div className="mk-label-line"></div>
                </motion.div>
                
                <motion.h2 
                  className="mk-h2" 
                  style={{ textAlign: 'center' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Glass <em>Categories</em>
                </motion.h2>

                {glassCategories.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px', color: 'var(--gray-text)' }}>
                    No categories found
                  </div>
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
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 }
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <div className="container">
                <motion.button 
                  className="back-btn" 
                  onClick={handleBack}
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaArrowLeft /> Back
                </motion.button>

                <motion.div 
                  className="category-header"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
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
                    <h2>{selectedCategoryData.title}</h2>
                    <p>{selectedCategoryData.description}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="filter-bar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="search-box">
                    <input 
                      type="text" 
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch />
                  </div>
                  <div className="filter-options">
                    <button 
                      className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`filter-btn ${activeFilter === 'price-low' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('price-low')}
                    >
                      Price: Low
                    </button>
                    <button 
                      className={`filter-btn ${activeFilter === 'price-high' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('price-high')}
                    >
                      Price: High
                    </button>
                    <button 
                      className={`filter-btn ${activeFilter === 'rating' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('rating')}
                    >
                      Top Rated
                    </button>
                  </div>
                </motion.div>

                {getFilteredProducts(selectedCategoryData.types).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px', color: 'var(--gray-text)' }}>
                    No products found
                  </div>
                ) : (
                  <motion.div 
                    className="products-grid"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.05, delayChildren: 0.6 }
                      }
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {getFilteredProducts(selectedCategoryData.types).map((product, index) => (
                      <ProductCard
                        key={product._id || product.id || `product-${index}`}
                        product={product}
                        index={index}
                        onProductClick={handleProductClick}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onWishlist={handleAddToWishlist}
                        isInWishlist={isInWishlist}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}

          {selectedSubCategory && selectedTypeData && (
            <motion.section 
              key="detail"
              className="product-detail-section"
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 }
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <div className="container">
                <motion.button 
                  className="back-btn" 
                  onClick={handleBack}
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <FaArrowLeft /> Back
                </motion.button>

                <motion.div 
                  className="product-detail-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="product-detail-image">
                    {selectedTypeData.image ? (
                      <img 
                        src={getImageUrl(selectedTypeData.image)} 
                        alt={selectedTypeData.name}
                        onError={(e) => handleImageError(e)}
                      />
                    ) : (
                      <div className="product-detail-image-placeholder">
                        <FaImage />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="product-detail-content">
                    <span className="product-detail-badge">
                      {selectedCategoryData?.title}
                    </span>
                    
                    <h2>{selectedTypeData.name}</h2>
                    
                    {selectedTypeData.description && (
                      <p className="product-detail-description">
                        {selectedTypeData.description}
                      </p>
                    )}
                    
                    <div className="product-detail-features">
                      {selectedTypeData.thickness && (
                        <div className="product-detail-feature">
                          <FaRuler />
                          <span>Thickness: {selectedTypeData.thickness}</span>
                        </div>
                      )}
                      {selectedTypeData.size && (
                        <div className="product-detail-feature">
                          <FaCube />
                          <span>Size: {selectedTypeData.size}</span>
                        </div>
                      )}
                      {selectedTypeData.brand && (
                        <div className="product-detail-feature">
                          <FaAward />
                          <span>Brand: {selectedTypeData.brand}</span>
                        </div>
                      )}
                      {selectedTypeData.price && (
                        <div className="product-detail-feature">
                          <FaTags />
                          <span>Price: ₹{selectedTypeData.price}</span>
                        </div>
                      )}
                    </div>
                    
                    {selectedTypeData.price && (
                      <div className="product-detail-actions">
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(selectedTypeData, { stopPropagation: () => {} })}
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>
                        <button 
                          className="buy-now-btn"
                          onClick={() => handleBuyNow(selectedTypeData)}
                        >
                          Buy Now
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Glass;