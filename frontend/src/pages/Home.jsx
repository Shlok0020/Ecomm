// src/pages/Home/Home.jsx - WITH WORKING SKELETON LOADING AND MOBILE TAP SUPPORT
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FaArrowRight,
  FaPhone,
  FaMapMarkerAlt,
  FaStore,
  FaStar,
  FaCheckCircle,
  FaTree,
  FaCouch,
  FaWrench,
  FaGlassCheers,
  FaShieldAlt,
  FaPalette,
  FaPlay,
  FaQuoteLeft,
  FaGem,
  FaAward,
  FaClock,
  FaUsers,
  FaRulerCombined,
  FaLeaf,
  FaLightbulb,
  FaRegHeart,
  FaEye
} from 'react-icons/fa';
import glassService from '../services/glassService';
import plywoodService from '../services/plywoodService';
import hardwareService from '../services/hardwareService';
import interiorService from '../services/interiorService';
import toast from 'react-hot-toast';

// ============= UNIQUE ANIMATION VARIANTS =============

// Hero animations
const heroVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.8
    }
  }
};

const heroTitleVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 80,
      damping: 10,
      duration: 0.9
    }
  }
};

// Card 1 - Flip from left with 3D rotation
const cardVariant1 = {
  hidden: { 
    opacity: 0, 
    x: -100, 
    rotateY: -45,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    rotateY: 0,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 70,
      damping: 12,
      duration: 0.8
    }
  },
  hover: {
    scale: 1.05,
    y: -10,
    rotateY: 5,
    boxShadow: "0 30px 60px rgba(201, 169, 110, 0.3)",
    transition: { 
      type: "spring", 
      stiffness: 300,
      damping: 15
    }
  }
};

// Card 2 - Pop from bottom with bounce
const cardVariant2 = {
  hidden: { 
    opacity: 0, 
    y: 150, 
    scale: 0.3 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 120,
      damping: 10,
      duration: 0.8
    }
  },
  hover: {
    scale: 1.05,
    y: -10,
    rotate: 2,
    boxShadow: "0 30px 60px rgba(201, 169, 110, 0.3)",
    transition: { 
      type: "spring", 
      stiffness: 300,
      damping: 15
    }
  }
};

// Card 3 - Spin and fade with skew
const cardVariant3 = {
  hidden: { 
    opacity: 0, 
    rotate: -180, 
    scale: 0.3,
    skewX: 15
  },
  visible: { 
    opacity: 1, 
    rotate: 0, 
    scale: 1,
    skewX: 0,
    transition: { 
      type: "spring", 
      stiffness: 60,
      damping: 8,
      duration: 0.9
    }
  },
  hover: {
    scale: 1.05,
    y: -10,
    rotate: -3,
    boxShadow: "0 30px 60px rgba(201, 169, 110, 0.3)",
    transition: { 
      type: "spring", 
      stiffness: 300,
      damping: 15
    }
  }
};

// Card 4 - Slide from right with elastic
const cardVariant4 = {
  hidden: { 
    opacity: 0, 
    x: 150, 
    skewX: -15 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    skewX: 0,
    transition: { 
      type: "spring", 
      stiffness: 80,
      damping: 11,
      duration: 0.8
    }
  },
  hover: {
    scale: 1.05,
    y: -10,
    rotate: 2,
    boxShadow: "0 30px 60px rgba(201, 169, 110, 0.3)",
    transition: { 
      type: "spring", 
      stiffness: 300,
      damping: 15
    }
  }
};

// Box animation variants
const boxVariant1 = {
  hidden: { opacity: 0, x: -50, rotate: -5 },
  visible: { 
    opacity: 1, 
    x: 0, 
    rotate: 0,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 12,
      delay: 0.1
    }
  },
  hover: {
    scale: 1.05,
    rotate: 2,
    boxShadow: "0 20px 40px rgba(201, 169, 110, 0.25)",
    transition: { type: "spring", stiffness: 300 }
  }
};

const boxVariant2 = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 120,
      damping: 14,
      delay: 0.2
    }
  },
  hover: {
    scale: 1.05,
    rotate: -2,
    boxShadow: "0 20px 40px rgba(201, 169, 110, 0.25)",
    transition: { type: "spring", stiffness: 300 }
  }
};

const boxVariant3 = {
  hidden: { opacity: 0, scale: 0.3, rotate: 180 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { 
      type: "spring", 
      stiffness: 80,
      damping: 10,
      delay: 0.3
    }
  },
  hover: {
    scale: 1.05,
    rotate: 3,
    boxShadow: "0 20px 40px rgba(201, 169, 110, 0.25)",
    transition: { type: "spring", stiffness: 300 }
  }
};

const boxVariant4 = {
  hidden: { opacity: 0, x: 50, skewX: 15 },
  visible: { 
    opacity: 1, 
    x: 0, 
    skewX: 0,
    transition: { 
      type: "spring", 
      stiffness: 90,
      damping: 13,
      delay: 0.4
    }
  },
  hover: {
    scale: 1.05,
    rotate: -3,
    boxShadow: "0 20px 40px rgba(201, 169, 110, 0.25)",
    transition: { type: "spring", stiffness: 300 }
  }
};

// Project card variants
const projectVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      delay: i * 0.1
    }
  }),
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow: "0 30px 60px rgba(201, 169, 110, 0.25)",
    transition: { type: "spring", stiffness: 300 }
  }
};

// Testimonial variants
const testimonialVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      delay: i * 0.15
    }
  }),
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(201, 169, 110, 0.2)",
    transition: { type: "spring", stiffness: 300 }
  }
};

