// src/pages/Contact/Contact.jsx - WITH WHATSAPP DIRECT MESSAGE (NO EMAIL) - FIXED EMAIL DISPLAY
import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaStore,
  FaPaperPlane,
  FaCheckCircle,
  FaRegBuilding,
  FaUserTie,
  FaHeadset,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaArrowRight,
  FaMapPin,
  FaRegClock,
  FaRegEnvelope,
  FaRegPaperPlane,
  FaStar,
  FaShieldAlt,
  FaTruck,
  FaAward
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'general',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState({
    projects: '5000+',
    designers: '15+',
    response: '24/7',
    years: '10+'
  });
  
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const isFormInView = useInView(formRef, { once: true, amount: 0.2 });
  const isInfoInView = useInView(infoRef, { once: true, amount: 0.2 });

  // Mouse move effect for parallax
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ============= WHATSAPP DIRECT MESSAGE =============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { name, email, phone, service, message } = formData;
      
      // Format WhatsApp message
      const whatsappMessage = `*New Enquiry from Website*%0A%0A
*Name:* ${name}%0A
*Email:* ${email}%0A
*Phone:* ${phone}%0A
*Service:* ${service}%0A
*Message:* ${message}%0A%0A
*Sent from:* New Prem Glass House Website Contact Form`;
      
      // WhatsApp number
      const whatsappNumber = '917328019093'; // without +
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Show success message
      toast.success('Redirecting to WhatsApp! Please send your message.');
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', service: 'general', message: '' });
      
    } catch (err) {
      console.error('❌ Error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: 'Visit Our Showroom',
      details: ['Bombay Chowk', 'Jharsuguda, Odisha - 768201'],
      action: 'Get Directions',
      link: 'https://maps.google.com/?q=Bombay+Chowk+Jharsuguda',
      color: '#4f8a8b',
      bgGradient: 'linear-gradient(135deg, #4f8a8b10, #4f8a8b20)',
      floatingIcon: <FaMapPin />
    },
    {
      icon: <FaPhone style={{transform: 'rotate(90deg)'}} />,
      title: 'Call Us Anytime',
      details: ['+91 73280 19093', '+91 73280 19094'],
      action: 'Call Now',
      link: 'tel:+917328019093',
      color: '#bd7b4d',
      bgGradient: 'linear-gradient(135deg, #bd7b4d10, #bd7b4d20)',
      floatingIcon: <FaHeadset />
    },
    {
      icon: <FaEnvelope />,
      title: 'Send Us a Message',
      details: ['newpremglasshouse75@gmail.com','odishasourav7575@gmail.com'],
      action: 'Email Us',
      link: 'mailto:newpremglasshouse75@gmail.com',
      color: '#c45a5a',
      bgGradient: 'linear-gradient(135deg, #c45a5a10, #c45a5a20)',
      floatingIcon: <FaRegEnvelope />
    },
    {
      icon: <FaClock />,
      title: 'Working Hours',
      details: ['Monday - Sunday', '9:00 AM - 9:00 PM'],
      action: 'Always Open',
      link: null,
      color: '#b1935c',
      bgGradient: 'linear-gradient(135deg, #b1935c10, #b1935c20)',
      floatingIcon: <FaRegClock />
    }
  ];

  const serviceOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'glass', label: 'Glass Products' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'plywood', label: 'Plywood' },
    { value: 'interiors', label: 'Interior Design' },
    { value: 'quote', label: 'Request Quote' }
  ];

  // Optimized team members - with separate social media links for each
  // Optimized team members - with separate social media links for each
