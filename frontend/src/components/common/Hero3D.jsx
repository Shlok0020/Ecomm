// src/components/common/Hero3D.jsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPhone, FaGem } from 'react-icons/fa';
import { useRef } from 'react';

const Hero3D = ({ 
  title, 
  subtitle, 
  btnText = 'Get Free Quote', 
  btnLink = '/contact',
  showCallBtn = true,
  callNumber = '+917328019093',
  badge = 'Since 2014',
  backgroundImage,
  overlay = true
}) => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Animation variants for 3D elements
  const cubeVariants = {
    float: {
      y: [0, -30, 0],
      rotate: [0, 15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    rotate: {
      rotateY: [0, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <section ref={heroRef} className="hero-3d">
      {/* Background Image with Parallax */}
      {backgroundImage && (
        <motion.div 
          className="hero-background"
          style={{ y, opacity }}
        >
          <img src={backgroundImage} alt="Hero Background" />
        </motion.div>
      )}

      {/* Gradient Overlay */}
      {overlay && <div className="hero-overlay"></div>}

      {/* Grain Effect */}
      <div className="hero-grain"></div>

      {/* Content */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-badge"
        >
          <FaGem className="badge-icon" />
          <span>{badge}</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to={btnLink} className="btn-primary">
            <span>{btnText}</span>
            <FaArrowRight className="btn-icon" />
          </Link>

          {showCallBtn && (
            <a href={`tel:${callNumber}`} className="btn-outline">
              <FaPhone className="btn-icon phone-icon" />
              <span>Call Now</span>
            </a>
          )}
        </motion.div>

        {/* Stats Badges */}
        <motion.div 
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="stat-item">
            <span className="stat-value">5000+</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">10+</span>
            <span className="stat-label">Years</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </motion.div>
      </div>

      {/* 3D Elements */}
      <div className="hero-3d-elements">
        {/* Floating Cubes */}
        <motion.div 
          className="cube cube-1"
          variants={cubeVariants}
          animate={["float", "rotate"]}
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,110,0.2) 0%, rgba(201,169,110,0.05) 100%)',
            border: '1px solid rgba(201,169,110,0.3)'
          }}
        >
          <div className="cube-face front"></div>
          <div className="cube-face back"></div>
          <div className="cube-face right"></div>
          <div className="cube-face left"></div>
          <div className="cube-face top"></div>
          <div className="cube-face bottom"></div>
        </motion.div>

        <motion.div 
          className="cube cube-2"
          variants={cubeVariants}
          animate={["float", "rotate"]}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div className="cube-face front"></div>
          <div className="cube-face back"></div>
          <div className="cube-face right"></div>
          <div className="cube-face left"></div>
          <div className="cube-face top"></div>
          <div className="cube-face bottom"></div>
        </motion.div>

        <motion.div 
          className="cube cube-3"
          variants={cubeVariants}
          animate={["float", "rotate"]}
          style={{
            background: 'linear-gradient(135deg, rgba(189,123,77,0.15) 0%, rgba(189,123,77,0.05) 100%)',
            border: '1px solid rgba(189,123,77,0.2)'
          }}
        >
          <div className="cube-face front"></div>
          <div className="cube-face back"></div>
          <div className="cube-face right"></div>
          <div className="cube-face left"></div>
          <div className="cube-face top"></div>
          <div className="cube-face bottom"></div>
        </motion.div>

        {/* Floating Spheres */}
        <motion.div 
          className="sphere sphere-1"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div 
          className="sphere sphere-2"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Glass Panels */}
        <motion.div 
          className="glass-panel glass-1"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div 
          className="glass-panel glass-2"
          animate={{
            rotate: [360, 180, 0],
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Light Rays */}
        <div className="light-ray ray-1"></div>
        <div className="light-ray ray-2"></div>
        <div className="light-ray ray-3"></div>
      </div>

      <style jsx>{`
        .hero-3d {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          background: #0a0a0a;
          margin-top: -80px;
          padding-top: 80px;
        }

        /* Background Image */
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 120%;
          z-index: 0;
        }

        .hero-background img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.4;
        }

        /* Gradient Overlay */
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(10,10,10,0.3) 0%,
            rgba(10,10,10,0.7) 50%,
            rgba(10,10,10,0.9) 100%
          );
          z-index: 1;
        }

        /* Grain Effect */
        .hero-grain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
          z-index: 1;
          pointer-events: none;
        }

        /* Content */
        .hero-content {
          max-width: 1000px;
          padding: 0 2rem;
          position: relative;
          z-index: 10;
          transform: translateY(-40px);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 0.8rem 2rem;
          border-radius: 40px;
          color: #c9a96e;
          border: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .badge-icon {
          color: #c9a96e;
        }

        .hero-content h1 {
          font-size: clamp(3rem, 8vw, 5.5rem);
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          margin-bottom: 1.5rem;
          color: white;
          line-height: 1.1;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .hero-content h1 em {
          font-style: italic;
          color: #c9a96e;
        }

        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          color: rgba(255,255,255,0.8);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.8;
        }

        /* Buttons */
        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 2.5rem;
          background: #c9a96e;
          color: #111;
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          box-shadow: 0 10px 20px rgba(201,169,110,0.3);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #111;
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }

        .btn-primary:hover::before {
          transform: translateX(0);
        }

        .btn-primary:hover {
          color: #c9a96e;
          transform: translateY(-3px);
          box-shadow: 0 20px 30px rgba(201,169,110,0.4);
        }

        .btn-primary span,
        .btn-primary .btn-icon {
          position: relative;
          z-index: 1;
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 2.5rem;
          background: transparent;
          color: white;
          border: 2px solid #c9a96e;
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.4s ease;
          font-size: 1rem;
        }

        .btn-outline:hover {
          background: #c9a96e;
          color: #111;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(201,169,110,0.3);
        }

        .phone-icon {
          transform: rotate(90deg);
          transition: transform 0.3s ease;
        }

        .btn-outline:hover .phone-icon {
          transform: rotate(90deg) scale(1.1);
        }

        /* Stats */
        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin-top: 3rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          font-weight: 600;
          color: #c9a96e;
          line-height: 1;
          margin-bottom: 0.3rem;
        }

        .stat-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.7);
        }

        .stat-divider {
          width: 1px;
          height: 30px;
          background: rgba(255,255,255,0.2);
        }

        /* 3D Elements Container */
        .hero-3d-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }

        /* Cubes */
        .cube {
          position: absolute;
          width: 150px;
          height: 150px;
          transform-style: preserve-3d;
          transform-origin: center center;
          opacity: 0.5;
        }

        .cube-1 {
          top: 15%;
          left: 5%;
          width: 200px;
          height: 200px;
        }

        .cube-2 {
          bottom: 10%;
          right: 5%;
          width: 180px;
          height: 180px;
        }

        .cube-3 {
          top: 50%;
          left: 80%;
          width: 120px;
          height: 120px;
        }

        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(255,255,255,0.1);
          background: inherit;
          opacity: 0.3;
        }

        .front { transform: translateZ(75px); }
        .back { transform: translateZ(-75px) rotateY(180deg); }
        .right { transform: rotateY(90deg) translateZ(75px); }
        .left { transform: rotateY(-90deg) translateZ(75px); }
        .top { transform: rotateX(90deg) translateZ(75px); }
        .bottom { transform: rotateX(-90deg) translateZ(75px); }

        .cube-1 .front { transform: translateZ(100px); }
        .cube-1 .back { transform: translateZ(-100px) rotateY(180deg); }
        .cube-1 .right { transform: rotateY(90deg) translateZ(100px); }
        .cube-1 .left { transform: rotateY(-90deg) translateZ(100px); }
        .cube-1 .top { transform: rotateX(90deg) translateZ(100px); }
        .cube-1 .bottom { transform: rotateX(-90deg) translateZ(100px); }

        .cube-2 .front { transform: translateZ(90px); }
        .cube-2 .back { transform: translateZ(-90px) rotateY(180deg); }
        .cube-2 .right { transform: rotateY(90deg) translateZ(90px); }
        .cube-2 .left { transform: rotateY(-90deg) translateZ(90px); }
        .cube-2 .top { transform: rotateX(90deg) translateZ(90px); }
        .cube-2 .bottom { transform: rotateX(-90deg) translateZ(90px); }

        .cube-3 .front { transform: translateZ(60px); }
        .cube-3 .back { transform: translateZ(-60px) rotateY(180deg); }
        .cube-3 .right { transform: rotateY(90deg) translateZ(60px); }
        .cube-3 .left { transform: rotateY(-90deg) translateZ(60px); }
        .cube-3 .top { transform: rotateX(90deg) translateZ(60px); }
        .cube-3 .bottom { transform: rotateX(-90deg) translateZ(60px); }

        /* Spheres */
        .sphere {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(201,169,110,0.2), transparent 70%);
          filter: blur(20px);
        }

        .sphere-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          right: 10%;
        }

        .sphere-2 {
          width: 400px;
          height: 400px;
          bottom: -20%;
          left: -10%;
        }

        /* Glass Panels */
        .glass-panel {
          position: absolute;
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(5px);
          border-radius: 30px;
          transform: rotate(45deg);
        }

        .glass-1 {
          top: -10%;
          right: -10%;
        }

        .glass-2 {
          bottom: -10%;
          left: -10%;
        }

        /* Light Rays */
        .light-ray {
          position: absolute;
          width: 200%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent);
          transform: rotate(45deg);
          animation: rayMove 15s linear infinite;
        }

        .ray-1 {
          top: 20%;
          left: -50%;
          animation-delay: 0s;
        }

        .ray-2 {
          top: 50%;
          left: -50%;
          animation-delay: 5s;
        }

        .ray-3 {
          top: 80%;
          left: -50%;
          animation-delay: 10s;
        }

        @keyframes rayMove {
          from { transform: translateX(-100%) rotate(45deg); }
          to { transform: translateX(100%) rotate(45deg); }
        }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .cube-1 { width: 150px; height: 150px; }
          .cube-2 { width: 130px; height: 130px; }
          .cube-3 { width: 100px; height: 100px; }
          
          .cube-1 .front { transform: translateZ(75px); }
          .cube-1 .back { transform: translateZ(-75px) rotateY(180deg); }
          .cube-1 .right { transform: rotateY(90deg) translateZ(75px); }
          .cube-1 .left { transform: rotateY(-90deg) translateZ(75px); }
          .cube-1 .top { transform: rotateX(90deg) translateZ(75px); }
          .cube-1 .bottom { transform: rotateX(-90deg) translateZ(75px); }
          
          .cube-2 .front { transform: translateZ(65px); }
          .cube-2 .back { transform: translateZ(-65px) rotateY(180deg); }
          .cube-2 .right { transform: rotateY(90deg) translateZ(65px); }
          .cube-2 .left { transform: rotateY(-90deg) translateZ(65px); }
          .cube-2 .top { transform: rotateX(90deg) translateZ(65px); }
          .cube-2 .bottom { transform: rotateX(-90deg) translateZ(65px); }
          
          .cube-3 .front { transform: translateZ(50px); }
          .cube-3 .back { transform: translateZ(-50px) rotateY(180deg); }
          .cube-3 .right { transform: rotateY(90deg) translateZ(50px); }
          .cube-3 .left { transform: rotateY(-90deg) translateZ(50px); }
          .cube-3 .top { transform: rotateX(90deg) translateZ(50px); }
          .cube-3 .bottom { transform: rotateX(-90deg) translateZ(50px); }
        }

        @media (max-width: 768px) {
          .hero-content {
            transform: translateY(-20px);
          }

          .hero-badge {
            padding: 0.6rem 1.5rem;
            font-size: 0.8rem;
          }

          .hero-content h1 {
            font-size: 2.5rem;
          }

          .hero-content p {
            font-size: 1rem;
          }

          .hero-buttons {
            flex-direction: column;
            gap: 1rem;
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
          }

          .btn-primary,
          .btn-outline {
            width: 100%;
            justify-content: center;
          }

          .hero-stats {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .stat-value {
            font-size: 2rem;
          }

          .stat-divider {
            display: none;
          }

          /* Hide some 3D elements on mobile */
          .cube-3,
          .sphere-2,
          .glass-2 {
            display: none;
          }

          .cube-1,
          .cube-2 {
            opacity: 0.2;
          }

          .glass-1 {
            opacity: 0.1;
          }
        }

        @media (max-width: 480px) {
          .hero-content {
            transform: translateY(-10px);
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .stat-item {
            width: 100%;
          }

          .sphere-1 {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero3D;