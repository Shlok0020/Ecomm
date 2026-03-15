// src/components/ui/PlywoodCard.jsx
import { motion } from 'framer-motion';
import { 
  FaArrowRight, 
  FaIndustry, 
  FaLeaf, 
  FaFire, 
  FaWater, 
  FaShieldAlt,
  FaRuler,
  FaTag,
  FaTree,
  FaGem,
  FaCheckCircle,
  FaStar,
  FaCalendarAlt,
  FaWeightHanging
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const PlywoodCard = ({ product, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get appropriate icon based on grade
  const getGradeIcon = (grade) => {
    const g = grade?.toLowerCase() || '';
    
    if (g.includes('premium') || g.includes('bwp')) {
      return <FaGem />;
    } else if (g.includes('commercial')) {
      return <FaIndustry />;
    } else if (g.includes('fire') || g.includes('fr')) {
      return <FaFire />;
    } else if (g.includes('marine') || g.includes('water')) {
      return <FaWater />;
    } else if (g.includes('eco') || g.includes('green')) {
      return <FaLeaf />;
    } else {
      return <FaShieldAlt />;
    }
  };

  // Get color based on grade
  const getGradeColor = (grade) => {
    const g = grade?.toLowerCase() || '';
    
    if (g.includes('premium') || g.includes('bwp')) {
      return '#c45a5a';
    } else if (g.includes('commercial')) {
      return '#4f8a8b';
    } else if (g.includes('marine')) {
      return '#2c3e50';
    } else if (g.includes('fire')) {
      return '#e67e22';
    } else if (g.includes('eco')) {
      return '#27ae60';
    } else {
      return '#bd7b4d';
    }
  };

  // Get badge text
  const getBadgeText = (product) => {
    if (product.grade) return product.grade;
    if (product.category) return product.category;
    return 'Premium';
  };

  // Default placeholder image
  const getPlaceholderImage = () => {
    const grade = product?.grade?.toLowerCase() || '';
    
    if (grade.includes('marine')) {
      return 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=800';
    } else if (grade.includes('premium')) {
      return 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=800';
    } else {
      return 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=800';
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
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const arrowVariants = {
    hover: {
      x: 8,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const badgeVariants = {
    hover: {
      rotate: 360,
      scale: 1.1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="plywood-card"
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
      
      {/* Grade Badge */}
      <motion.div 
        className="card-badge" 
        style={{ backgroundColor: getGradeColor(product.grade) }}
        variants={badgeVariants}
      >
        {getGradeIcon(product.grade)}
        <span>{getBadgeText(product)}</span>
      </motion.div>
      
      {/* Image Section */}
      <div className="card-image">
        <motion.img 
          src={imageError ? getPlaceholderImage() : (product.image || getPlaceholderImage())} 
          alt={product.name || 'Plywood Product'}
          onError={handleImageError}
          loading="lazy"
          variants={imageVariants}
        />
        
        {/* Overlay Gradient */}
        <div className="card-image-overlay"></div>
        
        {/* Certification Badge */}
        {product.certification && (
          <div className="certification-badge">
            <FaCheckCircle /> {product.certification}
          </div>
        )}
        
        {/* Admin Badge */}
        {product.isAdminAdded && (
          <div className="admin-badge">
            <FaStar /> New Arrival
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="card-content">
        <h3 className="card-title">{product.name || 'Premium Plywood'}</h3>
        
        {product.brand && (
          <p className="brand">
            <FaIndustry className="brand-icon" /> {product.brand}
          </p>
        )}
        
        <p className="card-description">
          {product.description || 'Premium quality plywood for various applications'}
        </p>
        
        {/* Specifications */}
        <div className="card-specs">
          {/* Thickness */}
          {product.thickness && (
            <div className="spec-item">
              <FaRuler className="spec-icon" />
              <span className="spec-label">Thickness:</span>
              <div className="thickness-badges">
                {Array.isArray(product.thickness) ? 
                  product.thickness.map(t => (
                    <span key={t} className="badge">{t}</span>
                  )) : 
                  <span className="badge">{product.thickness}</span>
                }
              </div>
            </div>
          )}
          
          {/* Size */}
          {product.size && (
            <div className="spec-item">
              <FaWeightHanging className="spec-icon" />
              <span className="spec-label">Size:</span>
              <span className="spec-value">{product.size}</span>
            </div>
          )}
          
          {/* Grade/Type */}
          {product.grade && !product.thickness && (
            <div className="spec-item">
              <FaTag className="spec-icon" />
              <span className="spec-label">Grade:</span>
              <span className="spec-value">{product.grade}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="features-section">
            {product.features.slice(0, 3).map((feature, i) => (
              <div key={i} className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>{feature}</span>
              </div>
            ))}
            {product.features.length > 3 && (
              <div className="feature-more">+{product.features.length - 3} more</div>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="price-section">
          <div className="price-container">
            <span className="current-price">₹{product.price || 0}</span>
            <span className="price-unit">/sheet</span>
          </div>
          
          {product.mrp && product.mrp > product.price && (
            <div className="price-discount">
              <span className="original-price">₹{product.mrp}</span>
              <span className="discount-badge">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Stock & Warranty */}
        <div className="meta-info">
          {product.stock !== undefined && (
            <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
            </div>
          )}
          
          {product.warranty && (
            <div className="warranty-badge">
              <FaCalendarAlt /> {product.warranty}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="card-footer">
          <Link to={`/plywood/${product.id}`} className="view-details-btn">
            <span>View Details</span>
            <motion.span 
              className="btn-icon"
              variants={arrowVariants}
            >
              <FaArrowRight />
            </motion.span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .plywood-card {
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

        .plywood-card:hover {
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

        /* Grade Badge */
        .card-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.6rem 1.2rem;
          border-radius: 40px;
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 3;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(5px);
        }

        .card-badge svg {
          font-size: 0.9rem;
        }

        /* Image Section */
        .card-image {
          height: 250px;
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

        /* Certification Badge */
        .certification-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(5px);
          padding: 0.4rem 1rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--wood-dark, #8b5a2b);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          z-index: 3;
          border: 1px solid rgba(189, 123, 77, 0.3);
        }

        .certification-badge svg {
          color: #4caf50;
        }

        /* Admin Badge */
        .admin-badge {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: white;
          padding: 0.4rem 1.2rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          z-index: 3;
          box-shadow: 0 5px 15px rgba(201, 169, 110, 0.3);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .admin-badge svg {
          color: #ffd700;
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

        .plywood-card:hover .card-title::after {
          width: 70px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--wood-light, #bd7b4d);
          font-size: 0.9rem;
          margin: 0.8rem 0 0.2rem;
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
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
          color: #666;
          font-size: 0.9rem;
        }

        .spec-item:last-child {
          margin-bottom: 0;
        }

        .spec-icon {
          color: var(--wood-light, #bd7b4d);
          font-size: 0.9rem;
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .spec-label {
          font-size: 0.85rem;
          color: #888;
          min-width: 70px;
        }

        .thickness-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          flex: 1;
        }

        .badge {
          background: var(--cream, #f2ede4);
          padding: 0.2rem 0.8rem;
          border-radius: 30px;
          font-size: 0.75rem;
          color: var(--dark, #111);
          font-weight: 500;
          border: 1px solid rgba(189, 123, 77, 0.1);
        }

        .spec-value {
          font-size: 0.9rem;
          color: var(--dark, #111);
          font-weight: 500;
          flex: 1;
        }

        /* Features */
        .features-section {
          margin: 0.5rem 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.3rem;
          color: #666;
          font-size: 0.85rem;
        }

        .feature-icon {
          color: var(--wood-light, #bd7b4d);
          font-size: 0.8rem;
          flex-shrink: 0;
        }

        .feature-more {
          color: #999;
          font-size: 0.8rem;
          font-style: italic;
          margin-top: 0.2rem;
        }

        /* Price Section */
        .price-section {
          margin: 0.5rem 0;
        }

        .price-container {
          display: flex;
          align-items: baseline;
          gap: 0.2rem;
        }

        .current-price {
          font-size: 1.5rem;
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

        /* Meta Info */
        .meta-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0.5rem 0;
        }

        .stock-status {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .in-stock {
          color: #4caf50;
        }

        .out-of-stock {
          color: #ef4444;
        }

        .warranty-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(189, 123, 77, 0.1);
          padding: 0.2rem 0.8rem;
          border-radius: 20px;
          font-size: 0.7rem;
          color: var(--wood-dark, #8b5a2b);
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
          font-size: 0.95rem;
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
          
          .card-badge {
            padding: 0.4rem 1rem;
            font-size: 0.75rem;
          }
          
          .current-price {
            font-size: 1.3rem;
          }
          
          .meta-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .card-image {
            height: 180px;
          }
          
          .spec-item {
            flex-wrap: wrap;
          }
          
          .thickness-badges {
            margin-top: 0.3rem;
          }
          
          .price-discount {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default PlywoodCard;