const teamMembers = [
  { 
    name: 'Sourav Sharma', 
    role: 'Founder & CEO', 
    experience: '7+ Years', 
    image: '/vishal.PNG',
    social: {
      facebook: 'https://www.facebook.com/sourav.sharma',
      instagram: 'https://www.instagram.com/sourav_sharma_0075',
      whatsapp: 'https://wa.me/917328019093'
    }
  },
  { 
    name: 'Vishal Sharma', 
    role: 'Lead Designer', 
    experience: '5+ Years', 
    image: '/sourav.jpeg',
    social: {
      facebook: 'https://www.facebook.com/vishal.sharma',
      instagram: 'https://www.instagram.com/i.vishalsharmaa',
      whatsapp: 'https://wa.me/916371106588'
    }
  }
];
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: i * 0.1,
        duration: 0.8
      }
    }),
    hover: {
      y: -15,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.3
      }
    },
    hover: {
      scale: 1.1,
      rotate: 360,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const floatingElementsVariants = {
    initial: { y: 0 },
    animate: (i) => ({
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        delay: i * 0.5,
        ease: "easeInOut"
      }
    })
  };

  const shineVariants = {
    initial: { x: '-100%', opacity: 0 },
    hover: {
      x: '100%',
      opacity: 0.3,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.2, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="contact-page-premium">
      {/* SEO Meta Data */}
      <Helmet>
        <title>Contact Us | New Prem Glass House | Glass, Hardware & Interiors in Jharsuguda</title>
        <meta name="description" content="Contact New Prem Glass House at Bombay Chowk, Jharsuguda. Get free quotes for glass products, hardware, plywood, and interior design services. Call +91 73280 19093." />
        <meta name="keywords" content="contact New Prem Glass House, Jharsuguda glass shop contact, interior designers Jharsuguda contact, hardware store Jharsuguda phone number, plywood dealers Jharsuguda address, glass shop near Bombay Chowk" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://newpremglasshouse.com/contact" />
        <meta property="og:title" content="Contact New Prem Glass House | Jharsuguda's Premier Interior Solutions" />
        <meta property="og:description" content="Visit our showroom at Bombay Chowk, Jharsuguda. Call +91 73280 19093 for free consultation on glass, hardware, plywood and interior design." />
        <meta property="og:image" content="https://newpremglasshouse.com/og-contact.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://newpremglasshouse.com/contact" />
        <meta property="twitter:title" content="Contact New Prem Glass House | Jharsuguda's Premier Interior Solutions" />
        <meta property="twitter:description" content="Visit our showroom at Bombay Chowk, Jharsuguda. Call +91 73280 19093 for free consultation." />
        <meta property="twitter:image" content="https://newpremglasshouse.com/og-contact.jpg" />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": "Contact New Prem Glass House",
              "description": "Contact page for New Prem Glass House in Jharsuguda",
              "mainEntity": {
                "@type": "LocalBusiness",
                "name": "New Prem Glass House",
                "image": "https://newpremglasshouse.com/logo.jpg",
                "telephone": "+917328019093",
                "email": "newpremglasshouse75@gmail.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Bombay Chowk",
                  "addressLocality": "Jharsuguda",
                  "addressRegion": "Odisha",
                  "postalCode": "768201",
                  "addressCountry": "IN"
                },
                "openingHoursSpecification": [
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    "opens": "09:00",
                    "closes": "21:00"
                  }
                ],
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "21.8574",
                  "longitude": "84.0161"
                }
              }
            }
          `}
        </script>
        
        <link rel="canonical" href="https://newpremglasshouse.com/contact" />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --gold: #c9a96e;
          --gold-light: #e8d5b0;
          --gold-dark: #a07840;
          --black: #0a0a0a;
          --dark: #111111;
          --dark-2: #1a1a1a;
          --dark-3: #222222;
          --warm-white: #f8f5f0;
          --off-white: #ede8df;
          --cream: #f2ede4;
          --gray-text: #888888;
          --light-gray: #d4d4d4;
          --white: #ffffff;
          --serif: 'Cormorant Garamond', serif;
          --display: 'DM Serif Display', serif;
          --sans: 'Jost', sans-serif;
          --shadow-sm: 0 10px 30px -15px rgba(0,0,0,0.2);
          --shadow-md: 0 20px 40px -20px rgba(0,0,0,0.3);
          --shadow-lg: 0 30px 60px -30px rgba(0,0,0,0.4);
          --shadow-gold: 0 20px 40px rgba(201, 169, 110, 0.15);
          --shadow-hover: 0 40px 60px -20px rgba(201, 169, 110, 0.4);
        }

        body {
          font-family: var(--sans);
          background: var(--warm-white);
          color: var(--dark);
          overflow-x: hidden;
        }

        .contact-page-premium {
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
          .container { padding: 0 2rem; }
        }
        @media (max-width: 480px) {
          .container { padding: 0 1.5rem; }
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

        .mk-h2 em { 
          font-style: italic; 
          color: var(--gold); 
        }

        .mk-h2--light { 
          color: var(--warm-white); 
        }
        .mk-h2--light em { 
          color: var(--gold); 
        }

        /* Hero Section - WITH BACKGROUND IMAGE - IMPROVED FOR ALL DEVICES */
        .contact-hero-premium {
          position: relative;
          min-height: 110vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 140px 0 120px;
          background: var(--dark);
        }

        .contact-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .contact-hero__bg img {
          width: 100%;
          height: 120%;
          object-fit: cover;
          object-position: center 25%;
          opacity: 0.5;
          transform-origin: center;
          transition: transform 0.1s linear;
          will-change: transform;
        }

        .contact-hero__grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
          z-index: 1;
          pointer-events: none;
        }

        .contact-hero__vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.95) 0%,
            rgba(0,0,0,0.6) 40%,
            rgba(0,0,0,0.2) 70%,
            transparent 100%
          );
          z-index: 2;
        }

        .contact-hero__pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 30%, rgba(201, 169, 110, 0.15) 0px, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .contact-hero__content {
          position: relative;
          z-index: 3;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          transform: translateY(-85px);
        }

        .contact-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 0.8rem 2rem;
          border-radius: 40px;
          color: var(--gold);
          border: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .contact-hero__title {
          font-family: var(--serif);
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 300;
          color: var(--white);
          margin-bottom: 1.5rem;
          line-height: 1;
        }

        .contact-hero__title em {
          font-style: italic;
          color: var(--gold);
        }

        .contact-hero__desc {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.9);
          max-width: 700px;
          margin: 0 auto 2.5rem;
          line-height: 1.8;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        /* Desktop Quick Action Buttons */
        .contact-hero__quick-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2rem;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50px;
          color: var(--white);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .quick-action-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(201, 169, 110, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
          z-index: 0;
        }

        .quick-action-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .quick-action-btn:hover {
          background: var(--gold);
          color: var(--dark);
          border-color: var(--gold);
          transform: translateY(-5px);
          box-shadow: 0 20px 30px -10px rgba(201, 169, 110, 0.3);
        }

        .quick-action-btn span, 
        .quick-action-btn svg {
          position: relative;
          z-index: 1;
        }

        .quick-action-btn svg {
          font-size: 1.2rem;
          color: var(--gold);
          transition: all 0.3s ease;
        }

        .quick-action-btn:hover svg {
          color: var(--dark);
          transform: rotate(360deg);
        }

        /* Hero Contact Info Cards - Desktop */
        .contact-hero__info-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 3.5rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-info-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 1.2rem;
          text-align: center;
          transition: all 0.4s ease;
          cursor: pointer;
        }

        .hero-info-card:hover {
          background: rgba(255,255,255,0.1);
          border-color: var(--gold);
          transform: translateY(-5px);
        }

        .hero-info-icon {
          font-size: 1.8rem;
          color: var(--gold);
          margin-bottom: 0.8rem;
        }

        .hero-info-card h4 {
          font-family: var(--sans);
          font-size: 1rem;
          color: var(--white);
          margin-bottom: 0.3rem;
          font-weight: 600;
        }

        .hero-info-card p {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.8);
        }

        /* Mobile Quick Info - Hidden on Desktop */
        .contact-hero__quick-info-mobile {
          display: none;
        }

        /* Mobile Stats Badges - NEW SECTION */
        .contact-hero__stats-mobile {
          display: none;
        }

        /* Desktop Stats Bar */
        .contact-hero__stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 4rem;
          flex-wrap: wrap;
        }

        .hero-stat-item {
          text-align: center;
        }

        .hero-stat-number {
          font-family: var(--serif);
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 0.3rem;
        }

        .hero-stat-label {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Mobile-Specific Styles */
        @media (max-width: 768px) {
          .contact-hero-premium { 
            min-height: 90vh; 
            padding: 100px 0 80px; 
          }
          
          .contact-hero__bg img {
            height: 250% !important;
            object-position: center 15%;
          }
          
          .contact-hero__title { 
            font-size: 2.5rem; 
            margin-bottom: 1rem;
          }
          
          .contact-hero__desc {
            font-size: 1rem;
            padding: 0 1rem;
            margin-bottom: 1.5rem;
          }
          
          .contact-hero__content {
            transform: translateY(-40px);
            padding-bottom: 0;
          }

          /* Hide Desktop Elements on Mobile */
          .contact-hero__quick-actions,
          .contact-hero__info-cards,
          .contact-hero__stats {
            display: none;
          }

          /* Show Mobile Elements */
          .contact-hero__quick-info-mobile {
            display: flex;
            gap: 0.8rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .quick-info-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.8rem 1.5rem;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 50px;
            color: var(--white);
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }

          .quick-info-item:active {
            background: var(--gold);
            color: var(--dark);
            transform: scale(0.95);
          }

          .quick-info-icon {
            font-size: 1.1rem;
            color: var(--gold);
          }

          .quick-info-item:active .quick-info-icon {
            color: var(--dark);
          }

          /* Mobile Stats Badges - ONE BELOW ANOTHER WITH MORE SPACE */
          .contact-hero__stats-mobile {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 2rem;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
          }

          .stats-mobile-item {
            display: flex;
            align-items: center;
            gap: 1.2rem;
            padding: 0.9rem 1.8rem;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 50px;
            color: var(--white);
            font-size: 1rem;
            width: 100%;
            justify-content: space-between;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          }

          .stats-mobile-label {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            color: rgba(255,255,255,0.95);
          }

          .stats-mobile-icon {
            color: var(--gold);
            font-size: 1.2rem;
          }

          .stats-mobile-number {
            font-family: var(--serif);
            font-size: 1.4rem;
            font-weight: 600;
            color: var(--gold);
          }
        }

        @media (max-width: 480px) {
          .contact-hero-premium { 
            min-height: 95vh; 
            padding: 90px 0 70px; 
          }
          
          .contact-hero__bg img {
            height: 300% !important;
            object-position: center 10%;
          }
          
          .contact-hero__title { 
            font-size: 2.2rem; 
            margin-bottom: 0.8rem;
          }
          
          .contact-hero__desc {
            font-size: 0.95rem;
            margin-bottom: 1.2rem;
          }
          
          .quick-info-item {
            padding: 0.7rem 1.2rem;
            font-size: 0.85rem;
          }
          
          .contact-hero__quick-info-mobile {
            gap: 0.6rem;
            margin-top: 1.2rem;
            margin-bottom: 1.2rem;
          }

          .stats-mobile-item {
            padding: 0.8rem 1.5rem;
            font-size: 0.95rem;
            gap: 1rem;
          }

          .stats-mobile-number {
            font-size: 1.3rem;
          }

          .contact-hero__stats-mobile {
            gap: 0.9rem;
            margin-top: 1.8rem;
            max-width: 280px;
          }
        }

        @media (max-width: 360px) {
          .contact-hero__bg img {
            height: 350% !important;
          }
          
          .contact-hero__quick-info-mobile {
            flex-direction: column;
            align-items: center;
          }
          
          .quick-info-item {
            width: 100%;
            justify-content: center;
          }
        }

        /* Tablet Styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .contact-hero__bg img {
            height: 180%;
            object-position: center 30%;
          }
          
          .contact-hero__info-cards {
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }
          
          .hero-info-card {
            padding: 1rem;
          }
        }

        /* Large Desktop Styles */
        @media (min-width: 1400px) {
          .contact-hero__bg img {
            height: 150%;
            object-position: center 35%;
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        /* Contact Info Cards Section - WITH INCREASED PADDING FOR PC VIEWS */
        .contact-info-premium {
          padding: 160px 0 50px;
          position: relative;
          z-index: 5;
        }

        /* For larger desktop screens, add even more padding */
        @media (min-width: 1400px) {
          .contact-info-premium {
            padding: 180px 0 50px;
          }
        }

        .info-grid-premium {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          margin-top: 3rem;
        }

        .info-card-premium {
          background: var(--white);
          border-radius: 24px;
          padding: 40px 30px;
          box-shadow: var(--shadow-md);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.05);
          text-align: center;
          cursor: pointer;
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .info-card-premium::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--gold), var(--gold-dark));
          transform: scaleX(0);
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          transform-origin: left;
          z-index: 2;
        }

        .info-card-premium::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(201, 169, 110, 0.1) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .info-card-premium:hover::before {
          transform: scaleX(1);
        }

        .info-card-premium:hover::after {
          opacity: 1;
        }

        .info-card-premium:hover {
          transform: translateY(-15px) rotateX(2deg) rotateY(2deg);
          box-shadow: var(--shadow-hover);
        }

        .info-card__shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          pointer-events: none;
          z-index: 3;
        }

        .info-icon-wrapper {
          width: 80px;
          height: 80px;
          background: var(--cream);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: var(--gold);
          font-size: 2rem;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
        }

        .info-icon-wrapper::before {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 35px;
          background: conic-gradient(from 0deg, transparent, var(--gold), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .info-card-premium:hover .info-icon-wrapper {
          background: var(--gold);
          color: var(--white);
          transform: rotateY(180deg) scale(1.1);
        }

        .info-card-premium:hover .info-icon-wrapper::before {
          opacity: 1;
          animation: rotate 2s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .info-card-premium h3 {
          font-family: var(--serif);
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--dark);
          transition: all 0.3s ease;
        }

        .info-card-premium:hover h3 {
          color: var(--gold);
          transform: scale(1.05);
        }

        .info-details {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .info-details p {
          color: var(--gray-text);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 0.3rem;
          transition: all 0.3s ease;
        }

        .info-card-premium:hover .info-details p {
          color: var(--dark);
          transform: translateX(5px);
        }

        .info-details p:first-child {
          font-weight: 600;
        }

        .info-action {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.5rem;
          background: transparent;
          border: 2px solid var(--gold);
          border-radius: 30px;
          color: var(--gold);
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin-top: 1rem;
          position: relative;
          overflow: hidden;
        }

        .info-action::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(201, 169, 110, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        .info-action:hover::before {
          width: 300px;
          height: 300px;
        }

        .info-action:hover {
          background: var(--gold);
          color: var(--white);
          gap: 1rem;
          transform: scale(1.05);
        }

        .info-action svg {
          transition: transform 0.3s ease;
        }

        .info-action:hover svg {
          transform: translateX(5px);
        }

        /* Floating Elements */
        .floating-element {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(201, 169, 110, 0.05);
          pointer-events: none;
          z-index: 1;
        }

        .floating-element-1 {
          top: 10%;
          left: 5%;
        }

        .floating-element-2 {
          bottom: 15%;
          right: 8%;
        }

        .floating-element-3 {
          top: 30%;
          right: 15%;
        }

        /* Form & Map Section */
        .contact-form-premium {
          padding: 80px 0;
          background: var(--cream);
          position: relative;
          overflow: hidden;
        }

        .contact-form__bg-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--serif);
          font-size: clamp(8rem, 15vw, 15rem);
          font-weight: 700;
          color: rgba(201, 169, 110, 0.05);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .form-map-grid-premium {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          position: relative;
          z-index: 2;
        }

        .form-container-premium {
          background: var(--white);
          border-radius: 30px;
          padding: 50px;
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .form-container-premium:hover {
          box-shadow: var(--shadow-hover);
        }

        .form-header {
          margin-bottom: 2.5rem;
        }

        .form-header .mk-label {
          margin-bottom: 1rem;
        }

        .form-header h3 {
          font-family: var(--serif);
          font-size: 2.2rem;
          color: var(--dark);
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: var(--gray-text);
          font-size: 1rem;
        }

        .form-group-premium {
          margin-bottom: 1.8rem;
          position: relative;
        }

        .form-group-premium label {
          display: block;
          margin-bottom: 0.5rem;
          font-family: var(--sans);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: var(--dark);
          transition: all 0.3s ease;
        }

        .form-group-premium label.active {
          color: var(--gold);
          transform: translateX(5px);
        }

        .form-group-premium input,
        .form-group-premium select,
        .form-group-premium textarea {
          width: 100%;
          padding: 1rem 1.2rem;
          background: var(--cream);
          border: 2px solid transparent;
          border-radius: 12px;
          font-family: var(--sans);
          font-size: 1rem;
          color: var(--dark);
          transition: all 0.3s ease;
        }

        .form-group-premium input:focus,
        .form-group-premium select:focus,
        .form-group-premium textarea:focus {
          outline: none;
          border-color: var(--gold);
          background: var(--white);
          box-shadow: var(--shadow-gold);
          transform: scale(1.02);
        }

        .form-group-premium input.error,
        .form-group-premium select.error,
        .form-group-premium textarea.error {
          border-color: #dc3545;
        }

        .form-group-premium textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-group-premium select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23c9a96e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 16px;
        }

        .input-focus-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--gold);
          transition: width 0.3s ease;
        }

        .form-group-premium:focus-within .input-focus-line {
          width: 100%;
        }

        .submit-btn {
          width: 100%;
          padding: 1.2rem;
          background: var(--gold);
          border: none;
          border-radius: 12px;
          color: var(--dark);
          font-family: var(--sans);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          margin-top: 1rem;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--dark);
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .submit-btn:hover::before {
          transform: translateX(0);
        }

        .submit-btn:hover {
          color: var(--gold);
          transform: scale(1.02);
        }

        .submit-btn span, .submit-btn svg {
          position: relative;
          z-index: 1;
        }

        .submit-btn svg {
          transition: transform 0.3s ease;
        }

        .submit-btn:hover svg {
          transform: translateX(5px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-btn:disabled::before {
          display: none;
        }

        .map-container-premium {
          background: var(--white);
          border-radius: 30px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(0,0,0,0.05);
          height: 100%;
          min-height: 500px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .map-container-premium:hover {
          box-shadow: var(--shadow-hover);
          transform: scale(1.02);
        }

        .map-header {
          padding: 30px 30px 0;
        }

        .map-header h3 {
          font-family: var(--serif);
          font-size: 2rem;
          color: var(--dark);
          margin-bottom: 0.5rem;
        }

        .map-header p {
          color: var(--gray-text);
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .map-header p svg {
          color: var(--gold);
          animation: bounce 2s infinite;
        }

        .map-frame {
          flex: 1;
          width: 100%;
          height: 100%;
          min-height: 400px;
        }

        .map-frame iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Team Section - Updated for 2 cards */
        .team-section {
          padding: 80px 0;
          background: var(--white);
          position: relative;
          overflow: hidden;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          margin-top: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .team-card {
          background: var(--cream);
          border-radius: 24px;
          padding: 40px 30px;
          text-align: center;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.05);
          cursor: pointer;
        }

        .team-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(201, 169, 110, 0.1) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .team-card:hover::before {
          opacity: 1;
        }

        .team-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: var(--shadow-hover);
        }

        .team-image {
          width: 120px;
          height: 120px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid var(--gold);
          box-shadow: var(--shadow-md);
          transition: all 0.5s ease;
          position: relative;
        }

        .team-image::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .team-card:hover .team-image {
          transform: rotate(5deg) scale(1.1);
          border-color: var(--gold-dark);
        }

        .team-card:hover .team-image::before {
          opacity: 1;
        }

        .team-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .team-card:hover .team-image img {
          transform: scale(1.1);
        }

        .team-card h4 {
          font-family: var(--serif);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--dark);
          transition: all 0.3s ease;
        }

        .team-card:hover h4 {
          color: var(--gold);
          transform: scale(1.05);
        }

        .team-role {
          color: var(--gold);
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .team-card:hover .team-role {
          letter-spacing: 1px;
        }

        .team-exp {
          color: var(--gray-text);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        .team-card:hover .team-exp {
          color: var(--dark);
        }

        .team-social {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .team-social a {
          width: 35px;
          height: 35px;
          background: var(--white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .team-social a::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: scale(0);
          transition: transform 0.3s ease;
          border-radius: 50%;
        }

        .team-social a:hover::before {
          transform: scale(1);
        }

        .team-social a:hover {
          color: var(--white);
          transform: translateY(-5px) rotate(360deg);
        }

        .team-social a svg {
          position: relative;
          z-index: 1;
        }

        /* Social Proof Bar */
        .social-proof-bar {
          background: var(--dark);
          padding: 20px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }

        .social-proof-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          to {
            left: 100%;
          }
        }

        .proof-items {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .proof-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .proof-item:hover {
          color: var(--gold);
          transform: scale(1.05);
        }

        .proof-item svg {
          color: var(--gold);
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .proof-item:hover svg {
          transform: rotate(360deg);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .info-grid-premium { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 1024px) {
          .form-map-grid-premium { grid-template-columns: 1fr; }
          .map-container-premium { min-height: 400px; }
        }

        @media (max-width: 768px) {
          .info-grid-premium { grid-template-columns: 1fr; }
          .team-grid { grid-template-columns: 1fr; }
          .form-container-premium { padding: 30px; }
          .proof-items { justify-content: center; }
          
          .info-card-premium:hover {
            transform: translateY(-10px) rotateX(0) rotateY(0);
          }
          
          /* Mobile padding for contact-info-premium - KEEP ORIGINAL MOBILE PADDING */
          .contact-info-premium {
            padding: 80px 0 40px;
          }
        }

        @media (max-width: 480px) {
          .form-container-premium { padding: 25px; }
          .info-card-premium { padding: 30px 20px; }
          
          .contact-info-premium {
            padding: 60px 0 30px;
          }
        }

        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          .info-card-premium {
            transition: all 0.3s ease;
          }
          
          .info-card-premium:active {
            transform: scale(0.98);
          }
          
          .info-action:active {
            transform: scale(0.95);
          }
          
          .team-card:active {
            transform: scale(0.98);
          }
          
          .quick-action-btn:active {
            transform: scale(0.95);
          }
        }
      `}</style>

      {/* Floating Background Elements */}
      <div className="floating-element floating-element-1"></div>
      <div className="floating-element floating-element-2"></div>
      <div className="floating-element floating-element-3"></div>

      {/* Hero Section - WITH IMPROVEMENTS FOR ALL DEVICES */}
      <section className="contact-hero-premium" ref={heroRef}>
        <div className="contact-hero__bg">
          <motion.img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"
            alt="Contact New Prem Glass House"
            animate={{
              scale: 1.05,
              translateX: mousePosition.x * 0.02,
              translateY: mousePosition.y * 0.02
            }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 30
            }}
          />
        </div>
        <div className="contact-hero__grain" />
        <div className="contact-hero__vignette" />
        <div className="contact-hero__pattern"></div>
        
        <div className="container">
          <div className="contact-hero__content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                className="contact-hero__badge"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaStore /> Get in Touch
              </motion.div>
            </motion.div>
            
            <motion.h1
              className="contact-hero__title"
              initial={{ opacity: 0, y: 50 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Let's Start a <em>Conversation</em>
            </motion.h1>
            
            <motion.p
              className="contact-hero__desc"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              We'd love to hear from you. Whether you have a question about our products, 
              need a quote, or want to discuss your next project.
            </motion.p>

            {/* DESKTOP QUICK ACTION BUTTONS */}
            <motion.div 
              className="contact-hero__quick-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.a 
                href="tel:+917328019093"
                className="quick-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhone />
                <span>Call Now</span>
              </motion.a>
              
              <motion.a 
                href="https://wa.me/917328019093"
                className="quick-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsapp />
                <span>WhatsApp</span>
              </motion.a>
              
              <motion.a 
                href="mailto:newpremglasshouse75@gmail.com"
                className="quick-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope />
                <span>Email Us</span>
              </motion.a>
            </motion.div>

            {/* DESKTOP INFO CARDS */}
            <motion.div 
              className="contact-hero__info-cards"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                className="hero-info-card"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaMapMarkerAlt className="hero-info-icon" />
                <h4>Visit Us</h4>
                <p>Bombay Chowk, Jharsuguda</p>
              </motion.div>
              
              <motion.div 
                className="hero-info-card"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaClock className="hero-info-icon" />
                <h4>Working Hours</h4>
                <p>9AM - 9PM (All Days)</p>
              </motion.div>
              
              <motion.div 
                className="hero-info-card"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaHeadset className="hero-info-icon" />
                <h4>Quick Support</h4>
                <p>24/7 Customer Service</p>
              </motion.div>
            </motion.div>

            {/* DESKTOP STATS BAR */}
            <motion.div 
              className="contact-hero__stats"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hero-stat-item">
                <div className="hero-stat-number">{stats.projects}</div>
                <div className="hero-stat-label">Projects</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-number">{stats.designers}</div>
                <div className="hero-stat-label">Designers</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-number">{stats.response}</div>
                <div className="hero-stat-label">Support</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-number">{stats.years}</div>
                <div className="hero-stat-label">Experience</div>
              </div>
            </motion.div>

            {/* MOBILE QUICK INFO CARDS */}
            <motion.div 
              className="contact-hero__quick-info-mobile"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.a 
                href="tel:+917328019093"
                className="quick-info-item"
                whileTap={{ scale: 0.95 }}
              >
                <FaPhone className="quick-info-icon" />
                <span>Call Now</span>
              </motion.a>
              
              <motion.a 
                href="https://wa.me/917328019093"
                className="quick-info-item"
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsapp className="quick-info-icon" />
                <span>WhatsApp</span>
              </motion.a>
              
              <motion.a 
                href="mailto:newpremglasshouse75@gmail.com"
                className="quick-info-item"
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope className="quick-info-icon" />
                <span>Email</span>
              </motion.a>
            </motion.div>

            {/* MOBILE STATS BADGES */}
            <motion.div 
              className="contact-hero__stats-mobile"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                className="stats-mobile-item"
                whileTap={{ scale: 0.98 }}
              >
                <span className="stats-mobile-label">
                  <FaAward className="stats-mobile-icon" />
                  <span>Projects</span>
                </span>
                <span className="stats-mobile-number">{stats.projects}</span>
              </motion.div>
              
              <motion.div 
                className="stats-mobile-item"
                whileTap={{ scale: 0.98 }}
              >
                <span className="stats-mobile-label">
                  <FaUserTie className="stats-mobile-icon" />
                  <span>Designers</span>
                </span>
                <span className="stats-mobile-number">{stats.designers}</span>
              </motion.div>
              
              <motion.div 
                className="stats-mobile-item"
                whileTap={{ scale: 0.98 }}
              >
                <span className="stats-mobile-label">
                  <FaHeadset className="stats-mobile-icon" />
                  <span>Support</span>
                </span>
                <span className="stats-mobile-number">{stats.response}</span>
              </motion.div>
              
              <motion.div 
                className="stats-mobile-item"
                whileTap={{ scale: 0.98 }}
              >
                <span className="stats-mobile-label">
                  <FaClock className="stats-mobile-icon" />
                  <span>Experience</span>
                </span>
                <span className="stats-mobile-number">{stats.years}</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards - Enhanced with Animations */}
      <section className="contact-info-premium" ref={infoRef}>
        <div className="container">
          <motion.div 
            className="mk-label"
            initial={{ opacity: 0, y: 20 }}
            animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ justifyContent: 'center', marginBottom: '1rem' }}
          >
            <motion.div 
              className="mk-label-line"
              initial={{ width: 0 }}
              animate={isInfoInView ? { width: 30 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInfoInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              REACH US
            </motion.span>
            <motion.div 
              className="mk-label-line"
              initial={{ width: 0 }}
              animate={isInfoInView ? { width: 30 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>
          
          <motion.h2 
            className="mk-h2" 
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Get in <motion.em
              animate={{ 
                color: ['#c9a96e', '#a07840', '#c9a96e']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >Touch</motion.em>
          </motion.h2>

          <motion.div 
            className="info-grid-premium"
            variants={staggerContainer}
            initial="hidden"
            animate={isInfoInView ? "visible" : "hidden"}
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="info-card-premium"
                variants={cardVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                style={{
                  background: hoveredCard === index ? info.bgGradient : 'var(--white)',
                }}
              >
                {/* Shine Effect */}
                <motion.div 
                  className="info-card__shine"
                  variants={shineVariants}
                  initial="initial"
                  whileHover="hover"
                />

                {/* Floating Icons */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    color: info.color,
                    opacity: 0.2,
                    fontSize: '3rem'
                  }}
                  variants={floatingElementsVariants}
                  initial="initial"
                  animate="animate"
                  custom={index}
                >
                  {info.floatingIcon}
                </motion.div>

                {/* Pulsing Background */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at center, ${info.color}20, transparent)`,
                    borderRadius: '24px'
                  }}
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                />

                <motion.div 
                  className="info-icon-wrapper"
                  variants={iconVariants}
                  whileHover="hover"
                  style={{ color: info.color }}
                >
                  {info.icon}
                </motion.div>

                <motion.h3
                  animate={hoveredCard === index ? { color: info.color } : {}}
                >
                  {info.title}
                </motion.h3>

                <div className="info-details">
                  {info.details.map((detail, i) => (
                    <motion.p 
                      key={i}
                      animate={hoveredCard === index ? { x: 5 } : {}}
                      transition={{ delay: i * 0.1 }}
                    >
                      {detail}
                    </motion.p>
                  ))}
                </div>

                {info.link && (
                  <motion.a 
                    href={info.link} 
                    className="info-action" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ borderColor: info.color, color: info.color }}
                  >
                    {info.action} 
                    <motion.div
                      animate={hoveredCard === index ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <FaArrowRight />
                    </motion.div>
                  </motion.a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <div className="social-proof-bar">
        <div className="container">
          <motion.div 
            className="proof-items"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="proof-item"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCheckCircle /> {stats.projects} Projects Completed
            </motion.span>
            <motion.span 
              className="proof-item"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUserTie /> {stats.designers} Expert Designers
            </motion.span>
            <motion.span 
              className="proof-item"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHeadset /> {stats.response} Customer Support
            </motion.span>
            <motion.span 
              className="proof-item"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRegClock /> Same Day Response
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Form & Map Section */}
      <section className="contact-form-premium" ref={formRef}>
        <div className="contact-form__bg-text" aria-hidden="true">Connect</div>
        <div className="container">
          <div className="form-map-grid-premium">
            <motion.div 
              className="form-container-premium"
              initial={{ opacity: 0, x: -50 }}
              animate={isFormInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ boxShadow: 'var(--shadow-hover)' }}
            >
              <div className="form-header">
                <motion.div 
                  className="mk-label"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isFormInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 }}
                >
                  <div className="mk-label-line"></div>
                  <span>SEND MESSAGE</span>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  Let's Discuss Your Project
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isFormInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  Fill out the form below and we'll get back to you within 24 hours.
                </motion.p>
              </div>

              <form onSubmit={handleSubmit}>
                {['name', 'email', 'phone', 'service', 'message'].map((field, index) => (
                  <motion.div 
                    key={field}
                    className="form-group-premium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <label className={activeField === field ? 'active' : ''}>
                      {field === 'name' && 'Your Name'}
                      {field === 'email' && 'Email Address'}
                      {field === 'phone' && 'Phone Number'}
                      {field === 'service' && 'Service Interested In'}
                      {field === 'message' && 'Your Message'}
                    </label>
                    
                    {field === 'service' ? (
                      <select
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        onFocus={() => setActiveField(field)}
                        onBlur={() => setActiveField(null)}
                        required={field !== 'service'}
                      >
                        {serviceOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field === 'message' ? (
                      <textarea
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        onFocus={() => setActiveField(field)}
                        onBlur={() => setActiveField(null)}
                        required
                      />
                    ) : (
                      <input
                        type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        onFocus={() => setActiveField(field)}
                        onBlur={() => setActiveField(null)}
                        required
                      />
                    )}
                    
                    <motion.div 
                      className="input-focus-line"
                      animate={activeField === field ? { width: '100%' } : { width: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))}

                <motion.button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1 }}
                >
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FaRegPaperPlane />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaRegPaperPlane />
                    </motion.div>
                  )}
                </motion.button>
              </form>
            </motion.div>

            <motion.div 
              className="map-container-premium"
              initial={{ opacity: 0, x: 50 }}
              animate={isFormInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-hover)' }}
            >
              <div className="map-header">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  Visit Our Showroom
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isFormInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaMapPin />
                  </motion.div>
                  Bombay Chowk, Jharsuguda, Odisha - 768201
                </motion.p>
              </div>
              <motion.div 
                className="map-frame"
                initial={{ opacity: 0 }}
                animate={isFormInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.216895312!2d83.96562355!3d22.4594248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a202d2b1b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sJharsuguda%2C%20Odisha!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  title="Jharsuguda Map"
                ></iframe>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section - Optimized with 2 experts and separate social links */}
      <section className="team-section">
        <div className="container">
          <motion.div 
            className="mk-label"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ justifyContent: 'center' }}
          >
            <motion.div 
              className="mk-label-line"
              initial={{ width: 0 }}
              whileInView={{ width: 30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              OUR TEAM
            </motion.span>
            <motion.div 
              className="mk-label-line"
              initial={{ width: 0 }}
              whileInView={{ width: 30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>
          
          <motion.h2 
            className="mk-h2" 
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Meet Our <em>Experts</em>
          </motion.h2>

          <motion.div 
            className="team-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                variants={cardVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div 
                  className="team-image"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/120x120?text=Profile';
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                
                <motion.h4
                  whileHover={{ color: '#c9a96e' }}
                >
                  {member.name}
                </motion.h4>
                
                <motion.div 
                  className="team-role"
                  whileHover={{ letterSpacing: '2px' }}
                >
                  {member.role}
                </motion.div>
                
                <div className="team-exp">{member.experience} Experience</div>
                
                <div className="team-social">
                  <motion.a 
                    href={member.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <FaFacebookF />
                  </motion.a>
                  
                  <motion.a 
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <FaInstagram />
                  </motion.a>
                  
                  <motion.a 
                    href={member.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <FaWhatsapp />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;