// ============= SKELETON LOADING COMPONENT =============
const HomeSkeleton = () => {
  return (
    <div className="mk-home">
      {/* Hero Section Skeleton */}
      <section className="mk-hero">
        <div className="mk-hero__bg">
          <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }}></div>
        </div>
        <div className="mk-hero__grain" />
        <div className="mk-hero__vignette" />

        <div className="container">
          <div className="mk-hero__content">
            <div style={{ marginBottom: '2rem' }}>
              <div className="skeleton-badge"></div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div className="skeleton-title"></div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <div className="skeleton-subtitle"></div>
            </div>

            <div className="mk-hero__actions">
              <div className="skeleton-btn-primary"></div>
              <div className="skeleton-btn-ghost"></div>
            </div>

            {/* Mobile stats skeleton */}
            <div className="mobile-stats-container" style={{ marginTop: '30px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-mobile-stat"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop stats skeleton */}
        <div className="mk-hero__stats">
          {[1, 2, 3].map(i => (
            <div key={i} style={{ textAlign: 'right', marginBottom: '20px' }}>
              <div className="skeleton-stat-number" style={{ width: '80px', height: '40px', marginLeft: 'auto' }}></div>
              <div className="skeleton-stat-label" style={{ width: '100px', height: '20px', marginLeft: 'auto', marginTop: '5px' }}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee Skeleton */}
      <div className="mk-marquee">
        <div className="skeleton-marquee"></div>
      </div>

      {/* About Section Skeleton */}
      <section className="mk-section mk-section--white" style={{ padding: 0 }}>
        <div className="mk-about-card">
          <div className="mk-about-card__image-wrap">
            <div className="skeleton-about-image"></div>
          </div>
          <div className="mk-about-card__content">
            <div className="skeleton-label" style={{ width: '100px', marginBottom: '1rem' }}></div>
            <div className="skeleton-title-small" style={{ width: '300px', marginBottom: '2rem' }}></div>
            <div className="skeleton-text" style={{ width: '100%', marginBottom: '1rem' }}></div>
            <div className="skeleton-text" style={{ width: '90%', marginBottom: '2rem' }}></div>
            <div className="mk-about-card__features">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="mk-about-card__feature" style={{ padding: '15px' }}>
                  <div className="skeleton-feature-icon"></div>
                  <div style={{ width: '100%' }}>
                    <div className="skeleton-feature-title"></div>
                    <div className="skeleton-feature-desc"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mk-about-card__stats">
              {[1, 2, 3].map(i => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="skeleton-stat-number" style={{ margin: '0 auto' }}></div>
                  <div className="skeleton-stat-label" style={{ margin: '5px auto 0' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section Skeleton */}
      <section className="expertise-section">
        <div className="expertise-bg-pattern"></div>
        <div className="container">
          <div className="expertise-header">
            <div className="mk-label" style={{ justifyContent: 'center' }}>
              <div className="skeleton-label-line"></div>
              <div className="skeleton-label-text"></div>
              <div className="skeleton-label-line"></div>
            </div>
            <div className="skeleton-title-large" style={{ width: '400px', margin: '20px auto' }}></div>
          </div>

          <div className="expertise-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="unique-card">
                <div className="card-media">
                  <div className="skeleton-card-image"></div>
                </div>
                <div className="card-content-unique">
                  <div className="skeleton-card-title"></div>
                  <div className="skeleton-card-desc"></div>
                  <div className="card-features">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="skeleton-feature-pill"></div>
                    ))}
                  </div>
                  <div className="skeleton-card-link"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section Skeleton */}
      <section className="projects-section-unique">
        <div className="projects-bg-text"></div>
        <div className="container">
          <div className="projects-header-unique">
            <div>
              <div className="mk-label">
                <div className="skeleton-label-line"></div>
                <div className="skeleton-label-text"></div>
              </div>
              <div className="skeleton-title-medium"></div>
            </div>
            <div className="skeleton-project-desc"></div>
          </div>

          <div className="projects-grid-unique">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`project-card-unique ${i === 0 ? 'large' : i % 2 === 0 ? 'medium' : 'small'}`}>
                <div className="skeleton-project-image"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <section className="mk-section mk-section--dark mk-testimonials">
        <div className="container">
          <div className="skeleton-testimonials-header">
            <div className="mk-label" style={{ justifyContent: 'center' }}>
              <div className="skeleton-label-line-light"></div>
              <div className="skeleton-label-text-light"></div>
              <div className="skeleton-label-line-light"></div>
            </div>
            <div className="skeleton-title-light" style={{ margin: '20px auto' }}></div>
          </div>

          <div className="mk-testimonials__grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="mk-testimonial-card">
                <div className="skeleton-quote-icon"></div>
                <div className="skeleton-stars"></div>
                <div className="skeleton-quote-text"></div>
                <div className="skeleton-divider"></div>
                <div className="skeleton-name"></div>
                <div className="skeleton-role"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="mk-cta">
        <div className="skeleton-cta"></div>
      </section>

      <style jsx>{`
        .skeleton-badge {
          width: 200px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          border-radius: 40px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-title {
          width: 80%;
          height: 120px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          animation: pulse 1.5s ease-in-out infinite;
          animation-delay: 0.1s;
        }

        .skeleton-subtitle {
          width: 60%;
          height: 60px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          animation: pulse 1.5s ease-in-out infinite;
          animation-delay: 0.2s;
        }

        .skeleton-btn-primary {
          width: 200px;
          height: 54px;
          background: rgba(255,255,255,0.1);
          border-radius: 30px;
          animation: pulse 1.5s ease-in-out infinite;
          animation-delay: 0.3s;
        }

        .skeleton-btn-ghost {
          width: 180px;
          height: 54px;
          background: rgba(255,255,255,0.05);
          border-radius: 0;
          border-bottom: 2px solid rgba(255,255,255,0.1);
          animation: pulse 1.5s ease-in-out infinite;
          animation-delay: 0.4s;
        }

        .skeleton-mobile-stat {
          width: 100%;
          height: 70px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          margin-bottom: 12px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-stat-number {
          width: 80px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          border-radius: 6px;
          margin-bottom: 0.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-stat-label {
          width: 100px;
          height: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-marquee {
          width: 100%;
          height: 52px;
          background: rgba(201, 169, 110, 0.3);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-about-image {
          width: 100%;
          height: 600px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 30px;
        }

        .skeleton-label {
          width: 100px;
          height: 24px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-title-small {
          width: 300px;
          height: 48px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        .skeleton-title-large {
          width: 400px;
          height: 56px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        .skeleton-title-medium {
          width: 300px;
          height: 48px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0d0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        .skeleton-title-light {
          width: 400px;
          height: 56px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-text {
          height: 24px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-feature-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .skeleton-feature-title {
          width: 120px;
          height: 20px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .skeleton-feature-desc {
          width: 180px;
          height: 16px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-label-line {
          width: 30px;
          height: 1px;
          background: rgba(201, 169, 110, 0.3);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-label-line-light {
          width: 30px;
          height: 1px;
          background: rgba(255,255,255,0.2);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-label-text {
          width: 100px;
          height: 16px;
          background: rgba(201, 169, 110, 0.3);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-label-text-light {
          width: 100px;
          height: 16px;
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-card-image {
          width: 100%;
          height: 240px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-card-title {
          width: 80%;
          height: 28px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .skeleton-card-desc {
          width: 100%;
          height: 16px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .skeleton-feature-pill {
          width: 80px;
          height: 30px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 30px;
          display: inline-block;
          margin-right: 8px;
        }

        .skeleton-card-link {
          width: 120px;
          height: 24px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-project-desc {
          width: 350px;
          height: 80px;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        .skeleton-project-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-testimonials-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .skeleton-quote-icon {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          margin-bottom: 1.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-stars {
          width: 100px;
          height: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          margin-bottom: 1.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-quote-text {
          width: 100%;
          height: 80px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          margin-bottom: 2rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-divider {
          width: 30px;
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin-bottom: 1.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-name {
          width: 120px;
          height: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          margin-bottom: 0.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-role {
          width: 80px;
          height: 16px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-cta {
          width: 100%;
          height: 520px;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 768px) {
          .skeleton-title {
            height: 80px;
          }
          
          .skeleton-title-large {
            width: 280px;
            height: 48px;
          }
          
          .skeleton-about-image {
            height: 400px;
          }
          
          .expertise-grid {
            grid-template-columns: 1fr;
          }
          
          .skeleton-project-desc {
            width: 100%;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};

// ============= MAIN HOME COMPONENT =============
const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeProject, setActiveProject] = useState(null);
  const [tappedProject, setTappedProject] = useState(null); // NEW: For mobile tap
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [products, setProducts] = useState({
    glass: [],
    plywood: [],
    hardware: [],
    interiors: []
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    years: '10+',
    clients: '2000+',
    products: '1000+',
    projects: '500+',
    brands: '50+'
  });
  
  const heroRef = useRef(null);

  // Detect if device is touch-enabled
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
  };

  // Handle project tap for mobile
  const handleProjectTap = (projectId) => {
    if (tappedProject === projectId) {
      // If already tapped, close it
      setTappedProject(null);
    } else {
      // Open new tapped project
      setTappedProject(projectId);
      // Auto close after 3 seconds
      setTimeout(() => {
        setTappedProject(null);
      }, 3000);
    }
  };

  // Handle project hover for desktop
  const handleProjectHover = (projectId) => {
    if (!isTouchDevice()) {
      setActiveProject(projectId);
    }
  };

  const handleProjectHoverEnd = () => {
    if (!isTouchDevice()) {
      setActiveProject(null);
    }
  };

  // OPTIMIZED: Debounced scroll handler for better performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // OPTIMIZED: Debounced mouse move for better performance
  useEffect(() => {
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
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Fetch all products from database
  const fetchAllProducts = async (showToast = false) => {
    console.log('🏠 Fetching all products from database...');
    setLoading(true);
    
    try {
      // Clear any cached data
      if (glassService?.storage) glassService.storage.clearCache();
      if (plywoodService?.storage) plywoodService.storage.clearCache();
      if (hardwareService?.storage) hardwareService.storage.clearCache();
      if (interiorService?.storage) interiorService.storage.clearCache();
      
      // Fetch all products in parallel
      const [glassRes, plywoodRes, hardwareRes, interiorsRes] = await Promise.allSettled([
        glassService.getAll().catch(err => {
          console.error('Glass fetch error:', err);
          return { data: [] };
        }),
        plywoodService.getAll().catch(err => {
          console.error('Plywood fetch error:', err);
          return { data: [] };
        }),
        hardwareService.getAll().catch(err => {
          console.error('Hardware fetch error:', err);
          return { data: [] };
        }),
        interiorService.getAll().catch(err => {
          console.error('Interior fetch error:', err);
          return { data: [] };
        })
      ]);
      
      const glassData = glassRes.value?.data || [];
      const plywoodData = plywoodRes.value?.data || [];
      const hardwareData = hardwareRes.value?.data || [];
      const interiorsData = interiorsRes.value?.data || [];
      
      setProducts({
        glass: glassData,
        plywood: plywoodData,
        hardware: hardwareData,
        interiors: interiorsData
      });
      
      // Calculate total products
      const totalProducts = glassData.length + plywoodData.length + 
                           hardwareData.length + interiorsData.length;
      
      // Update stats based on actual data
      setStats({
        years: '10+',
        clients: '2000+',
        products: totalProducts > 0 ? totalProducts + '+' : '1000+',
        projects: '500+',
        brands: '50+'
      });
      
      console.log('🏠 Home products loaded:', {
        glass: glassData.length,
        plywood: plywoodData.length,
        hardware: hardwareData.length,
        interiors: interiorsData.length,
        total: totalProducts
      });
      
      if (showToast) {
        toast.success('Products updated from database!');
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    // Fetch products
    fetchAllProducts();
    
    // Real-time updates listeners
    const handleStorageChange = (e) => {
      console.log('🟡 Storage changed - admin updated data:', e.key);
      if (e.key?.includes('products') || e.key === null) {
        fetchAllProducts(true);
      }
    };
    
    const handleProductsUpdated = () => {
      console.log('🟡 Products updated event - admin changed data');
      fetchAllProducts(true);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleProductsUpdated);
    window.addEventListener('glassProductsUpdated', handleProductsUpdated);
    window.addEventListener('plywoodProductsUpdated', handleProductsUpdated);
    window.addEventListener('hardwareProductsUpdated', handleProductsUpdated);
    window.addEventListener('interiorProductsUpdated', handleProductsUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleProductsUpdated);
      window.removeEventListener('glassProductsUpdated', handleProductsUpdated);
      window.removeEventListener('plywoodProductsUpdated', handleProductsUpdated);
      window.removeEventListener('hardwareProductsUpdated', handleProductsUpdated);
      window.removeEventListener('interiorProductsUpdated', handleProductsUpdated);
    };
  }, []);

  // Calculate total products for stats
  const totalProducts = products.glass.length + products.plywood.length + 
                        products.hardware.length + products.interiors.length;

  // Update categories with real product counts
  const categories = [
    {
      title: 'Architectural Glass',
      desc: 'Precision-cut toughened glass with 3D edge polishing for modern facades and interiors.',
      link: '/glass',
      image: 'https://images.unsplash.com/photo-1637665637343-d497d345ed2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2xhc3MlMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D',
      icon: <FaGlassCheers />,
      color: '#4f8a8b',
      features: ['Toughened Glass', '3D Polishing', 'Sound Proof'],
      count: products.glass.length
    },
    {
      title: 'Premium Plywood',
      desc: 'Marine-grade, BWP and commercial plywood with eco-friendly finishes and 10-year warranty.',
      link: '/plywood',
      image: 'https://images.unsplash.com/photo-1693722232769-74b150f0857a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHBseXdvb2R8ZW58MHx8MHx8fDA%3D',
      icon: <FaTree />,
      color: '#bd7b4d',
      features: ['Marine Grade', '10Y Warranty', 'Eco-friendly'],
      count: products.plywood.length
    },
    {
      title: 'Modular Interiors',
      desc: '3D modeled modular kitchens, wardrobes and smart storage solutions for modern living.',
      link: '/interiors',
      image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9kdWxhciUyMGtpdGNoZW58ZW58MHx8MHx8fDA%3D',
      icon: <FaCouch />,
      color: '#c45a5a',
      features: ['3D Modeling', 'Smart Storage', 'Modern Design'],
      count: products.interiors.length
    },
    {
      title: 'Luxury Hardware',
      desc: 'Premium handles, hinges and fittings that add tactile depth to your furniture.',
      link: '/hardware',
      image: 'https://media.istockphoto.com/id/177855198/photo/cabinets-and-rolling-table-in-garage-workspace.jpg?s=612x612&w=0&k=20&c=MBhzTdk0ra3wjm5rkhqTBC151SNbVfkJTX9pPdKlWwE=',
      icon: <FaWrench />,
      color: '#b1935c',
      features: ['Premium Quality', 'German Tech', 'Lifetime Warranty'],
      count: products.hardware.length
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Agarwal',
      role: 'Homeowner',
      text: 'Best interior designers in Jharsuguda! Transformed our home completely with stunning designs.',
      rating: 5
    },
    {
      name: 'Priya Singh',
      role: 'Architect',
      text: 'Exceptional quality of glass work and modular solutions. Highly recommended!',
      rating: 5
    },
    {
      name: 'Amit Kumar',
      role: 'Builder',
      text: 'Working with them for 5+ years. Consistent quality and professional service.',
      rating: 5
    }
  ];

  // 5 PROJECTS
  const projects = [
    {
      id: 1,
      title: 'Modern Kitchen',
      category: 'Modular',
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      likes: 234,
      views: 1234,
      area: '320 sq ft'
    },
    {
      id: 2,
      title: 'Luxury Bedroom',
      category: 'Interior',
      image: 'https://plus.unsplash.com/premium_photo-1661875135365-16aab794632f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGx1eHVyeSUyMGJlZHJvb218ZW58MHx8MHx8fDA%3D',
      likes: 456,
      views: 2345,
      area: '280 sq ft'
    },
    {
      id: 3,
      title: 'Glass Facade',
      category: 'Architectural',
      image: 'https://media.istockphoto.com/id/132049212/photo/modern-architectural-interior-detail.jpg?s=612x612&w=0&k=20&c=M8bui-LUcRvxo0xxptrrNIU0Sztd7iiZFbsIFba1nt0=',
      likes: 345,
      views: 1678,
      area: '200 sq ft'
    },
    {
      id: 4,
      title: 'Plywood Furniture',
      category: 'Custom',
      image: 'https://images.unsplash.com/photo-1602872029708-84d970d3382b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGZ1cm5pdHVyZXxlbnwwfDF8MHx8fDA%3D',
      likes: 567,
      views: 2890,
      area: '350 sq ft'
    },
    {
      id: 5,
      title: 'Minimalist Living',
      category: 'Living Room',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop',
      likes: 678,
      views: 3456,
      area: '400 sq ft'
    }
  ];

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
  };

  // OPTIMIZED: Simplified animation variants for better performance
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const slideInLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const slideInRight = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // ✅ Show skeleton while loading
  if (loading) {
    return <HomeSkeleton />;
  }

  // Determine which project overlay to show (hover for desktop, tap for mobile)
  const getActiveOverlay = (projectId) => {
    if (isTouchDevice()) {
      return tappedProject === projectId;
    } else {
      return activeProject === projectId;
    }
  };

  return (
    <div className="mk-home">
      {/* SEO Meta Data */}
      <Helmet>
        <title>New Prem Glass House | Premium Glass, Hardware, Plywood & Interiors in Jharsuguda</title>
        <meta name="description" content="New Prem Glass House is Jharsuguda's premier destination for premium glass products, hardware, plywood, and modular interior design services. Serving since 2010 with 5000+ happy customers." />
        <meta name="keywords" content="New Prem Glass House, Jharsuguda glass shop, interior designers Jharsuguda, hardware store Jharsuguda, plywood dealers Jharsuguda, modular kitchen Jharsuguda, glass products Odisha, Bombay Chowk Jharsuguda" />
        <meta name="author" content="New Prem Glass House" />
        <meta name="geo.region" content="IN-OR" />
        <meta name="geo.placename" content="Jharsuguda" />
        <meta name="geo.position" content="21.8574;84.0161" />
        <meta name="ICBM" content="21.8574, 84.0161" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://newpremglasshouse.com/" />
        <meta property="og:title" content="New Prem Glass House - Premium Glass, Hardware & Interiors in Jharsuguda" />
        <meta property="og:description" content="Your trusted partner for premium glass, hardware, plywood and interior solutions in Jharsuguda since 2010. 5000+ happy customers." />
        <meta property="og:image" content="https://newpremglasshouse.com/og-home.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://newpremglasshouse.com/" />
        <meta property="twitter:title" content="New Prem Glass House - Premium Glass, Hardware & Interiors in Jharsuguda" />
        <meta property="twitter:description" content="Your trusted partner for premium glass, hardware, plywood and interior solutions in Jharsuguda since 2010." />
        <meta property="twitter:image" content="https://newpremglasshouse.com/og-home.jpg" />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "New Prem Glass House",
              "image": "https://newpremglasshouse.com/logo.jpg",
              "logo": "https://newpremglasshouse.com/logo.jpg",
              "url": "https://newpremglasshouse.com/",
              "telephone": "+917328019093",
              "email": "info@newpremglass.com",
              "description": "Premium glass, hardware, plywood and interior design services in Jharsuguda, Odisha.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Bombay Chowk",
                "addressLocality": "Jharsuguda",
                "addressRegion": "Odisha",
                "postalCode": "768201",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 21.8574,
                "longitude": 84.0161
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "09:00",
                  "closes": "21:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/newpremglasshouse",
                "https://www.instagram.com/newpremglasshouse"
              ],
              "priceRange": "₹₹",
              "foundingDate": "2010",
              "numberOfEmployees": "15",
              "areaServed": ["Jharsuguda", "Sambalpur", "Rourkela", "Odisha"]
            }
          `}
        </script>
        
        <link rel="canonical" href="https://newpremglasshouse.com/" />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --gold: #c9a96e;
          --gold-light: #e8d5b0;
          --gold-dark: #a07840;
          --deep-gold: #b8860b;
          --black: #0a0a0a;
          --dark: #111111;
          --dark-2: #1a1a1a;
          --dark-3: #222222;
          --warm-white: #f8f5f0;
          --off-white: #ede8df;
          --cream: #f2ede4;
          --gray-text: #888888;
          --light-gray: #d4d4d4;
          --serif: 'Cormorant Garamond', serif;
          --display: 'DM Serif Display', serif;
          --sans: 'Jost', sans-serif;
          --shadow-sm: 0 10px 30px -15px rgba(0,0,0,0.2);
          --shadow-md: 0 20px 40px -20px rgba(0,0,0,0.3);
          --shadow-lg: 0 30px 60px -30px rgba(0,0,0,0.4);
          --shadow-gold: 0 20px 40px rgba(201, 169, 110, 0.15);
        }

        html { scroll-behavior: smooth; overflow-x: hidden; }

        body {
          font-family: var(--sans);
          background: var(--warm-white);
          color: var(--dark);
          overflow-x: hidden;
        }

        .mk-home {
          overflow-x: hidden;
          background: var(--warm-white);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 4rem;
        }

        @media (max-width: 1200px) {
          .container { padding: 0 3rem; }
        }
        
        @media (max-width: 768px) {
          .container { 
            padding: 0 1.5rem; 
          }
        }

        .mk-hero {
          position: relative;
          height: 100vh;
          min-height: 700px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          background: var(--black);
          margin-top: -60px;
          padding-top: 0;
        }

        .mk-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .mk-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.55;
          transform-origin: center;
          transition: transform 0.1s linear;
          will-change: transform;
        }

        .mk-hero__grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
          z-index: 1;
          pointer-events: none;
        }

        .mk-hero__vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.92) 0%,
            rgba(0,0,0,0.5) 40%,
            rgba(0,0,0,0.15) 70%,
            transparent 100%
          );
          z-index: 2;
        }

        .mk-hero__content {
          position: relative;
          z-index: 3;
          width: 100%;
          padding: 0 6vw 8vh;
          transform: translateY(-40px);
          margin-left: -2vw;
        }

        @media (min-width: 1400px) {
          .mk-hero__content {
            margin-left: -5vw;
            padding-left: 5vw;
          }
        }

        @media (min-width: 1800px) {
          .mk-hero__content {
            margin-left: -8vw;
          }
        }

        .mk-hero__eyebrow {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 0.8rem;
          margin-top: 0;
        }

        .mk-hero__eyebrow-line {
          width: 40px;
          height: 1px;
          background: var(--gold);
        }

        .mk-hero__eyebrow span {
          font-family: var(--sans);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .mk-hero__title {
          font-family: var(--serif);
          font-size: clamp(3.5rem, 8vw, 8rem);
          font-weight: 300;
          line-height: 1.0;
          color: var(--warm-white);
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .mk-hero__title em {
          font-style: italic;
          color: var(--gold);
        }

        .mk-hero__subtitle {
          font-family: var(--sans);
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          font-weight: 300;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.65);
          max-width: 480px;
          margin-bottom: 3rem;
          line-height: 1.8;
        }

        .mk-hero__actions {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          flex-wrap: wrap;
        }

        .mk-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 0 2.5rem;
          height: 54px;
          background: var(--gold);
          color: var(--black);
          font-family: var(--sans);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          border-radius: 30px;
        }

        .mk-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--dark);
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .mk-btn-primary:hover::before { transform: translateX(0); }
        .mk-btn-primary:hover { color: var(--gold); }
        .mk-btn-primary span, .mk-btn-primary svg { position: relative; z-index: 1; }

        .mk-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0;
          height: 54px;
          background: transparent;
          color: rgba(255,255,255,0.9);
          font-family: var(--sans);
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 2px solid rgba(255,255,255,0.3);
        }

        .mk-btn-ghost:hover { color: var(--gold); border-color: var(--gold); }

        .mk-hero__stats {
          position: absolute;
          right: 6vw;
          bottom: 8vh;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: flex-end;
        }

        .mk-hero__stat {
          text-align: right;
        }

        .mk-hero__stat h4 {
          font-family: var(--serif);
          font-size: 2.8rem;
          font-weight: 300;
          color: var(--gold);
          line-height: 1;
        }

        .mk-hero__stat p {
          font-family: var(--sans);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
        }

        .mobile-stats-container {
          display: none;
        }

        .mk-marquee {
          background: var(--gold);
          overflow: hidden;
          padding: 14px 0;
          white-space: nowrap;
        }

        .mk-marquee__track {
          display: inline-flex;
          animation: marquee 20s linear infinite;
        }

        .mk-marquee__item {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 0 2.5rem;
          font-family: var(--sans);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--black);
        }

        .mk-marquee__dot {
          width: 4px;
          height: 4px;
          background: var(--black);
          border-radius: 50%;
          opacity: 0.4;
          flex-shrink: 0;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .mk-section {
          padding: 120px 6vw;
          position: relative;
        }

        .mk-section--dark {
          background: var(--dark);
        }

        .mk-section--cream {
          background: var(--cream);
        }

        .mk-section--white {
          background: #ffffff;
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

        .mk-h2--light { color: var(--warm-white); }
        .mk-h2 em { font-style: italic; color: var(--gold); }

        .mk-about-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          min-height: 750px;
          background: white;
        }

        .mk-about-card__image-wrap {
          position: relative;
          padding: 40px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mk-about-card__frame {
          position: relative;
          width: 100%;
          height: 100%;
          max-height: 600px;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.3);
          transform: rotate(2deg);
          transition: transform 0.5s ease;
        }

        .mk-about-card__image-wrap:hover .mk-about-card__frame {
          transform: rotate(0deg) scale(1.02);
        }

        .mk-about-card__image-inner {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .mk-about-card__image-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 8s ease;
        }

        .mk-about-card__image-wrap:hover .mk-about-card__image-inner img {
          transform: scale(1.1);
        }

        .mk-about-card__overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, rgba(201, 169, 110, 0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .mk-about-card__corner {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 2px solid var(--gold);
          opacity: 0.3;
        }

        .corner-tl {
          top: 20px;
          left: 20px;
          border-right: none;
          border-bottom: none;
        }

        .corner-br {
          bottom: 20px;
          right: 20px;
          border-left: none;
          border-top: none;
        }

        .mk-about-card__badge {
          position: absolute;
          bottom: 30px;
          left: -20px;
          background: var(--gold);
          padding: 15px 25px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 20px 40px rgba(201, 169, 110, 0.3);
          z-index: 10;
        }

        .mk-about-card__badge-icon {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          font-size: 1.5rem;
        }

        .mk-about-card__badge-content {
          display: flex;
          flex-direction: column;
        }

        .mk-about-card__badge-num {
          font-family: var(--serif);
          font-size: 2rem;
          font-weight: 700;
          color: var(--dark);
          line-height: 1;
        }

        .mk-about-card__badge-text {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--dark);
          opacity: 0.8;
        }

        .mk-about-card__content {
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: white;
        }

        .mk-about-card__body {
          font-family: var(--sans);
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.9;
          color: var(--gray-text);
          margin: 1.5rem 0 2rem;
        }

        .mk-about-card__features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .mk-about-card__feature {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 15px;
          background: var(--cream);
          border-radius: 12px;
          transition: all 0.3s ease;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .mk-about-card__feature:hover {
          background: linear-gradient(135deg, var(--gold-light), var(--cream));
          transform: translateY(-5px) scale(1.02);
          box-shadow: var(--shadow-gold);
          border-color: var(--gold);
        }

        .mk-about-card__feature:active {
          transform: translateY(-2px) scale(1.01);
        }

        .mk-about-card__feature-icon {
          width: 40px;
          height: 40px;
          background: var(--gold);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.1rem;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .mk-about-card__feature:hover .mk-about-card__feature-icon {
          background: var(--gold-dark);
          transform: rotate(360deg);
        }

        .mk-about-card__feature h4 {
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--dark);
          text-transform: uppercase;
          margin-bottom: 4px;
          transition: color 0.3s ease;
        }

        .mk-about-card__feature:hover h4 {
          color: var(--gold-dark);
        }

        .mk-about-card__feature p {
          font-size: 0.8rem;
          color: var(--gray-text);
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .mk-about-card__feature:hover p {
          color: var(--dark);
        }

        .mk-about-card__stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding: 20px 0;
          border-top: 1px solid rgba(0,0,0,0.05);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .mk-about-card__stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .mk-about-card__stat-number {
          font-family: var(--serif);
          font-size: 2rem;
          font-weight: 600;
          color: var(--gold);
          line-height: 1;
        }

        .mk-about-card__stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gray-text);
          margin-top: 5px;
        }

        .mk-about-card__stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(0,0,0,0.1);
        }

        .expertise-section {
          position: relative;
          padding: 100px 0;
          background: linear-gradient(135deg, #f8f5f0 0%, #f2ede4 100%);
          overflow: hidden;
        }

        .expertise-bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 20% 30%, rgba(201, 169, 110, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .expertise-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 2;
        }

        .expertise-header .mk-label {
          justify-content: center;
        }

        .expertise-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          position: relative;
          z-index: 2;
        }

        .unique-card {
          position: relative;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none !important;
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .unique-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: var(--shadow-gold);
          text-decoration: none !important;
        }

        .unique-card:link, 
        .unique-card:visited, 
        .unique-card:hover, 
        .unique-card:active {
          text-decoration: none !important;
        }

        .card-media {
          position: relative;
          height: 240px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .unique-card:hover .card-media img {
          transform: scale(1.15);
        }

        .card-overlay-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
          z-index: 1;
        }

        .card-icon-circle {
          position: absolute;
          bottom: -25px;
          right: 20px;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 3;
          transition: all 0.3s ease;
          border: 3px solid white;
        }

        .unique-card:hover .card-icon-circle {
          transform: rotate(360deg) scale(1.1);
        }

        .card-content-unique {
          padding: 30px 25px 25px;
          background: white;
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          text-decoration: none !important;
        }

        .card-number {
          position: absolute;
          top: -40px;
          left: 25px;
          font-family: var(--serif);
          font-size: 5rem;
          font-weight: 700;
          color: rgba(201, 169, 110, 0.1);
          line-height: 1;
          z-index: 1;
        }

        .card-title-unique {
          font-family: var(--serif);
          font-size: 1.6rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--dark);
          position: relative;
          z-index: 2;
          text-decoration: none !important;
        }

        .card-title-unique::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 40px;
          height: 2px;
          background: var(--gold);
          transition: width 0.3s ease;
        }

        .unique-card:hover .card-title-unique::after {
          width: 70px;
        }

        .card-desc-unique {
          color: var(--gray-text);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
          flex: 1;
          text-decoration: none !important;
        }

        .card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .feature-pill {
          background: rgba(201, 169, 110, 0.08);
          color: var(--gold-dark);
          padding: 5px 15px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s;
        }

        .unique-card:hover .feature-pill {
          background: var(--gold);
          color: white;
        }

        .card-cta-unique {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 15px;
          margin-top: auto;
          border-top: 1px solid rgba(0,0,0,0.05);
          color: var(--gold);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s;
          text-decoration: none !important;
        }

        .unique-card:hover .card-cta-unique {
          color: var(--gold-dark);
        }

        .card-cta-unique svg {
          transition: transform 0.3s ease;
        }

        .unique-card:hover .card-cta-unique svg {
          transform: translateX(8px);
        }

        .projects-section-unique {
          padding: 100px 0;
          background: white;
          position: relative;
          overflow: hidden;
        }

        .projects-bg-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--serif);
          font-size: clamp(8rem, 15vw, 15rem);
          font-weight: 700;
          color: rgba(201, 169, 110, 0.02);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .projects-header-unique {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 60px;
          position: relative;
          z-index: 2;
        }

        .projects-header-left {
          max-width: 600px;
        }

        .projects-header-right p {
          color: var(--gray-text);
          max-width: 350px;
          line-height: 1.8;
          font-size: 0.95rem;
        }

        .projects-grid-unique {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 20px;
          position: relative;
          z-index: 2;
          min-height: 720px;
        }

        .project-card-unique {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Mobile tap feedback */
        .project-card-unique.tapped {
          transform: translateY(-5px);
          box-shadow: var(--shadow-gold);
        }

        .project-card-unique.large {
          grid-column: span 2;
          grid-row: span 2;
        }

        .project-card-unique.medium {
          grid-column: span 1;
          grid-row: span 1;
        }

        .project-card-unique.small {
          grid-column: span 1;
          grid-row: span 1;
        }

        .project-card-unique:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-gold);
        }

        .project-image-unique {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          display: block;
        }

        .project-card-unique:hover .project-image-unique {
          transform: scale(1.1);
        }

        .project-card-unique.tapped .project-image-unique {
          transform: scale(1.05);
        }

        .project-overlay-unique {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.85) 0%,
            rgba(0,0,0,0.4) 50%,
            rgba(0,0,0,0.1) 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 30px;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .project-card-unique:hover .project-overlay-unique {
          opacity: 1;
        }

        /* For mobile tap - show overlay when tapped */
        .project-card-unique.tapped .project-overlay-unique {
          opacity: 1;
        }

        .project-category-unique {
          font-family: var(--sans);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 10px;
          transform: translateY(20px);
          transition: transform 0.5s ease 0.1s;
        }

        .project-title-unique {
          font-family: var(--serif);
          font-size: 1.8rem;
          font-weight: 600;
          color: white;
          margin-bottom: 15px;
          transform: translateY(20px);
          transition: transform 0.5s ease 0.15s;
        }

        .project-card-unique.large .project-title-unique {
          font-size: 2.5rem;
        }

        .project-meta-unique {
          display: flex;
          gap: 20px;
          transform: translateY(20px);
          transition: transform 0.5s ease 0.2s;
        }

        .project-meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
        }

        .project-card-unique:hover .project-category-unique,
        .project-card-unique:hover .project-title-unique,
        .project-card-unique:hover .project-meta-unique,
        .project-card-unique.tapped .project-category-unique,
        .project-card-unique.tapped .project-title-unique,
        .project-card-unique.tapped .project-meta-unique {
          transform: translateY(0);
        }

        .project-stats-unique {
          display: flex;
          gap: 15px;
          margin-top: 15px;
        }

        .project-stat {
          display: flex;
          align-items: center;
          gap: 5px;
          color: rgba(255,255,255,0.6);
          font-size: 0.85rem;
        }

        .project-view-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 45px;
          height: 45px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.4s ease;
          z-index: 3;
        }

        .project-card-unique:hover .project-view-btn,
        .project-card-unique.tapped .project-view-btn {
          opacity: 1;
          transform: scale(1);
        }

        .projects-cta {
          text-align: center;
          margin-top: 60px;
        }

        .mk-btn-outline-dark {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 0 2.5rem;
          height: 54px;
          background: transparent;
          color: var(--dark);
          font-family: var(--sans);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border: 2px solid var(--gold);
          transition: all 0.4s ease;
        }

        .mk-btn-outline-dark:hover {
          background: var(--gold);
          color: var(--dark);
          transform: translateY(-3px);
        }

        .mk-testimonials {
          position: relative;
          overflow: hidden;
        }

        .mk-testimonials__bg-text {
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
          user-select: none;
          letter-spacing: -0.05em;
        }

        .mk-testimonials__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 60px;
          position: relative;
          z-index: 2;
        }

        .mk-testimonial-card {
          padding: 3rem 2.5rem;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          transition: all 0.4s ease;
          position: relative;
        }

        .mk-testimonial-card::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--gold);
          transition: width 0.5s ease;
        }

        .mk-testimonial-card:hover::before { width: 100%; }

        .mk-testimonial-card:hover {
          background: rgba(255,255,255,0.05);
          transform: translateY(-8px);
        }

        .mk-testimonial__quote-icon {
          color: var(--gold);
          opacity: 0.4;
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }

        .mk-testimonial__stars {
          display: flex;
          gap: 4px;
          margin-bottom: 1.5rem;
        }

        .mk-testimonial__stars svg {
          color: var(--gold);
          font-size: 0.85rem;
        }

        .mk-testimonial__text {
          font-family: var(--serif);
          font-size: 1.15rem;
          font-weight: 300;
          font-style: italic;
          line-height: 1.8;
          color: rgba(255,255,255,0.75);
          margin-bottom: 2rem;
        }

        .mk-testimonial__divider {
          width: 30px;
          height: 1px;
          background: var(--gold);
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }

        .mk-testimonial__name {
          font-family: var(--sans);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: white;
          margin-bottom: 4px;
        }

        .mk-testimonial__role {
          font-family: var(--sans);
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .mk-cta {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
        }

        .mk-cta__bg {
          position: absolute;
          inset: 0;
        }

        .mk-cta__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.4;
        }

        .mk-cta__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(201, 169, 110, 0.18) 0%,
            rgba(10, 10, 10, 0.85) 100%
          );
        }

        .mk-cta__content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          padding: 80px 40px;
        }

        .mk-cta__title {
          font-family: var(--serif);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300;
          line-height: 1.15;
          color: var(--warm-white);
          margin-bottom: 1.2rem;
        }

        .mk-cta__title em { font-style: italic; color: var(--gold); }

        .mk-cta__subtitle {
          font-family: var(--sans);
          font-size: 0.9rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.6);
          margin-bottom: 3rem;
          line-height: 1.8;
        }

        .mk-cta__actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .mk-btn-outline-gold {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 2.2rem;
          height: 54px;
          background: transparent;
          color: var(--gold);
          font-family: var(--sans);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid var(--gold);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .mk-btn-outline-gold::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .mk-btn-outline-gold:hover::before { transform: translateX(0); }
        .mk-btn-outline-gold:hover { color: var(--dark); }
        .mk-btn-outline-gold span, .mk-btn-outline-gold svg { position: relative; z-index: 1; }

        @media (max-width: 1200px) {
          .expertise-grid { grid-template-columns: repeat(2, 1fr); }
          .projects-grid-unique { 
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
            min-height: auto;
          }
          .project-card-unique.large { grid-column: span 2; grid-row: span 1; height: 400px; }
          .project-card-unique.medium,
          .project-card-unique.small { height: 350px; }
          .mk-testimonials__grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 1024px) {
          .mk-about-card {
            grid-template-columns: 1fr;
          }
          
          .mk-about-card__image-wrap {
            min-height: 500px;
            padding: 30px;
          }
          
          .mk-about-card__content {
            padding: 60px 40px;
          }
          
          .mk-hero__content {
            transform: translateY(-35px);
          }
        }

        @media (max-width: 900px) {
          .projects-header-unique { flex-direction: column; align-items: flex-start; gap: 20px; }
          .projects-header-right p { text-align: left; }
        }

        @media (max-width: 768px) {
          .mk-hero {
            min-height: 100vh;
            height: -webkit-fill-available;
            margin-top: -60px;
            display: flex;
            align-items: center;
            padding: 0;
          }
          
          .mk-hero__content {
            padding: 80px 4vw 20px;
            transform: translateY(0);
            margin-left: 0;
            position: relative;
            z-index: 10;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .mk-hero__eyebrow {
            margin-bottom: 15px;
            gap: 10px;
          }
          
          .mk-hero__eyebrow-line {
            width: 30px;
          }
          
          .mk-hero__eyebrow span {
            font-size: 0.7rem;
            letter-spacing: 0.2em;
          }
          
          .mk-hero__title {
            font-size: 3.5rem;
            margin-bottom: 15px;
            line-height: 1.1;
          }

          .mk-hero__subtitle {
            font-size: 1rem;
            margin-bottom: 25px;
            max-width: 100%;
            line-height: 1.6;
          }

          .mobile-stats-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin: 10px 0 25px;
            width: 100%;
          }

          .mobile-stat-item {
            background: rgba(255,255,255,0.08);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 14px 18px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .mobile-stat-value {
            font-family: var(--serif);
            font-size: 1.8rem;
            font-weight: 600;
            color: var(--gold);
            line-height: 1;
          }

          .mobile-stat-label {
            font-family: var(--sans);
            font-size: 0.9rem;
            font-weight: 500;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 1px;
            text-align: right;
          }

          .mk-hero__actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
            margin-top: 10px;
          }

          .mk-btn-primary,
          .mk-btn-ghost {
            width: 100%;
            justify-content: center;
            text-align: center;
            padding: 0 1rem;
            height: 48px;
            font-size: 0.8rem;
          }

          .mk-btn-primary {
            border-radius: 24px;
          }

          .mk-btn-ghost {
            height: 42px;
            line-height: 42px;
          }
          
          .mk-hero__stats {
            display: none;
          }

          .expertise-grid { 
            grid-template-columns: 1fr; 
            gap: 20px;
          }
          
          .projects-grid-unique { 
            grid-template-columns: 1fr; 
            gap: 15px;
          }
          
          .project-card-unique.large,
          .project-card-unique.medium,
          .project-card-unique.small { 
            grid-column: span 1; 
            height: 300px; 
          }
          
          .mk-testimonials__grid { 
            grid-template-columns: 1fr; 
            gap: 20px;
            margin-top: 30px;
          }
          
          .mk-about-card__features { 
            grid-template-columns: 1fr; 
            gap: 15px;
          }
          
          .mk-about-card__stats {
            flex-direction: column;
            gap: 15px;
          }
          
          .mk-about-card__stat-divider {
            width: 80px;
            height: 1px;
          }
          
          .mk-section { 
            padding: 60px 5vw; 
          }
          
          .expertise-section {
            padding: 60px 0;
          }
          
          .projects-section-unique {
            padding: 60px 0;
          }
          
          .mk-cta__content {
            padding: 40px 20px;
          }
          
          .mk-cta__title {
            font-size: 2.2rem;
            margin-bottom: 1rem;
          }
          
          .mk-cta__subtitle {
            font-size: 0.85rem;
            margin-bottom: 2rem;
          }
          
          .mk-testimonial-card {
            padding: 2rem 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .mk-hero__content {
            padding: 160px 4vw 15px;
          }
          
          .mk-hero__title { 
            font-size: 4.5rem;
            margin-bottom: 12px;
          }
          
          .mk-hero__subtitle {
            font-size: 0.95rem;
            margin-bottom: 20px;
          }
          
          .mobile-stat-item {
            padding: 12px 16px;
          }
          
          .mobile-stat-value {
            font-size: 1.6rem;
          }
          
          .mobile-stat-label {
            font-size: 0.85rem;
          }

          .card-title-unique {
            font-size: 1.4rem;
          }
          
          .project-title-unique {
            font-size: 1.4rem;
          }
          
          .project-card-unique.large .project-title-unique {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 360px) {
          .mk-hero__content {
            padding: 80px 4vw 10px;
          }
          
          .mk-hero__title {
            font-size: 2.6rem;
            margin-bottom: 10px;
          }
          
          .mk-hero__subtitle {
            font-size: 0.9rem;
            margin-bottom: 15px;
          }
          
          .mobile-stat-item {
            padding: 10px 14px;
          }
          
          .mobile-stat-value {
            font-size: 1.4rem;
          }
          
          .mobile-stat-label {
            font-size: 0.8rem;
          }
        }

        .mk-hero__scroll {
          display: none;
        }

        .mk-scroll-line {
          display: none;
        }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <motion.section 
        className="mk-hero"
        ref={heroRef}
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mk-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"
            alt="Interior Design"
            style={{
              transform: `scale(1.05) translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              transition: 'transform 0.05s linear'
            }}
          />
        </div>
        <div className="mk-hero__grain" />
        <div className="mk-hero__vignette" />

        <div className="container">
          <div className="mk-hero__content">
            <motion.div variants={heroItemVariants}>
              <div className="mk-hero__eyebrow">
                <div className="mk-hero__eyebrow-line" />
                <span>Since 2010 · Jharsuguda, Odisha</span>
              </div>
            </motion.div>

            <div style={{ overflow: 'hidden' }}>
              <motion.h1
                className="mk-hero__title"
                variants={heroTitleVariants}
              >
                Your Trusted<br />
                <em>Interior Partner</em>
              </motion.h1>
            </div>

            <motion.p
              className="mk-hero__subtitle"
              variants={heroItemVariants}
            >
              Proudly serving Jharsuguda for over a decade with premium
              glass products, modular interiors, and expert craftsmanship.
            </motion.p>

            <motion.div 
              className="mobile-stats-container"
              variants={heroItemVariants}
            >
              <motion.div 
                className="mobile-stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="mobile-stat-value">{stats.years}</div>
                <div className="mobile-stat-label">YEARS EXPERIENCE</div>
              </motion.div>
              
              <motion.div 
                className="mobile-stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="mobile-stat-value">{stats.clients}</div>
                <div className="mobile-stat-label">HAPPY CLIENTS</div>
              </motion.div>
              
              <motion.div 
                className="mobile-stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="mobile-stat-value">{totalProducts > 0 ? totalProducts + '+' : stats.products}</div>
                <div className="mobile-stat-label">PRODUCTS</div>
              </motion.div>
            </motion.div>

            <motion.div
              className="mk-hero__actions"
              variants={heroItemVariants}
            >
              <Link to="/contact" className="mk-btn-primary">
                <span>Get Free Quote</span>
                <FaArrowRight />
              </Link>
              <Link to="/projects" className="mk-btn-ghost">
                View Our Work <FaArrowRight size={10} />
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mk-hero__stats"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        >
          {[
            { num: stats.years, label: 'Years Experience' },
            { num: stats.clients, label: 'Happy Clients' },
            { num: totalProducts > 0 ? totalProducts + '+' : stats.products, label: 'Products' }
          ].map((s, i) => (
            <div className="mk-hero__stat" key={i}>
              <h4>{s.num}</h4>
              <p>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ─── MARQUEE ──────────────────────────────────────── */}
      <div className="mk-marquee">
        <div className="mk-marquee__track">
          {[
            'Architectural Glass', 'Premium Plywood', 'Modular Kitchens',
            'Luxury Hardware', 'Custom Wardrobes', 'Smart Interiors',
            'Architectural Glass', 'Premium Plywood', 'Modular Kitchens',
            'Luxury Hardware', 'Custom Wardrobes', 'Smart Interiors'
          ].map((item, i) => (
            <span className="mk-marquee__item" key={i}>
              {item}
              <span className="mk-marquee__dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ─── ABOUT SECTION ────────────────────────── */}
      <motion.section
        className="mk-section mk-section--white"
        style={{ padding: 0 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="mk-about-card">
          <motion.div className="mk-about-card__image-wrap" variants={slideInLeft}>
            <div className="mk-about-card__frame">
              <div className="mk-about-card__image-inner">
                <img
                  src="./newprem.jpeg"
                  alt="Our Showroom"
                  onError={handleImageError}
                />
                <div className="mk-about-card__overlay-gradient"></div>
              </div>
              
              <motion.div 
                className="mk-about-card__badge"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="mk-about-card__badge-icon">
                  <FaAward />
                </div>
                <div className="mk-about-card__badge-content">
                  <span className="mk-about-card__badge-num">10+</span>
                  <span className="mk-about-card__badge-text">Years of Excellence</span>
                </div>
              </motion.div>

              <div className="mk-about-card__corner corner-tl"></div>
              <div className="mk-about-card__corner corner-br"></div>
            </div>
          </motion.div>

          <div className="mk-about-card__content">
            <motion.div variants={fadeInUp}>
              <div className="mk-label">
                <div className="mk-label-line" />
                <span>About Us</span>
              </div>
              <h2 className="mk-h2">
                Proudly Serving<br />
                <em>Jharsuguda</em> Since 2010
              </h2>
            </motion.div>

            <motion.p className="mk-about-card__body" variants={fadeInUp}>
              With over 10 years of experience, we've become the most trusted name
              for premium interior solutions in Western Odisha. From architectural
              glass to modular kitchens, every project reflects our commitment
              to quality and design excellence.
            </motion.p>

            <motion.div className="mk-about-card__features" variants={staggerContainer}>
              {[
                { icon: <FaStore />, title: 'Prime Location', desc: 'Bombay Chowk, Jharsuguda' },
                { icon: <FaCheckCircle />, title: 'Quality Guarantee', desc: '5-year warranty on all products' },
                { icon: <FaShieldAlt />, title: 'Premium Materials', desc: 'Only the best materials used' },
                { icon: <FaPalette />, title: 'Custom Designs', desc: 'Tailored to your preferences' }
              ].map((f, i) => (
                <motion.div 
                  className="mk-about-card__feature" 
                  key={i}
                  variants={i === 0 ? boxVariant1 : i === 1 ? boxVariant2 : i === 2 ? boxVariant3 : boxVariant4}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true, amount: 0.3 }}
                  onHoverStart={() => setHoveredBox(i)}
                  onHoverEnd={() => setHoveredBox(null)}
                >
                  <motion.div 
                    className="mk-about-card__feature-icon"
                    animate={hoveredBox === i ? { 
                      rotate: 360,
                      scale: 1.2,
                      backgroundColor: "var(--gold-dark)"
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {f.icon}
                  </motion.div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="mk-about-card__stats" variants={fadeInUp}>
              <div className="mk-about-card__stat-item">
                <span className="mk-about-card__stat-number">{stats.projects}</span>
                <span className="mk-about-card__stat-label">Projects</span>
              </div>
              <div className="mk-about-card__stat-divider"></div>
              <div className="mk-about-card__stat-item">
                <span className="mk-about-card__stat-number">{stats.clients}</span>
                <span className="mk-about-card__stat-label">Clients</span>
              </div>
              <div className="mk-about-card__stat-divider"></div>
              <div className="mk-about-card__stat-item">
                <span className="mk-about-card__stat-number">{stats.brands}</span>
                <span className="mk-about-card__stat-label">Brands</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* EXPERTISE SECTION - 4 CARDS WITH UNIQUE ANIMATIONS */}
      <section className="expertise-section">
        <div className="expertise-bg-pattern"></div>
        <div className="container">
          <motion.div
            className="expertise-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mk-label">
              <div className="mk-label-line" />
              <span>What We Offer</span>
              <div className="mk-label-line" />
            </div>
            <h2 className="mk-h2">
              Our <em>Expertise</em>
            </h2>
            <p style={{ color: 'var(--gray-text)', marginTop: '20px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Discover our range of premium products and services crafted for modern living.
            </p>
          </motion.div>

          <motion.div
            className="expertise-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                variants={index === 0 ? cardVariant1 : index === 1 ? cardVariant2 : index === 2 ? cardVariant3 : cardVariant4}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.3 }}
                onHoverStart={() => setHoveredCategory(index)}
                onHoverEnd={() => setHoveredCategory(null)}
              >
                <Link to={cat.link} className="unique-card">
                  <div className="card-media">
                    <motion.img 
                      src={cat.image} 
                      alt={cat.title} 
                      onError={handleImageError}
                      animate={hoveredCategory === index ? { scale: 1.15 } : { scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="card-overlay-bg"></div>
                    <motion.div
                      className="card-icon-circle"
                      style={{ background: cat.color }}
                      animate={hoveredCategory === index ? { 
                        rotate: 360,
                        scale: 1.1,
                        boxShadow: "0 15px 30px rgba(201, 169, 110, 0.4)"
                      } : { 
                        rotate: 0,
                        scale: 1,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                      }}
                      transition={{ duration: 0.6, type: "spring" }}
                    >
                      {cat.icon}
                    </motion.div>
                  </div>
                  <div className="card-content-unique">
                    <div className="card-number">0{index + 1}</div>
                    <motion.h3 
                      className="card-title-unique"
                      animate={hoveredCategory === index ? { color: "var(--gold-dark)" } : {}}
                    >
                      {cat.title}
                    </motion.h3>
                    <p className="card-desc-unique">{cat.desc}</p>
                    <div className="card-features">
                      {cat.features.map((feature, i) => (
                        <motion.span 
                          key={i} 
                          className="feature-pill"
                          whileHover={{ 
                            scale: 1.1, 
                            backgroundColor: 'var(--gold)', 
                            color: 'white',
                            boxShadow: "0 5px 10px rgba(201, 169, 110, 0.3)"
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {feature}
                        </motion.span>
                      ))}
                    </div>
                    <motion.div 
                      className="card-cta-unique"
                      animate={hoveredCategory === index ? { color: "var(--gold-dark)" } : {}}
                    >
                      <span>Explore Collection ({cat.count} items)</span>
                      <motion.div
                        animate={hoveredCategory === index ? { x: 8 } : { x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaArrowRight />
                      </motion.div>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROJECTS SECTION - WITH MOBILE TAP SUPPORT */}
      <section className="projects-section-unique">
        <div className="projects-bg-text">Portfolio</div>
        <div className="container">
          <motion.div
            className="projects-header-unique"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="projects-header-left">
              <div className="mk-label">
                <div className="mk-label-line" />
                <span>Our Work</span>
              </div>
              <h2 className="mk-h2">
                Recent <em>Projects</em>
              </h2>
            </div>
            <div className="projects-header-right">
              <p>Some of our latest work in Jharsuguda and surrounding areas, showcasing our commitment to quality and design.</p>
            </div>
          </motion.div>

          <motion.div
            className="projects-grid-unique"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {projects.map((project, index) => {
              let cardClass = 'small';
              if (index === 0) cardClass = 'large';
              else if (index === 1) cardClass = 'medium';
              else if (index === 2) cardClass = 'small';
              else if (index === 3) cardClass = 'medium';
              else if (index === 4) cardClass = 'small';
              
              const isOverlayActive = getActiveOverlay(project.id);
              
              return (
                <motion.div
                  key={project.id}
                  className={`project-card-unique ${cardClass} ${isOverlayActive ? 'tapped' : ''}`}
                  custom={index}
                  variants={projectVariants}
                  whileHover={!isTouchDevice() ? "hover" : undefined}
                  onHoverStart={() => handleProjectHover(project.id)}
                  onHoverEnd={handleProjectHoverEnd}
                  onClick={() => handleProjectTap(project.id)}
                >
                  <img
                    className="project-image-unique"
                    src={project.image}
                    alt={project.title}
                    onError={handleImageError}
                  />
                  
                  <AnimatePresence>
                    {isOverlayActive && (
                      <motion.div
                        className="project-overlay-unique"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="project-category-unique">{project.category}</div>
                        <h3 className="project-title-unique">{project.title}</h3>
                        <div className="project-meta-unique">
                          <span className="project-meta-item">
                            <FaRulerCombined /> {project.area}
                          </span>
                          <span className="project-meta-item">
                            <FaRegHeart /> {project.likes}
                          </span>
                          <span className="project-meta-item">
                            <FaEye /> {project.views}
                          </span>
                        </div>
                        <div className="project-stats-unique">
                          <span className="project-stat">
                            <FaStar style={{ color: 'var(--gold)' }} /> 4.9
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="project-view-btn"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FaEye />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="projects-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/projects" className="mk-btn-outline-dark">
              View All Projects <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mk-section mk-section--dark mk-testimonials">
        <div className="mk-testimonials__bg-text" aria-hidden="true">Reviews</div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
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
            className="mk-testimonials__grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                className="mk-testimonial-card"
                key={i}
                custom={i}
                variants={testimonialVariants}
                whileHover="hover"
              >
                <div className="mk-testimonial__quote-icon">
                  <FaQuoteLeft />
                </div>
                <div className="mk-testimonial__stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <FaStar key={j} />
                  ))}
                </div>
                <p className="mk-testimonial__text">"{t.text}"</p>
                <div className="mk-testimonial__divider" />
                <div className="mk-testimonial__name">{t.name}</div>
                <div className="mk-testimonial__role">{t.role}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="mk-cta">
        <div className="mk-cta__bg">
          <img
            src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1600"
            alt="Silver iMac on a brown wooden table in a modern interior"
            onError={handleImageError}
          />
        </div>
        <div className="mk-cta__overlay" />

        <motion.div
          className="mk-cta__content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mk-label" style={{ justifyContent: 'center' }}>
            <div className="mk-label-line" />
            <span>Visit Us</span>
            <div className="mk-label-line" />
          </div>
          <h2 className="mk-cta__title">
            Visit Our<br /><em>Showroom Today</em>
          </h2>
          <p className="mk-cta__subtitle">
            Bombay Chowk, Jharsuguda &nbsp;·&nbsp; Open 9AM to 9PM
          </p>
          <div className="mk-cta__actions">
            <Link to="/contact" className="mk-btn-primary">
              <span>Get Free Consultation</span>
              <FaArrowRight />
            </Link>
            <a href="tel:+917328019093" className="mk-btn-outline-gold">
               <FaPhone style={{ transform: 'rotate(90deg)' }} />
              <span>Call Now</span>
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;