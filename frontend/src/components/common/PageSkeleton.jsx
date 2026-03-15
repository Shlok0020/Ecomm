// src/components/common/PageSkeleton.jsx
import { motion } from 'framer-motion';

const PageSkeleton = () => {
  return (
    <div className="page-skeleton">
      {/* Hero Section Skeleton */}
      <div className="skeleton-hero">
        <div className="skeleton-hero-content">
          <div className="skeleton-badge"></div>
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-buttons">
            <div className="skeleton-btn"></div>
            <div className="skeleton-btn"></div>
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="skeleton-section">
        <div className="container">
          <div className="skeleton-stats-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-stat-card">
                <div className="skeleton-stat-icon"></div>
                <div className="skeleton-stat-content">
                  <div className="skeleton-stat-number"></div>
                  <div className="skeleton-stat-label"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="skeleton-section">
        <div className="container">
          <div className="skeleton-header">
            <div className="skeleton-title-small"></div>
            <div className="skeleton-title-large"></div>
          </div>
          
          <div className="skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-card-image"></div>
                <div className="skeleton-card-content">
                  <div className="skeleton-card-title"></div>
                  <div className="skeleton-card-text"></div>
                  <div className="skeleton-card-footer">
                    <div className="skeleton-price"></div>
                    <div className="skeleton-button"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-skeleton {
          background: var(--bg-primary);
          min-height: 100vh;
        }

        /* Hero Section */
        .skeleton-hero {
          height: 80vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .skeleton-hero-content {
          max-width: 800px;
          padding: 0 2rem;
          width: 100%;
        }

        .skeleton-badge {
          width: 150px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          border-radius: 30px;
          margin: 0 auto 2rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-title {
          width: 80%;
          height: 80px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          margin: 0 auto 2rem;
          animation: pulse 1.5s ease-in-out infinite;
          animation-delay: 0.1s;
        }

        .skeleton-text {
          width: 60%;
          height: 60px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          margin: 0 auto 3rem;
          animation: pulse 1.5s ease-in-out infinite;
          animation-delay: 0.2s;
        }

        .skeleton-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .skeleton-btn {
          width: 180px;
          height: 54px;
          background: rgba(255,255,255,0.1);
          border-radius: 40px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-btn:first-child {
          animation-delay: 0.3s;
        }

        .skeleton-btn:last-child {
          animation-delay: 0.4s;
        }

        /* Stats Section */
        .skeleton-section {
          padding: 4rem 0;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .skeleton-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .skeleton-stat-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .skeleton-stat-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }

        .skeleton-stat-content {
          flex: 1;
        }

        .skeleton-stat-number {
          width: 80%;
          height: 32px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          margin-bottom: 0.5rem;
        }

        .skeleton-stat-label {
          width: 60%;
          height: 20px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        /* Header */
        .skeleton-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .skeleton-title-small {
          width: 150px;
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
          margin: 0 auto 1rem;
        }

        .skeleton-title-large {
          width: 300px;
          height: 48px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
          margin: 0 auto;
        }

        /* Grid */
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .skeleton-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .skeleton-card-image {
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-card-content {
          padding: 1.5rem;
        }

        .skeleton-card-title {
          width: 80%;
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .skeleton-card-text {
          width: 100%;
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .skeleton-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
        }

        .skeleton-price {
          width: 80px;
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-button {
          width: 100px;
          height: 36px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 20px;
        }

        /* Animations */
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .skeleton-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .skeleton-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .skeleton-grid {
            grid-template-columns: 1fr;
          }
          
          .skeleton-hero {
            height: 60vh;
          }
          
          .skeleton-title {
            height: 60px;
          }
        }

        @media (max-width: 480px) {
          .skeleton-stats-grid {
            grid-template-columns: 1fr;
          }
          
          .skeleton-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PageSkeleton;