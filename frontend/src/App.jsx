// frontend/src/App.jsx - FIXED VERSION (WITH ROUTER CONFIGURATION)
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useState, useEffect, Suspense, lazy } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// Layout Components
import MainLayout from './components/layouts/MainLayout';

// Page Components (Lazy Loading)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Glass = lazy(() => import('./pages/Glass'));
const Hardware = lazy(() => import('./pages/Hardware'));
const Plywood = lazy(() => import('./pages/Plywood'));
const Interiors = lazy(() => import('./pages/Interior'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));

// AUTH PAGES
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Order = lazy(() => import('./pages/Order'));

// ✅ USER PAGES
const Profile = lazy(() => import('./pages/Profile'));
const MyOrders = lazy(() => import('./pages/MyOrders'));

import './styles/globals.css';
import './styles/animation.css';
import './styles/glassmorphism.css';

// ============= LOGOUT HANDLER COMPONENT =============
const LogoutHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Check for logout parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const logout = urlParams.get('logout');
    
    if (logout === 'true') {
      console.log('🚪 Logout parameter detected - clearing storage');
      
      // Clear all storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Remove the logout parameter from URL without reloading
      window.history.replaceState({}, document.title, '/');
      
      // Show logout message
      toast.success('Logged out from admin panel');
    }
  }, [location]);

  return null; // This component doesn't render anything
};

// ============= HELPER COMPONENT FOR CONDITIONAL NAVBAR & FOOTER =============
const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  
  // ✅ Sirf in pages par footer dikhega
  const mainPages = [
    '/',
    '/about',
    '/glass',
    '/hardware',
    '/plywood',
    '/interiors',
    '/contact'
  ];
  
  // Check if current path is in mainPages
  const isMainPage = mainPages.includes(location.pathname);

  return (
    <MainLayout showFooter={isMainPage}>
      {children}
    </MainLayout>
  );
};

// ============= AUTH LAYOUT - No Navbar/Footer for auth pages =============
const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
};

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
      
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid rgba(201, 169, 110, 0.1)',
        borderTop: '4px solid #c9a96e',
        borderRight: '4px solid #c9a96e',
        borderRadius: '50%',
        animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite'
      }} />
      
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

        <Helmet>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#c9a96e" />
          <title>New Prem Glass House - Premium Glass & Interior Solutions in Jharsuguda</title>
          <meta name="description" content="New Prem Glass House is Jharsuguda's premier destination for premium glass products, hardware, plywood, and modular interior design services." />
          <meta name="keywords" content="New Prem Glass House, Jharsuguda glass shop, interior designers Jharsuguda, hardware store Jharsuguda, plywood dealers Jharsuguda, modular kitchen Jharsuguda" />
        </Helmet>

        {/* Logout handler inside Router where toast works */}
        <LogoutHandler />

        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* ✅ MAIN PAGES - Footer dikhega */}
            <Route path="/" element={<ConditionalLayout><Home /></ConditionalLayout>} />
            <Route path="/about" element={<ConditionalLayout><About /></ConditionalLayout>} />
            <Route path="/contact" element={<ConditionalLayout><Contact /></ConditionalLayout>} />
            <Route path="/glass" element={<ConditionalLayout><Glass /></ConditionalLayout>} />
            <Route path="/hardware" element={<ConditionalLayout><Hardware /></ConditionalLayout>} />
            <Route path="/plywood" element={<ConditionalLayout><Plywood /></ConditionalLayout>} />
            <Route path="/interiors" element={<ConditionalLayout><Interiors /></ConditionalLayout>} />
            
            {/* 🛒 Cart & Order - Footer nahi dikhega */}
            <Route path="/cart" element={<MainLayout showFooter={false}><Cart /></MainLayout>} />
            <Route path="/order" element={<MainLayout showFooter={false}><Order /></MainLayout>} />
            
            {/* 👤 USER PAGES - Footer nahi dikhega */}
            <Route path="/profile" element={<MainLayout showFooter={false}><Profile /></MainLayout>} />
            <Route path="/my-orders" element={<MainLayout showFooter={false}><MyOrders /></MainLayout>} />
            
            {/* 🔐 AUTH PAGES - No Layout (clean auth pages) */}
            <Route path="/login" element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            <Route path="/register" element={
              <AuthLayout>
                <Register />
              </AuthLayout>
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