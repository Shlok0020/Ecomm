import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
// ✅ YEH LINE ADD KARO
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectProduct, setRedirectProduct] = useState(null);

  useEffect(() => {
    if (location.state?.product) {
      setRedirectProduct(location.state.product);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ✅ SIRF YEH FUNCTION CHANGE KARO (handleSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // ✅ YEH LINE CHANGE KARO - Actual API call
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      });
      
      toast.success('Registration successful!');
      
      // Redirect to order page if product exists
      if (redirectProduct) {
        navigate('/order', { state: { product: redirectProduct } });
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
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
            <h1>Create Account</h1>
            <p>Register to start ordering</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>
                <FaUser /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

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
              />
            </div>

            <div className="form-group">
              <label>
                <FaPhone /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
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
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                <FaLock /> Confirm Password
              </label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                <FaMapMarkerAlt /> Street Address
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Enter street address"
                required
              />
            </div>

            <div className="address-row">
              <div className="form-group">
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="auth-submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Creating account...' : 'Register'} <FaArrowRight />
            </motion.button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" state={{ product: redirectProduct }}>Login here</Link></p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f8f5f0 0%, #f2ede4 100%);
        }

        .auth-container {
          width: 100%;
          max-width: 500px;
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
          color: var(--dark);
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: #666;
          font-size: 0.95rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
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
          color: var(--gold);
        }

        .form-group input {
          padding: 0.8rem;
          border: 2px solid #eee;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--gold);
        }

        .password-input {
          position: relative;
        }

        .password-input input {
          width: 100%;
          padding-right: 45px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 1.1rem;
        }

        .password-toggle:hover {
          color: var(--gold);
        }

        .address-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.8rem;
        }

        .auth-submit {
          background: var(--gold);
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

        .auth-submit:hover {
          background: var(--gold-dark);
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
          color: var(--gold);
          text-decoration: none;
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .address-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
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

export default Register;