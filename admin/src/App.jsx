// admin/src/App.jsx - UI SAME, SIRF REDIRECT FIXED
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Settings from './pages/Settings';

// API URL
const API_URL = 'http://api.newpremglasshouse.in/api';

// Set axios defaults
axios.defaults.baseURL = API_URL;

function App() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check URL parameters first (when redirected from login)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const userFromUrl = urlParams.get('user');

    if (tokenFromUrl && userFromUrl) {
      try {
        const userData = JSON.parse(decodeURIComponent(userFromUrl));
        // Save to localStorage
        localStorage.setItem('token', tokenFromUrl);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ Token and user saved from URL parameters');
        
        // Clean the URL (remove query parameters)
        window.history.replaceState({}, document.title, '/dashboard');
      } catch (e) {
        console.error('❌ Error parsing user data from URL:', e);
      }
    }

    const checkAdminStatus = async () => {
      try {
        // Get user data and extract token
        const userStr = localStorage.getItem('user');
        let token = null;
        let user = null;

        if (userStr) {
          try {
            user = JSON.parse(userStr);
            token = user.token; // Token is inside user object
            console.log('✅ Extracted token from user object');
          } catch (e) {
            console.error('Error parsing user data');
          }
        }

        // Also check other possible token locations
        if (!token) {
          token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        }

        console.log('🔍 Admin Panel Check:', { 
          hasToken: !!token, 
          hasUser: !!user,
          userRole: user?.role
        });

        // 🔴 IMPORTANT: Agar token nahi hai to seedha redirect
        if (!token || !user) {
          console.log('❌ No token or user data - redirecting to login');
          setIsAdmin(false);
          setLoading(false);
          window.location.href = 'https://newpremglasshouse.in/login';
          return;
        }

        // Check if role is admin
        if (user.role !== 'admin') {
          console.log('❌ User is not admin:', user.role);
          setIsAdmin(false);
          setLoading(false);
          window.location.href = 'https://newpremglasshouse.in/login';
          return;
        }

        // Set token in axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token with backend
        const response = await axios.get('/auth/profile');
        
        if (response.data.data.role === 'admin') {
          console.log('✅ Admin verified successfully');
          setIsAdmin(true);
        } else {
          console.log('❌ Backend verification failed');
          setIsAdmin(false);
          localStorage.removeItem('user');
          window.location.href = 'https://newpremglasshouse.in/login';
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        setIsAdmin(false);
        localStorage.removeItem('user');
        window.location.href = 'https://newpremglasshouse.in/login';
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading spinner
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f8f9fa'
      }}>
        <div className="spinner"></div>
        <style>{`
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #c9a96e;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Agar admin nahi hai to kuch mat dikhao (redirect already ho chuka hai)
  if (!isAdmin) {
    return null;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="app">
        {/* Sidebar - Mobile mein slide-in hoga */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
        
        {/* Main Content */}
        <div className="main-content">
          {/* Navbar with hamburger menu */}
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} isMobile={isMobile} />
          
          {/* Page Content */}
          <div className="content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </div>

      <style>{`
        .app {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          transition: margin-left 0.3s ease;
        }

        /* Desktop styles */
        @media (min-width: 769px) {
          .main-content {
            margin-left: 260px;
            width: calc(100% - 260px);
          }
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }

        .content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .content {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .content {
            padding: 0.75rem;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;