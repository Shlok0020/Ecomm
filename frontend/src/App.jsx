// src/App.jsx - CORRECTED IMPORTS
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useState, useEffect, Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';

// Layout Components - FIXED PATHS
import MainLayout from './components/layouts/MainLayout';
import Navbar from './components/common/Navbar'; // ✅ YEH SAHI HAI - NAVBAR.jsx EXIST KARTA HAI
import Footer from './components/common/Footer'; // ✅ YEH SAHI HAI - FOOTER.jsx EXIST KARTA HAI

// Page Components (Lazy Loading)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Glass = lazy(() => import('./pages/Glass'));
const Hardware = lazy(() => import('./pages/Hardware'));
const Plywood = lazy(() => import('./pages/Plywood'));
const Interiors = lazy(() => import('./pages/Interior'));
const Contact = lazy(() => import('./pages/Contact'));

// import './styles/variable.css';        // ✅直接从src/styles folder
import './styles/globals.css';           // ✅直接从src/styles folder
import './styles/animation.css';        // ✅直接从src/styles folder
import './styles/glassmorphism.css'; 

// ============= LOADING COMPONENT =============
const AppLoadingScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #f8f5f0 0%, #f2ede4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px',
      zIndex: 9999
    }}>
      {/* New Prem Logo/Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #c9a96e 0%, #a07840 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
        boxShadow: '0 20px 40px rgba(201, 169, 110, 0.3)',
        marginBottom: '20px'
      }}>
        NP
      </div>
      
      {/* Animated Loader */}
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid rgba(201, 169, 110, 0.1)',
        borderTop: '4px solid #c9a96e',
        borderRight: '4px solid #c9a96e',
        borderRadius: '50%',
        animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite'
      }} />
      
      {/* Loading Text */}
      <p style={{
        fontFamily: 'Jost, sans-serif',
        color: '#666',
        fontSize: '0.9rem',
        letterSpacing: '2px',
        marginTop: '20px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}>
        NEW PREM GLASS HOUSE
      </p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ============= PAGE LOADING COMPONENT =============
const PageLoading = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      background: '#f8f5f0'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #c9a96e',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  );
};

// ============= MAIN APP COMPONENT =============
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate minimal loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AppLoadingScreen />;
  }

  return (
    <HelmetProvider>
      <Router>
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              fontFamily: 'Jost, sans-serif',
              borderRadius: '10px',
              padding: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            },
            success: {
              iconTheme: {
                primary: '#c9a96e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Global Helmet - Default SEO */}
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#c9a96e" />
          
          {/* Default Title */}
          <title>New Prem Glass House - Premium Glass & Interior Solutions in Jharsuguda</title>
          
          {/* Default Description */}
          <meta name="description" content="New Prem Glass House is Jharsuguda's premier destination for premium glass products, hardware, plywood, and modular interior design services. Serving since 2014 with 5000+ happy customers." />
          <meta name="keywords" content="New Prem Glass House, Jharsuguda glass shop, interior designers Jharsuguda, hardware store Jharsuguda, plywood dealers Jharsuguda, modular kitchen Jharsuguda, glass products Odisha, Bombay Chowk Jharsuguda" />
        </Helmet>

        {/* Routes */}
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <MainLayout>
                <Home />
              </MainLayout>
            } />
            
            <Route path="/about" element={
              <MainLayout>
                <About />
              </MainLayout>
            } />
            
            <Route path="/contact" element={
              <MainLayout>
                <Contact />
              </MainLayout>
            } />
            
            <Route path="/glass" element={
              <MainLayout>
                <Glass />
              </MainLayout>
            } />
            
            <Route path="/hardware" element={
              <MainLayout>
                <Hardware />
              </MainLayout>
            } />
            
            <Route path="/plywood" element={
              <MainLayout>
                <Plywood />
              </MainLayout>
            } />
            
            <Route path="/interiors" element={
              <MainLayout>
                <Interiors />
              </MainLayout>
            } />
            
            {/* Redirects */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;