// src/pages/Contact/Contact.jsx - WITH BACKGROUND IMAGE + 40% MORE HEIGHT FOR PC + DATA FLOW
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
  FaRegPaperPlane
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  // ============= DATA FLOW: Fetch real stats from database =============
  
  const fetchStats = async () => {
    try {
      // Try to get contact form submissions count (if available)
      const response = await contactService.getStats();
      if (response?.data) {
        setStats({
          projects: response.data.projects || '5000+',
          designers: response.data.designers || '15+',
          response: response.data.response || '24/7',
          years: response.data.years || '10+'
        });
      }
    } catch (error) {
      console.log('Using default stats');
    }
  };

  // Mouse move effect for parallax
  useEffect(() => {
    let rafId = null;
    
    // Fetch stats on mount
    fetchStats();
    
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

  // ============= FORM SUBMISSION - SAVE TO DATABASE =============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('📝 Submitting contact form:', formData);
      
      // Save to database via contact service
      const response = await contactService.submit(formData);
      
      console.log('✅ Form submitted successfully:', response.data);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', service: 'general', message: '' });
      toast.success('Message sent successfully!');
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (err) {
      console.error('❌ Form submission error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      toast.error('Failed to send message');
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
      color: '#4f8a8b'
    },
    {
      icon: <FaPhone />,
      title: 'Call Us Anytime',
      details: ['+91 73280 19093', '+91 73280 19094'],
      action: 'Call Now',
      link: 'tel:+917328019093',
      color: '#bd7b4d'
    },
    {
      icon: <FaEnvelope />,
      title: 'Send Us a Message',
      details: ['info@newpremglass.com', 'sales@newpremglass.com'],
      action: 'Email Us',
      link: 'mailto:info@newpremglass.com',
      color: '#c45a5a'
    },
    {
      icon: <FaClock />,
      title: 'Working Hours',
      details: ['Monday - Sunday', '9:00 AM - 9:00 PM'],
      action: 'Always Open',
      link: null,
      color: '#b1935c'
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

  const teamMembers = [
    { name: 'Prem Kumar', role: 'Founder & CEO', experience: '25+ Years', image: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Rajesh Sharma', role: 'Lead Designer', experience: '15+ Years', image: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Priya Singh', role: 'Project Manager', experience: '12+ Years', image: 'https://i.pravatar.cc/150?img=3' }
  ];

  // Animation variants - matching Home page
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const rotateIn = {
    hidden: { rotate: -10, opacity: 0, scale: 0.8 },
    visible: { 
      rotate: 0, 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
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
                "email": "info@newpremglass.com",
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

        /* Hero Section - WITH BACKGROUND IMAGE */
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
        }

        .contact-hero__bg img {
          width: 100%;
          height: 160%; /* 40% MORE HEIGHT FOR PC ONLY */
          object-fit: cover;
          object-position: center 25%; /* Adjusted to show more of the bottom part */
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
          transform: translateY(-85px); /* NEGATIVE VALUE - CONTENT UPAR AAYEGA */
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
          margin: 0 auto;
          line-height: 1.8;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        /* Mobile ke liye original height - NO CHANGE */
        @media (max-width: 768px) {
          .contact-hero-premium { 
            min-height: 70vh; 
            padding: 100px 0 80px; 
          }
          
          .contact-hero__bg img {
            height: 100%; /* Mobile pe original height */
            object-position: center;
          }
          
          .contact-hero__title { font-size: 2.5rem; }
        }

        @media (max-width: 480px) {
          .contact-hero-premium { 
            min-height: 60vh; 
            padding: 80px 0 60px; 
          }
          
          .contact-hero__bg img {
            height: 100%; /* Mobile pe original height */
            object-position: center;
          }
          
          .contact-hero__title { font-size: 2rem; }
        }

        /* Contact Info Cards - Premium Style */
        .contact-info-premium {
          padding: 100px 0 50px;
          position: relative;
          z-index: 5;
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
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.05);
          text-align: center;
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
          transition: transform 0.4s ease;
          transform-origin: left;
        }

        .info-card-premium:hover::before {
          transform: scaleX(1);
        }

        .info-card-premium:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-gold);
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
          transition: all 0.3s ease;
        }

        .info-card-premium:hover .info-icon-wrapper {
          background: var(--gold);
          color: var(--white);
          transform: rotateY(180deg);
        }

        .info-card-premium h3 {
          font-family: var(--serif);
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--dark);
        }

        .info-details {
          margin-bottom: 1.5rem;
        }

        .info-details p {
          color: var(--gray-text);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 0.3rem;
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
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .info-action:hover {
          background: var(--gold);
          color: var(--white);
          gap: 1rem;
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
        }

        .submit-btn span, .submit-btn svg {
          position: relative;
          z-index: 1;
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

        /* Team Section */
        .team-section {
          padding: 80px 0;
          background: var(--white);
          position: relative;
          overflow: hidden;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 3rem;
        }

        .team-card {
          background: var(--cream);
          border-radius: 24px;
          padding: 40px 30px;
          text-align: center;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.05);
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
          transform: translateY(-10px);
          box-shadow: var(--shadow-gold);
        }

        .team-image {
          width: 120px;
          height: 120px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid var(--gold);
          box-shadow: var(--shadow-md);
        }

        .team-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .team-card h4 {
          font-family: var(--serif);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--dark);
        }

        .team-role {
          color: var(--gold);
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .team-exp {
          color: var(--gray-text);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
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
          transition: all 0.3s ease;
        }

        .team-social a:hover {
          background: var(--gold);
          color: var(--white);
          transform: translateY(-3px);
        }

        /* Alert Messages */
        .alert-premium {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          animation: slideInDown 0.5s ease;
        }

        .alert-premium.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .alert-premium.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .alert-premium svg {
          font-size: 1.5rem;
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Social Proof Bar */
        .social-proof-bar {
          background: var(--dark);
          padding: 20px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
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
        }

        .proof-item svg {
          color: var(--gold);
          font-size: 1.2rem;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .info-grid-premium { grid-template-columns: repeat(2, 1fr); }
          .team-grid { grid-template-columns: repeat(2, 1fr); }
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
        }

        @media (max-width: 480px) {
          .form-container-premium { padding: 25px; }
          .info-card-premium { padding: 30px 20px; }
        }
      `}</style>

      {/* Hero Section - WITH BACKGROUND IMAGE */}
      <section className="contact-hero-premium" ref={heroRef}>
        <div className="contact-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"
            alt="Contact New Prem Glass House"
            style={{
              transform: `scale(1.05) translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
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
              <div className="contact-hero__badge">
                <FaStore /> Get in Touch
              </div>
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
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-premium" ref={infoRef}>
        <div className="container">
          <motion.div 
            className="mk-label"
            initial={{ opacity: 0 }}
            animate={isInfoInView ? { opacity: 1 } : {}}
            style={{ justifyContent: 'center', marginBottom: '1rem' }}
          >
            <div className="mk-label-line"></div>
            <span>REACH US</span>
            <div className="mk-label-line"></div>
          </motion.div>
          
          <motion.h2 className="mk-h2" style={{ textAlign: 'center' }}>
            Get in <em>Touch</em>
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
                variants={fadeInScale}
                whileHover={{ y: -10 }}
              >
                <div className="info-icon-wrapper" style={{ color: info.color }}>
                  {info.icon}
                </div>
                <h3>{info.title}</h3>
                <div className="info-details">
                  {info.details.map((detail, i) => (
                    <p key={i}>{detail}</p>
                  ))}
                </div>
                {info.link && (
                  <a href={info.link} className="info-action" target="_blank" rel="noopener noreferrer">
                    {info.action} <FaArrowRight />
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <div className="social-proof-bar">
        <div className="container">
          <div className="proof-items">
            <span className="proof-item"><FaCheckCircle /> {stats.projects} Projects Completed</span>
            <span className="proof-item"><FaUserTie /> {stats.designers} Expert Designers</span>
            <span className="proof-item"><FaHeadset /> {stats.response} Customer Support</span>
            <span className="proof-item"><FaRegClock /> Same Day Response</span>
          </div>
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
            >
              <div className="form-header">
                <div className="mk-label">
                  <div className="mk-label-line"></div>
                  <span>SEND MESSAGE</span>
                </div>
                <h3>Let's Discuss Your Project</h3>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div 
                    className="alert-premium success"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FaCheckCircle />
                    <span>Message sent successfully! We'll contact you soon.</span>
                  </motion.div>
                )}
                
                {error && (
                  <motion.div 
                    className="alert-premium error"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FaCheckCircle />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit}>
                <div className="form-group-premium">
                  <label className={activeField === 'name' ? 'active' : ''}>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setActiveField('name')}
                    onBlur={() => setActiveField(null)}
                    required
                  />
                  <div className="input-focus-line"></div>
                </div>

                <div className="form-group-premium">
                  <label className={activeField === 'email' ? 'active' : ''}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    required
                  />
                  <div className="input-focus-line"></div>
                </div>

                <div className="form-group-premium">
                  <label className={activeField === 'phone' ? 'active' : ''}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setActiveField('phone')}
                    onBlur={() => setActiveField(null)}
                    required
                  />
                  <div className="input-focus-line"></div>
                </div>

                <div className="form-group-premium">
                  <label className={activeField === 'service' ? 'active' : ''}>Service Interested In</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    onFocus={() => setActiveField('service')}
                    onBlur={() => setActiveField(null)}
                  >
                    {serviceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="input-focus-line"></div>
                </div>

                <div className="form-group-premium">
                  <label className={activeField === 'message' ? 'active' : ''}>Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setActiveField('message')}
                    onBlur={() => setActiveField(null)}
                    required
                  ></textarea>
                  <div className="input-focus-line"></div>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  {loading ? null : <FaRegPaperPlane />}
                </button>
              </form>
            </motion.div>

            <motion.div 
              className="map-container-premium"
              initial={{ opacity: 0, x: 50 }}
              animate={isFormInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="map-header">
                <h3>Visit Our Showroom</h3>
                <p>
                  <FaMapPin /> Bombay Chowk, Jharsuguda, Odisha - 768201
                </p>
              </div>
              <div className="map-frame">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.216895312!2d83.96562355!3d22.4594248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a202d2b1b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sJharsuguda%2C%20Odisha!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  title="Jharsuguda Map"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <motion.div 
            className="mk-label"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ justifyContent: 'center' }}
          >
            <div className="mk-label-line"></div>
            <span>OUR TEAM</span>
            <div className="mk-label-line"></div>
          </motion.div>
          
          <motion.h2 
            className="mk-h2" 
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
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
                variants={fadeInScale}
                whileHover={{ y: -10 }}
              >
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h4>{member.name}</h4>
                <div className="team-role">{member.role}</div>
                <div className="team-exp">{member.experience} Experience</div>
                <div className="team-social">
                  <a href="#"><FaFacebookF /></a>
                  <a href="#"><FaInstagram /></a>
                  <a href="#"><FaWhatsapp /></a>
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