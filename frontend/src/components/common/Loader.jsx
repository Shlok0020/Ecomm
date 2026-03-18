// src/components/common/Loader.jsx
import { motion } from 'framer-motion';

const Loader = ({ 
  fullScreen = true,
  message = 'Loading...',
  color = 'gold',
  size = 'md'
}) => {
  
  // Color mapping
  const colors = {
    gold: {
      primary: '#c9a96e',
      secondary: '#a07840',
      light: '#e8d5b0'
    },
    wood: {
      primary: '#bd7b4d',
      secondary: '#8b5a2b',
      light: '#deb887'
    },
    glass: {
      primary: '#4f8a8b',
      secondary: '#2c5a5b',
      light: '#8fcaca'
    }
  };

  const currentColor = colors[color] || colors.gold;

  // Size mapping
  const sizes = {
    sm: '40px',
    md: '60px',
    lg: '80px'
  };

  const spinnerSize = sizes[size] || sizes.md;

  // Loader content
  const loaderContent = (
    <div className="loader-content">
      <motion.div 
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `4px solid ${currentColor.light}`,
          borderTop: `4px solid ${currentColor.primary}`,
          borderRadius: '50%',
          boxShadow: `0 0 20px ${currentColor.primary}40`
        }}
      />
      
      {message && (
        <motion.p 
          className="loader-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            marginTop: '20px',
            color: currentColor.primary,
            fontSize: size === 'sm' ? '12px' : size === 'md' ? '14px' : '16px',
            fontFamily: 'Jost, sans-serif',
            fontWeight: 500,
            letterSpacing: '0.5px'
          }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  // Full screen loader
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className="loader-backdrop"></div>
        {loaderContent}
        
        <style jsx>{`
          .loader-fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }

          .loader-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(248, 245, 240, 0.95);
            backdrop-filter: blur(5px);
            z-index: -1;
          }

          .loader-content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  // Inline loader
  return (
    <div className="loader-inline">
      {loaderContent}
      
      <style jsx>{`
        .loader-inline {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

// Simple button loader component
export const ButtonLoader = ({ color = 'gold', size = 'sm' }) => {
  const colors = {
    gold: '#c9a96e',
    wood: '#bd7b4d',
    glass: '#4f8a8b'
  };

  const sizes = {
    sm: '16px',
    md: '20px',
    lg: '24px'
  };

  return (
    <motion.div
      className="button-loader"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{
        width: sizes[size] || '20px',
        height: sizes[size] || '20px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTop: `2px solid ${colors[color] || colors.gold}`,
        borderRadius: '50%',
        margin: '0 auto'
      }}
    />
  );
};

// Page transition loader
export const PageTransitionLoader = () => {
  return (
    <div className="page-transition-loader">
      <style jsx>{`
        .page-transition-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #c9a96e, #a07840, #c9a96e);
          z-index: 10000;
          animation: pageLoad 2s ease-in-out infinite;
        }

        @keyframes pageLoad {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

// Simple skeleton loader
export const SimpleSkeleton = ({ width = '100%', height = '20px', count = 1 }) => {
  return (
    <div className="simple-skeleton">
      {Array(count).fill(0).map((_, i) => (
        <div 
          key={i}
          className="skeleton-line"
          style={{ width, height }}
        />
      ))}
      
      <style jsx>{`
        .simple-skeleton {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .skeleton-line {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Loader;