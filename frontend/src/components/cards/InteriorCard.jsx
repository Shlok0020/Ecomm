// src/components/ui/InteriorCard.jsx
import { motion } from 'framer-motion';
import { 
  FaArrowRight, 
  FaHome, 
  FaBed, 
  FaKitchen, 
  FaTv, 
  FaUsers,
  FaCouch,
  FaBath,
  FaBuilding,
  FaRegHeart,
  FaEye,
  FaRulerCombined,
  FaCalendarAlt,
  FaStar,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaGem
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const InteriorCard = ({ project, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    
    if (cat.includes('modular kitchen') || cat.includes('kitchen')) {
      return <FaKitchen />;
    } else if (cat.includes('bedroom')) {
      return <FaBed />;
    } else if (cat.includes('living') || cat.includes('couch')) {
      return <FaCouch />;
    } else if (cat.includes('tv') || cat.includes('entertainment')) {
      return <FaTv />;
    } else if (cat.includes('bathroom') || cat.includes('bath')) {
      return <FaBath />;
    } else if (cat.includes('office') || cat.includes('commercial')) {
      return <FaBuilding />;
    } else if (cat.includes('wardrobe') || cat.includes('storage')) {
      return <FaHome />;
    } else {
      return <FaHome />;
    }
  };

  const getCategoryColor = (category) => {
    const cat = category?.toLowerCase() || '';
    
    if (cat.includes('kitchen')) {
      return 'linear-gradient(135deg, #c45a5a 0%, #8b3a3a 100%)';
    } else if (cat.includes('bedroom')) {
      return 'linear-gradient(135deg, #4f8a8b 0%, #2c5a5b 100%)';
    } else if (cat.includes('living')) {
      return 'linear-gradient(135deg, #bd7b4d 0%, #8b5a2b 100%)';
    } else if (cat.includes('bathroom')) {
      return 'linear-gradient(135deg, #b1935c 0%, #7a6b3f 100%)';
    } else {
      return 'linear-gradient(135deg, #c9a96e 0%, #a07840 100%)';
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

  const overlayVariants = {
    hidden: { opacity: 0, y: 20 },
    hover: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="interior-card"
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
        <motion.img 
          src={imageError ? 'https://via.placeholder.com/500x300/1a1a1a/c9a96e?text=Interior+Project' : (project.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800')} 
          alt={project.title || project.name || 'Interior Project'}
          onError={handleImageError}
          loading="lazy"
          variants={imageVariants}
        />
        
        {/* Overlay Gradient */}
        <div className="card-image-overlay"></div>
        
        {/* Category Badge */}
        {project.category && (
          <div className="category-badge" style={{ background: getCategoryColor(project.category) }}>
            {getCategoryIcon(project.category)}
            <span>{project.category}</span>
          </div>
        )}
        
        {/* Project Stats Overlay (appears on hover) */}
        <motion.div 
          className="project-stats-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate={isHovered ? "hover" : "hidden"}
        >
          <div className="stat-item">
            <FaRegHeart /> {project.likes || 234}
          </div>
          <div className="stat-item">
            <FaEye /> {project.views || 1234}
          </div>
          <div className="stat-item">
            <FaStar /> {project.rating || 4.9}
          </div>
        </motion.div>
        
        {/* Admin Badge */}
        {project.isAdminAdded && (
          <div className="admin-badge">
            <FaGem /> Featured Project
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="card-content">
        <h3 className="card-title">{project.title || project.name || 'Interior Project'}</h3>
        
        {project.client && (
          <p className="client-name">
            <FaUsers className="client-icon" /> {project.client}
          </p>
        )}
        
        <p className="card-description">
          {project.description || 'Premium interior design and execution with expert craftsmanship'}
        </p>
        
        {/* Specifications Grid */}
        <div className="specs-grid">
          {project.area && (
            <div className="spec-item">
              <FaRulerCombined className="spec-icon" />
              <span className="spec-value">{project.area}</span>
            </div>
          )}
          
          {project.size && !project.area && (
            <div className="spec-item">
              <FaRulerCombined className="spec-icon" />
              <span className="spec-value">{project.size}</span>
            </div>
          )}
          
          {project.completionDate && (
            <div className="spec-item">
              <FaCalendarAlt className="spec-icon" />
              <span className="spec-value">{project.completionDate}</span>
            </div>
          )}
          
          {project.duration && (
            <div className="spec-item">
              <FaCalendarAlt className="spec-icon" />
              <span className="spec-value">{project.duration}</span>
            </div>
          )}
          
          {project.location && (
            <div className="spec-item full-width">
              <FaMapMarkerAlt className="spec-icon" />
              <span className="spec-value">{project.location}</span>
            </div>
          )}
        </div>
        
        {/* Features List */}
        {project.features && project.features.length > 0 && (
          <div className="features-section">
            <h4 className="features-title">Key Features</h4>
            <div className="features-list">
              {project.features.slice(0, 3).map((feature, i) => (
                <div key={i} className="feature-item">
                  <FaCheckCircle className="feature-icon" />
                  <span>{feature}</span>
                </div>
              ))}
              {project.features.length > 3 && (
                <div className="feature-more">+{project.features.length - 3} more</div>
              )}
            </div>
          </div>
        )}

        {/* Price Section */}
        {project.price && (
          <div className="price-section">
            <span className="price-label">Project Value:</span>
            <span className="price-value">₹{project.price}</span>
          </div>
        )}

        {/* Footer with View Details Button */}
        <div className="card-footer">
          <Link to={`/interiors/${project.id}`} className="view-details-btn">
            <span>View Project</span>
            <motion.span 
              className="btn-icon"
              variants={arrowVariants}
            >
              <FaArrowRight />
            </motion.span>
          </Link>
          
          {/* Completion Badge */}
          {project.status === 'completed' && (
            <div className="completion-badge">
              <FaCheckCircle /> Completed
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .interior-card {
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

        .interior-card:hover {
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
          height: 280px;
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
            transparent 40%,
            rgba(0, 0, 0, 0.6) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Category Badge */
        .category-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 0.6rem 1.5rem;
          border-radius: 40px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          z-index: 3;
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(5px);
        }

        .category-badge svg {
          font-size: 1rem;
        }

        /* Project Stats Overlay */
        .project-stats-overlay {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          gap: 1rem;
          justify-content: center;
          z-index: 3;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(5px);
          padding: 0.4rem 1rem;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--dark, #111);
          border: 1px solid rgba(255,255,255,0.3);
        }

        .stat-item svg {
          color: var(--gold, #c9a96e);
        }

        /* Admin Badge */
        .admin-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: white;
          padding: 0.4rem 1.2rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          z-index: 3;
          box-shadow: 0 5px 15px rgba(201, 169, 110, 0.3);
          border: 1px solid rgba(255,255,255,0.2);
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
          font-size: 1.6rem;
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

        .interior-card:hover .card-title::after {
          width: 70px;
        }

        .client-name {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--gold-dark, #a07840);
          font-size: 0.9rem;
          margin: 0.8rem 0 0.2rem;
        }

        .client-icon {
          font-size: 0.8rem;
        }

        .card-description {
          color: var(--gray-text, #666);
          margin: 0.8rem 0 1rem;
          line-height: 1.6;
          font-size: 0.9rem;
          flex: 1;
        }

        /* Specifications Grid */
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
          margin: 1rem 0;
          padding: 1rem 0;
          border-top: 1px dashed rgba(201, 169, 110, 0.2);
          border-bottom: 1px dashed rgba(201, 169, 110, 0.2);
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        .spec-item.full-width {
          grid-column: span 2;
        }

        .spec-icon {
          color: var(--gold, #c9a96e);
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .spec-value {
          font-size: 0.9rem;
          color: var(--dark, #111);
          font-weight: 500;
        }

        /* Features Section */
        .features-section {
          margin: 0.5rem 0 1rem;
        }

        .features-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: var(--dark, #111);
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.85rem;
        }

        .feature-icon {
          color: var(--gold, #c9a96e);
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
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .price-label {
          font-size: 0.9rem;
          color: #888;
        }

        .price-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--gold, #c9a96e);
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
          font-size: 0.95rem;
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

        /* Completion Badge */
        .completion-badge {
          background: rgba(201, 169, 110, 0.1);
          padding: 0.3rem 1rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--gold-dark, #a07840);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          border: 1px solid rgba(201, 169, 110, 0.2);
        }

        .completion-badge svg {
          color: #4caf50;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .card-image {
            height: 240px;
          }
          
          .card-title {
            font-size: 1.4rem;
          }
        }

        @media (max-width: 768px) {
          .card-image {
            height: 220px;
          }
          
          .card-content {
            padding: 1.5rem 1.2rem 1.2rem;
          }
          
          .card-title {
            font-size: 1.3rem;
          }
          
          .card-number {
            font-size: 1.8rem;
          }
          
          .category-badge {
            padding: 0.4rem 1.2rem;
            font-size: 0.8rem;
          }
          
          .specs-grid {
            gap: 0.5rem;
          }
          
          .price-value {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .card-image {
            height: 200px;
          }
          
          .specs-grid {
            grid-template-columns: 1fr;
          }
          
          .spec-item.full-width {
            grid-column: span 1;
          }
          
          .card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }
          
          .completion-badge {
            align-self: flex-start;
          }
          
          .project-stats-overlay {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default InteriorCard;