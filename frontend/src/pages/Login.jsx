// frontend/src/pages/Login.jsx - SIRF CSS CHANGED
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectProduct, setRedirectProduct] = useState(null);

  useEffect(() => {
    if (location.state?.product) {
      setRedirectProduct(location.state.product);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Logging in with:', formData.email);
      
      const response = await authAPI.login(formData);
      console.log('Login response:', response);
      
      let userData;
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        userData = response.data;
      } else if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        userData = response;
      }
      
      toast.success('Login successful!');
      
      // ✅ FIXED: Redirect based on role
      if (userData.role === 'admin') {
        console.log('👑 Admin login - redirecting to admin panel with token');
        // Pass token and user data via URL parameters
        const userParam = encodeURIComponent(JSON.stringify(userData));
        window.location.href = `https://newpremglasshouse.in/dashboard?token=${userData.token}&user=${userParam}`;
      } else {
        console.log('👤 User login - redirecting to homepage');
        
        // ✅ FORCE FULL PAGE RELOAD for user login
        if (redirectProduct) {
          // If there's a product to redirect to, use navigate with state
          navigate('/order', { state: { product: redirectProduct } });
        } else {
          // Force full page reload to ensure Navbar updates
          window.location.href = '/';
        }
      }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="auth-page"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Login to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock /> Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="auth-submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Logging in...' : 'Login'} <FaArrowRight />
            </motion.button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;  /* 🔴 CHANGED: calc(100vh - 200px) → 100vh */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f8f5f0 0%, #f2ede4 100%);
        }
        /* 🔴 ADDED: Hide navbar globally */
        :global(.navbar), 
        :global(header), 
        :global(nav) {
          display: none !important;
        }
        .auth-container {
          width: 100%;
          max-width: 450px;
        }
        .auth-card {
          background: white;
          border-radius: 30px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-header h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }
        .auth-header p {
          color: #666;
          font-size: 0.95rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #555;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .form-group label svg {
          color: #c9a96e;
        }
        .form-group input {
          padding: 1rem;
          border: 2px solid #eee;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .form-group input:focus {
          outline: none;
          border-color: #c9a96e;
        }
        .form-group input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
        .password-input {
          position: relative;
        }
        .password-input input {
          width: 100%;
          padding-right: 50px;
        }
        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 1.2rem;
        }
        .password-toggle:hover:not(:disabled) {
          color: #c9a96e;
        }
        .password-toggle:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .auth-submit {
          background: #c9a96e;
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 1rem;
        }
        .auth-submit:hover:not(:disabled) {
          background: #b38b4a;
        }
        .auth-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #eee;
        }
        .auth-footer a {
          color: #c9a96e;
          text-decoration: none;
          font-weight: 600;
        }
        .auth-footer a:hover {
          text-decoration: underline;
        }
        @media (max-width: 480px) {
          .auth-card {
            padding: 2rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Login;