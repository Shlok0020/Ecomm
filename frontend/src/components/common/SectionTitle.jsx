// src/components/common/SectionTitle.jsx
import { motion } from 'framer-motion';
import { FaGem, FaTree, FaCouch, FaWrench } from 'react-icons/fa';

const SectionTitle = ({ 
  title, 
  subtitle, 
  center = true,
  light = false,
  icon = null,
  badge = null,
  titleSize = 'large', // small, medium, large
  titleColor = 'dark' // dark, light, gold
}) => {
  
  // Get title size
  const getTitleSize = () => {
    switch(titleSize) {
      case 'small':
        return '1.8rem';
      case 'medium':
        return '2.2rem';
      case 'large':
        return '2.8rem';
      default:
        return '2.5rem';
    }
  };

  // Get title color
  const getTitleColor = () => {
    switch(titleColor) {
      case 'light':
        return '#ffffff';
      case 'gold':
        return '#c9a96e';
      default:
        return '#111111';
    }
  };

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: '60px',
      transition: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { duration: 0.5, type: "spring", stiffness: 200 }
    }
  };

  return (
    <motion.div 
      className={`section-title ${center ? 'text-center' : ''} ${light ? 'light' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={titleVariants}
    >
      {/* Badge (if provided) */}
      {badge && (
        <motion.div 
          className="title-badge"
          variants={iconVariants}
        >
          {badge}
        </motion.div>
      )}

      {/* Icon (if provided) */}
      {icon && (
        <motion.div 
          className="title-icon"
          variants={iconVariants}
        >
          {icon}
        </motion.div>
      )}

      {/* Main Title */}
      <motion.h2 
        className="title-main"
        style={{
          fontSize: getTitleSize(),
          color: getTitleColor()
        }}
      >
        {title}
      </motion.h2>

      {/* Animated Underline */}
      <motion.div 
        className="title-underline"
        variants={lineVariants}
      />

      {/* Subtitle (if provided) */}
      {subtitle && (
        <motion.p 
          className="title-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}

      <style jsx>{`
        .section-title {
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        /* Center alignment */
        .text-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Light variant for dark backgrounds */
        .light .title-main {
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .light .title-subtitle {
          color: rgba(255,255,255,0.8);
        }

        /* Badge styling */
        .title-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(201, 169, 110, 0.1);
          color: #c9a96e;
          padding: 0.4rem 1.2rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 1rem;
          border: 1px solid rgba(201, 169, 110, 0.2);
        }

        /* Icon styling */
        .title-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          border-radius: 50%;
          color: white;
          font-size: 1.8rem;
          margin-bottom: 1rem;
          box-shadow: 0 10px 20px rgba(201, 169, 110, 0.2);
        }

        /* Main title */
        .title-main {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          line-height: 1.2;
          margin: 0;
          position: relative;
          display: inline-block;
          letter-spacing: -0.02em;
        }

        /* Emphasized text within title */
        .title-main em {
          font-style: italic;
          color: #c9a96e;
          font-weight: 500;
        }

        /* Animated underline */
        .title-underline {
          height: 3px;
          background: linear-gradient(90deg, #c9a96e, #a07840, #c9a96e);
          margin-top: 0.8rem;
          border-radius: 3px;
        }

        .text-center .title-underline {
          margin-left: auto;
          margin-right: auto;
        }

        /* Subtitle */
        .title-subtitle {
          color: #666;
          font-size: 1rem;
          line-height: 1.8;
          max-width: 600px;
          margin: 1rem 0 0;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
        }

        .text-center .title-subtitle {
          margin-left: auto;
          margin-right: auto;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .title-main {
            font-size: 2.2rem !important;
          }
        }

        @media (max-width: 768px) {
          .section-title {
            margin-bottom: 1.5rem;
          }

          .title-main {
            font-size: 2rem !important;
          }

          .title-icon {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }

          .title-badge {
            font-size: 0.7rem;
            padding: 0.3rem 1rem;
          }

          .title-subtitle {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .title-main {
            font-size: 1.8rem !important;
          }

          .title-icon {
            width: 45px;
            height: 45px;
            font-size: 1.3rem;
          }

          .title-underline {
            width: 50px !important;
          }
        }

        /* For pages with dark backgrounds */
        .section-title.light .title-underline {
          background: linear-gradient(90deg, #ffffff, #c9a96e, #ffffff);
        }
      `}</style>
    </motion.div>
  );
};

// Predefined section titles for different pages
export const GlassSectionTitle = ({ subtitle }) => (
  <SectionTitle 
    title="Premium <em>Glass</em> Products"
    subtitle={subtitle || "Discover our extensive range of premium glass products"}
    icon={<FaGem />}
    badge="GLASS COLLECTION"
  />
);

export const PlywoodSectionTitle = ({ subtitle }) => (
  <SectionTitle 
    title="Premium <em>Plywood</em> Range"
    subtitle={subtitle || "High-quality plywood for every need and application"}
    icon={<FaTree />}
    badge="PLYWOOD"
  />
);

export const InteriorsSectionTitle = ({ subtitle }) => (
  <SectionTitle 
    title="Interior <em>Design</em>"
    subtitle={subtitle || "Transform your space with our expert interior solutions"}
    icon={<FaCouch />}
    badge="INTERIORS"
  />
);

export const HardwareSectionTitle = ({ subtitle }) => (
  <SectionTitle 
    title="Hardware <em>Solutions</em>"
    subtitle={subtitle || "Premium quality hardware for every application"}
    icon={<FaWrench />}
    badge="HARDWARE"
  />
);

export const AboutSectionTitle = ({ subtitle }) => (
  <SectionTitle 
    title="About <em>Us</em>"
    subtitle={subtitle || "Learn about our journey and commitment to quality"}
    badge="SINCE 2014"
  />
);

export const ContactSectionTitle = ({ subtitle }) => (
  <SectionTitle 
    title="Get in <em>Touch</em>"
    subtitle={subtitle || "We'd love to hear from you. Reach out to us anytime."}
    badge="CONTACT"
  />
);

export default SectionTitle;