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
const API_URL = 'http://localhost:5000/api';

// Set axios defaults
axios.defaults.baseURL = API_URL;

function App() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // If no token or user data, not admin
        if (!token || !user) {
          console.log('❌ No token or user data');
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Check if role is admin
        if (user.role !== 'admin') {
          console.log('❌ User is not admin:', user.role);
          setIsAdmin(false);
          setLoading(false);
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
          // Clear invalid data
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        setIsAdmin(false);
        // Clear invalid data on error
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

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

  // Agar user admin nahi hai, toh FRONTEND LOGIN PAGE PE REDIRECT
  if (!isAdmin) {
    console.log('🚫 Not admin, redirecting to frontend login...');
    // 🔴 FRONTEND LOGIN PAGE PE REDIRECT
    window.location.href = 'http://localhost:5173/login';
    return null; // Don't render anything while redirecting
  }

  console.log('🔍 All routes available:');
console.log('- /dashboard');
console.log('- /products');
console.log('- /categories');
console.log('- /orders');
console.log('- /users');
console.log('- /settings');

  // Admin is verified, show the panel
  return (
    <Router>
      <Toaster position="top-right" />
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '260px' }}>
          <Navbar />
          <div style={{ padding: '2rem' }}>
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
    </Router>
  );
}

export default App;