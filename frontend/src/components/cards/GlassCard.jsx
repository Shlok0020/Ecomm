// src/components/ui/GlassCard.jsx
import { motion } from 'framer-motion';
import { FaArrowRight, FaRuler, FaTag, FaWeightHanging, FaGem, FaIndustry } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const GlassCard = ({ product, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Default placeholder images based on category
  const getPlaceholderImage = () => {
    const category = product?.category?.toLowerCase() || '';
    
    if (category.includes('window')) {
      return 'https://images.unsplash.com/photo-1590523277543-94a6e93b45e0?auto=format&fit=crop&q=80&w=800';
    } else if (category.includes('mirror')) {
      return 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800';
    } else if (category.includes('fluted')) {
      return 'https://images.unsplash.com/photo-1602576666092-bf6447a7293a?auto=format&fit=crop&q=80&w=800';
    } else if (category.includes('toughened')) {
      return 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=800';
    } else {
      return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      y: -10,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const iconVariants = {
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const arrowVariants = {
    hover: {
      x: 8,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="glass-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Card Number (for design) */}
      <div className="card-number">{String(index + 1).padStart(2, '0')}</div>
      
      {/* Image Section */}
      <div className="card-image">
        <motion.img 
          src={imageError ? getPlaceholderImage() : (product.image || getPlaceholderImage())} 
          alt={product.name || 'Glass Product'}
          onError={handleImageError}
          loading="lazy"
          variants={imageVariants}
        />
        
        {/* Overlay Gradient */}
        <div className="card-image-overlay"></div>
        
        {/* Category Badge */}
        {product.category && (
          <div className="category-badge">
            <FaTag className="badge-icon" />
            <span>{product.category}</span>
          </div>
        )}
        
        {/* Admin Badge (if added by admin) */}
        {product.isAdminAdded && (
          <div className="admin-badge">
            <FaIndustry /> New
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="card-content">
        <h3 className="card-title">{product.name || 'Premium Glass'}</h3>
        
        <p className="card-description">
          {product.description || 'Premium quality glass for various applications'}
        </p>
        
        {/* Specifications */}
        <div className="card-specs">
          {product.thickness && (
            <div className="spec-item">
              <FaRuler className="spec-icon" />
              <span className="spec-label">Thickness:</span>
              <span className="spec-value">
                {Array.isArray(product.thickness) 
                  ? product.thickness.join(', ') 
                  : product.thickness}
              </span>
            </div>
          )}
          
          {product.size && (
            <div className="spec-item">
              <FaWeightHanging className="spec-icon" />
              <span className="spec-label">Size:</span>
              <span className="spec-value">{product.size}</span>
            </div>
          )}
          
          {product.brand && (
            <div className="spec-item">
              <FaIndustry className="spec-icon" />
              <span className="spec-label">Brand:</span>
              <span className="spec-value">{product.brand}</span>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="card-price-section">
          <div className="price-container">
            <span className="current-price">₹{product.price || 0}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="original-price">₹{product.mrp}</span>
                <span className="discount-badge">
                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          
          {product.stock && (
            <span className="stock-badge">
              {product.stock > 0 ? '✓ In Stock' : 'Out of Stock'}
            </span>
          )}
        </div>

        {/* Footer with View Details Button */}
        <div className="card-footer">
          <Link to={`/glass/${product.id}`} className="view-details-btn">
            <span>View Details</span>
            <motion.span 
              className="btn-icon"
              variants={arrowVariants}
            >
              <FaArrowRight />
            </motion.span>
          </Link>
          
          {/* Product Rating (if available) */}
          {product.rating && (
            <div className="product-rating">
              <span className="rating-stars">
                {'★'.repeat(Math.floor(product.rating))}
                {product.rating % 1 >= 0.5 && '½'}
                {'☆'.repeat(5 - Math.ceil(product.rating))}
              </span>
              <span className="rating-count">({product.reviews || 0})</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          position: relative;
          background: white;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 15px 35px -15px rgba(0,0,0,0.2);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(201, 169, 110, 0.1);
          cursor: pointer;
        }

        .glass-card:hover {
          box-shadow: 0 30px 50px -20px rgba(201, 169, 110, 0.4);
          border-color: rgba(201, 169, 110, 0.3);
        }

        /* Card Number (Decorative) */
        .card-number {
          position: absolute;
          top: 15px;
          left: 15px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 700;
          color: rgba(201, 169, 110, 0.15);
          z-index: 2;
          line-height: 1;
          pointer-events: none;
        }

        /* Image Section */
        .card-image {
          height: 260px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform;
        }

        .card-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.4) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Category Badge */
        .category-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(5px);
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--gold-dark, #a07840);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          z-index: 3;
          border: 1px solid rgba(201, 169, 110, 0.3);
        }

        .badge-icon {
          color: var(--gold, #c9a96e);
          font-size: 0.7rem;
        }

        /* Admin Badge */
        .admin-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: #4caf50;
          color: white;
          padding: 0.3rem 1rem;
          border-radius: 30px;
          font-size: 0.7rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          z-index: 3;
          box-shadow: 0 5px 10px rgba(76, 175, 80, 0.3);
        }

        /* Content Section */
        .card-content {
          padding: 1.8rem 1.5rem 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .card-title {
          font-family: 'Cormorant Garamond', serif;
          margin: 0 0 0.5rem 0;
          color: var(--dark, #111111);
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          position: relative;
          display: inline-block;
        }

        .card-title::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 40px;
          height: 2px;
          background: var(--gold, #c9a96e);
          transition: width 0.3s ease;
        }

        .glass-card:hover .card-title::after {
          width: 70px;
        }

        .card-description {
          color: var(--gray-text, #666);
          margin-bottom: 1.2rem;
          line-height: 1.6;
          font-size: 0.9rem;
          flex: 1;
        }

        /* Specifications */
        .card-specs {
          margin: 0.5rem 0 1rem;
          padding: 0.8rem 0;
          border-top: 1px dashed rgba(201, 169, 110, 0.2);
          border-bottom: 1px dashed rgba(201, 169, 110, 0.2);
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.6rem;
          color: #666;
          font-size: 0.9rem;
        }

        .spec-item:last-child {
          margin-bottom: 0;
        }

        .spec-icon {
          color: var(--gold, #c9a96e);
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .spec-label {
          font-size: 0.85rem;
          color: #888;
          min-width: 70px;
        }

        .spec-value {
          font-size: 0.9rem;
          color: var(--dark, #111);
          font-weight: 500;
          flex: 1;
        }

        /* Price Section */
        .card-price-section {
          margin: 0.5rem 0 1rem;
          padding: 0.5rem 0;
        }

        .price-container {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .current-price {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--gold, #c9a96e);
          line-height: 1;
        }

        .original-price {
          font-size: 1rem;
          color: #999;
          text-decoration: line-through;
        }

        .discount-badge {
          background: rgba(201, 169, 110, 0.15);
          color: var(--gold-dark, #a07840);
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          border: 1px solid rgba(201, 169, 110, 0.3);
        }

        .stock-badge {
          display: inline-block;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: #4caf50;
          font-weight: 500;
        }

        /* Footer */
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(201, 169, 110, 0.15);
        }

        .view-details-btn {
          background: none;
          border: none;
          color: var(--gold, #c9a96e);
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s;
          letter-spacing: 0.5px;
        }

        .view-details-btn:hover {
          color: var(--gold-dark, #a07840);
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
        }

        /* Product Rating */
        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .rating-stars {
          color: var(--gold, #c9a96e);
          font-size: 0.9rem;
          letter-spacing: 2px;
        }

        .rating-count {
          color: #999;
          font-size: 0.8rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .card-image {
            height: 220px;
          }
          
          .card-title {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 768px) {
          .card-image {
            height: 200px;
          }
          
          .card-content {
            padding: 1.5rem 1.2rem 1.2rem;
          }
          
          .card-title {
            font-size: 1.2rem;
          }
          
          .card-number {
            font-size: 1.8rem;
          }
          
          .category-badge {
            padding: 0.3rem 1rem;
            font-size: 0.7rem;
          }
          
          .current-price {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .card-image {
            height: 180px;
          }
          
          .card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }
          
          .product-rating {
            align-self: flex-start;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default GlassCard;