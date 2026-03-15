// admin/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      
      if (response.success) {
        toast.success('Login successful');
        setIsAuthenticated(true);
        navigate('/');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="logo">
            <span className="logo-main">NP</span>
            <span className="logo-sub">Admin Panel</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@newpremglass.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Credentials:</p>
          <p className="demo-creds">
            Email: admin@newpremglass.com<br />
            Password: admin123
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .login-box {
          background: white;
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .logo-main {
          font-size: 2.5rem;
          font-weight: bold;
          color: #c9a96e;
        }

        .logo-sub {
          font-size: 0.9rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .login-header h2 {
          color: #333;
          margin-bottom: 10px;
        }

        .login-header p {
          color: #666;
          font-size: 0.9rem;
        }

        .login-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: #555;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-group label svg {
          color: #c9a96e;
        }

        .form-group input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.1);
        }

        .form-group input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .password-input {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 5px;
        }

        .toggle-password:hover {
          color: #c9a96e;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #666;
          font-size: 0.9rem;
        }

        .checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .forgot-link {
          color: #c9a96e;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(201,169,110,0.3);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #999;
          font-size: 0.85rem;
        }

        .demo-creds {
          margin-top: 5px;
          color: #666;
          font-size: 0.8rem;
          background: #f8f9fa;
          padding: 8px;
          border-radius: 6px;
        }

        @media (max-width: 480px) {
          .login-box {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;