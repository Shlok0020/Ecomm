// src/components/ui/HardwareCard.jsx
import { motion } from 'framer-motion';
import { 
  FaArrowRight, 
  FaTools, 
  FaCog, 
  FaWrench, 
  FaIndustry,
  FaDoorOpen,
  FaLock,
  FaTint,
  FaRuler,
  FaHammer,
  FaScrewdriver,
  FaGem
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const HardwareCard = ({ product, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get appropriate icon based on category
  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    
    if (cat.includes('handle') || cat.includes('knob')) {
      return <FaDoorOpen />;
    } else if (cat.includes('hinge')) {
      return <FaCog />;
    } else if (cat.includes('lock') || cat.includes('security')) {
      return <FaLock />;
    } else if (cat.includes('tool') || cat.includes('hammer')) {
      return <FaHammer />;
    } else if (cat.includes('screw') || cat.includes('drill')) {
      return <FaScrewdriver />;
    } else if (cat.includes('paint') || cat.includes('color')) {
      return <FaTint />;
    } else if (cat.includes('measure') || cat.includes('ruler')) {
      return <FaRuler />;
    } else if (cat.includes('premium') || cat.includes('luxury')) {
      return <FaGem />;
    } else if (cat.includes('wrench') || cat.includes('spanner')) {
      return <FaWrench />;
    } else if (cat.includes('hardware') || cat.includes('general')) {
      return <FaIndustry />;
    } else {
      return <FaTools />;
    }
  };

  // Get gradient color based on category
  const getCategoryColor = (category) => {
    const cat = category?.toLowerCase() || '';
    
    if (cat.includes('handle') || cat.includes('knob')) {
      return 'linear-gradient(135deg, #c9a96e 0%, #a07840 100%)';
    } else if (cat.includes('hinge')) {
      return 'linear-gradient(135deg, #bd7b4d 0%, #8b5a2b 100%)';
    } else if (cat.includes('lock') || cat.includes('security')) {
      return 'linear-gradient(135deg, #4f8a8b 0%, #2c5a5b 100%)';
    } else if (cat.includes('tool')) {
      return 'linear-gradient(135deg, #c45a5a 0%, #8b3a3a 100%)';
    } else if (cat.includes('paint')) {
      return 'linear-gradient(135deg, #b1935c 0%, #7a6b3f 100%)';
    } else {
      return 'linear-gradient(135deg, #c9a96e 0%, #a07840 100%)';
    }
  };

  // Get badge text based on category
  const getBadgeText = (product) => {
    if (product.grade) return product.grade;
    if (product.material) return product.material;
    if (product.category) return product.category;
    return 'Hardware';
  };

  // Default placeholder image
  const getPlaceholderImage = () => {
    const category = product?.category?.toLowerCase() || '';
    
    if (category.includes('handle')) {
      return 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800';
    } else if (category.includes('hinge')) {
      return 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=800';
    } else if (category.includes('lock')) {
      return 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&q=80&w=800';
    } else {
      return 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: { 
        duration: 0.3, 
        ease: "easeOut",
        boxShadow: { duration: 0.3 }
      }
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

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.2 + (i * 0.1), duration: 0.4 }
    })
  };

  return (
    <motion.div 
      className="hardware-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Card Number (Decorative) */}
      <div className="card-number">{String(index + 1).padStart(2, '0')}</div>
      
      {/* Image Section */}
      <div className="card-image">
        <img 
          src={imageError ? getPlaceholderImage() : (product.image || getPlaceholderImage())} 
          alt={product.name || 'Hardware Product'}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="card-image-overlay"></div>
        
        {/* Category Badge */}
        {product.category && (
          <div className="category-badge">
            {getCategoryIcon(product.category)}
            <span>{product.category}</span>
          </div>
        )}
        
        {/* Material/Type Badge */}
        {(product.material || product.grade) && (
          <div className="material-badge">
            {product.material || product.grade}
          </div>
        )}
        
        {/* Admin Badge */}
        {product.isAdminAdded && (
          <div className="admin-badge">
            <FaIndustry /> New Arrival
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="card-content">
        <h3 className="card-title">{product.name || 'Premium Hardware'}</h3>
        
        {product.brand && (
          <p className="brand">
            <FaIndustry className="brand-icon" /> {product.brand}
          </p>
        )}
        
        <p className="card-description">
          {product.description || 'Premium quality hardware for all applications'}
        </p>
        
        {/* Specifications */}
        <div className="card-specs">
          {product.material && (
            <div className="spec-item">
              <span className="spec-label">Material:</span>
              <span className="spec-value">{product.material}</span>
            </div>
          )}
          
          {product.finish && (
            <div className="spec-item">
              <span className="spec-label">Finish:</span>
              <span className="spec-value">{product.finish}</span>
            </div>
          )}
          
          {product.size && (
            <div className="spec-item">
              <span className="spec-label">Size:</span>
              <span className="spec-value">{product.size}</span>
            </div>
          )}
        </div>
        
        {/* Features List */}
        {product.features && product.features.length > 0 && (
          <motion.ul className="features-list" initial="hidden" animate="visible">
            {product.features.slice(0, 3).map((feature, i) => (
              <motion.li 
                key={i} 
                custom={i}
                variants={featureVariants}
                whileHover={{ x: 5, color: 'var(--gold)' }}
              >
                {feature}
              </motion.li>
            ))}
            {product.features.length > 3 && (
              <li className="more-features">+{product.features.length - 3} more</li>
            )}
          </motion.ul>
        )}

        {/* Price Section */}
        <div className="card-price-section">
          <div className="price-container">
            <span className="current-price">₹{product.price || 0}</span>
            {product.unit && (
              <span className="price-unit">/{product.unit}</span>
            )}
          </div>
          
          {product.mrp && product.mrp > product.price && (
            <div className="price-discount">
              <span className="original-price">₹{product.mrp}</span>
              <span className="discount-badge">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
              </span>
            </div>
          )}
          
          {product.stock !== undefined && (
            <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
            </div>
          )}
        </div>

        {/* Footer with View Details Button */}
        <div className="card-footer">
          <Link to={`/hardware/${product.id}`} className="view-details-btn">
            <span>View Details</span>
            <motion.span 
              className="btn-icon"
              variants={arrowVariants}
            >
              <FaArrowRight />
            </motion.span>
          </Link>
          
          {/* Warranty Badge */}
          {product.warranty && (
            <div className="warranty-badge">
              <span>{product.warranty} warranty</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .hardware-card {
          position: relative;
          background: white;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 15px 35px -15px rgba(0,0,0,0.2);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(189, 123, 77, 0.1);
          cursor: pointer;
        }

        .hardware-card:hover {
          box-shadow: 0 30px 50px -20px rgba(189, 123, 77, 0.4);
          border-color: rgba(189, 123, 77, 0.3);
        }

        /* Card Number (Decorative) */
        .card-number {
          position: absolute;
          top: 15px;
          left: 15px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 700;
          color: rgba(189, 123, 77, 0.15);
          z-index: 2;
          line-height: 1;
          pointer-events: none;
        }

        /* Image Section */
        .card-image {
          height: 200px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .hardware-card:hover .card-image img {
          transform: scale(1.1);
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
          color: var(--wood-dark, #8b5a2b);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          z-index: 3;
          border: 1px solid rgba(189, 123, 77, 0.3);
        }

        .category-badge svg {
          color: var(--wood-light, #bd7b4d);
          font-size: 0.8rem;
        }

        /* Material Badge */
        .material-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(5px);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--wood-dark, #8b5a2b);
          z-index: 3;
          border: 1px solid rgba(189, 123, 77, 0.3);
        }

        /* Admin Badge */
        .admin-badge {
          position: absolute;
          bottom: 20px;
          right: 20px;
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
          margin: 0 0 0.3rem 0;
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
          background: var(--wood-light, #bd7b4d);
          transition: width 0.3s ease;
        }

        .hardware-card:hover .card-title::after {
          width: 70px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--wood-light, #bd7b4d);
          font-size: 0.9rem;
          margin: 0.5rem 0 0.2rem;
        }

        .brand-icon {
          font-size: 0.8rem;
        }

        .card-description {
          color: var(--gray-text, #666);
          margin: 0.5rem 0 1rem;
          line-height: 1.6;
          font-size: 0.9rem;
          flex: 1;
        }

        /* Specifications */
        .card-specs {
          margin: 0.5rem 0 1rem;
          padding: 0.8rem 0;
          border-top: 1px dashed rgba(189, 123, 77, 0.2);
          border-bottom: 1px dashed rgba(189, 123, 77, 0.2);
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        .spec-item:last-child {
          margin-bottom: 0;
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

        /* Features List */
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 1rem;
        }

        .features-list li {
          color: #666;
          margin-bottom: 0.4rem;
          padding-left: 1.5rem;
          position: relative;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }

        .features-list li::before {
          content: "✓";
          color: var(--wood-light, #bd7b4d);
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        .more-features {
          color: #999 !important;
          font-style: italic;
          font-size: 0.8rem !important;
        }

        .more-features::before {
          content: "+" !important;
        }

        /* Price Section */
        .card-price-section {
          margin: 0.5rem 0 1rem;
          padding: 0.5rem 0;
        }

        .price-container {
          display: flex;
          align-items: baseline;
          gap: 0.2rem;
        }

        .current-price {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--wood-light, #bd7b4d);
          line-height: 1;
        }

        .price-unit {
          font-size: 0.9rem;
          color: #999;
        }

        .price-discount {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-top: 0.3rem;
        }

        .original-price {
          font-size: 0.95rem;
          color: #999;
          text-decoration: line-through;
        }

        .discount-badge {
          background: rgba(189, 123, 77, 0.15);
          color: var(--wood-dark, #8b5a2b);
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .stock-status {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .in-stock {
          color: #4caf50;
        }

        .out-of-stock {
          color: #ef4444;
        }

        /* Footer */
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(189, 123, 77, 0.15);
        }

        .view-details-btn {
          background: none;
          border: none;
          color: var(--wood-light, #bd7b4d);
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
          color: var(--wood-dark, #8b5a2b);
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
        }

        /* Warranty Badge */
        .warranty-badge {
          background: rgba(189, 123, 77, 0.1);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--wood-dark, #8b5a2b);
          border: 1px solid rgba(189, 123, 77, 0.2);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .card-image {
            height: 180px;
          }
          
          .card-title {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 768px) {
          .card-image {
            height: 160px;
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
          .card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }
          
          .warranty-badge {
            align-self: flex-start;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default HardwareCard;