// src/pages/Profile.jsx - USER PROFILE PAGE
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaShoppingBag,
  FaCalendarAlt,
  FaArrowRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import userService from '../services/userService';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || {
          street: '',
          city: '',
          state: '',
          pincode: ''
        }
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update user via API
      const response = await userService.update(user.id, formData);
      
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully');
      setEditing(false);
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || {
        street: '',
        city: '',
        state: '',
        pincode: ''
      }
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 1rem;
          }
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

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0) || <FaUser />}
          </div>
          <h1>My Profile</h1>
          {!editing && (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label><FaUser /> Full Name</label>
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
              <label><FaEnvelope /> Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled
                className="disabled"
              />
              <small className="field-note">Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label><FaPhone /> Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <h2>Address Details</h2>

            <div className="form-group">
              <label><FaMapMarkerAlt /> Street Address</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="House no., Building, Street"
                required
              />
            </div>

            <div className="address-row">
              <div className="form-group">
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="address.state"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="address.pincode"
                  placeholder="Pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-card">
              <h3>Personal Information</h3>
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{user?.name || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{user?.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="info-card">
              <h3>Address</h3>
              {user?.address?.street || user?.address?.city ? (
                <>
                  <div className="info-row">
                    <span className="info-label">Street:</span>
                    <span className="info-value">{user.address.street || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">City:</span>
                    <span className="info-value">{user.address.city || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">State:</span>
                    <span className="info-value">{user.address.state || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Pincode:</span>
                    <span className="info-value">{user.address.pincode || 'Not provided'}</span>
                  </div>
                </>
              ) : (
                <p className="no-data">No address provided</p>
              )}
            </div>

            <div className="info-card">
              <h3>Account Statistics</h3>
              <div className="info-row">
                <span className="info-label">Member since:</span>
                <span className="info-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Total orders:</span>
                <span className="info-value">{user?.orderCount || 0}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Total spent:</span>
                <span className="info-value">₹{user?.totalSpent || 0}</span>
              </div>
            </div>

            <div className="quick-actions">
              <button 
                className="action-btn"
                onClick={() => navigate('/my-orders')}
              >
                <FaShoppingBag /> View My Orders <FaArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-page {
          min-height: calc(100vh - 200px);
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8f5f0 0%, #f2ede4 100%);
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 3rem;
          font-weight: 600;
          box-shadow: 0 10px 20px rgba(201, 169, 110, 0.3);
          border: 4px solid white;
        }

        .profile-header h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .edit-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 2rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(201, 169, 110, 0.2);
        }

        .edit-btn:hover {
          background: #b08e5e;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(201, 169, 110, 0.3);
        }

        .profile-form {
          background: white;
          border-radius: 30px;
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .profile-form h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          color: #c9a96e;
          margin: 2rem 0 1rem;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 0.5rem;
        }

        .profile-form h2:first-of-type {
          margin-top: 0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #555;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group label svg {
          color: #c9a96e;
        }

        .form-group input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #eee;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.1);
        }

        .form-group input.disabled {
          background: #f8f9fa;
          cursor: not-allowed;
          color: #666;
        }

        .field-note {
          display: block;
          font-size: 0.8rem;
          color: #999;
          margin-top: 0.3rem;
        }

        .address-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .save-btn, .cancel-btn {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn {
          background: #28a745;
          color: white;
        }

        .save-btn:hover {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cancel-btn {
          background: #dc3545;
          color: white;
        }

        .cancel-btn:hover {
          background: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
        }

        .profile-info {
          display: grid;
          gap: 2rem;
        }

        .info-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(201, 169, 110, 0.1);
        }

        .info-card h3 {
          color: #c9a96e;
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 0.5rem;
        }

        .info-row {
          display: flex;
          padding: 0.8rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          width: 120px;
          color: #666;
          font-weight: 500;
        }

        .info-value {
          flex: 1;
          color: #333;
          font-weight: 400;
        }

        .no-data {
          color: #999;
          font-style: italic;
          text-align: center;
          padding: 1rem;
        }

        .quick-actions {
          margin-top: 1rem;
        }

        .action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 2rem;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: white;
          border: none;
          border-radius: 15px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(201, 169, 110, 0.4);
        }

        .action-btn svg:last-child {
          transition: transform 0.3s ease;
        }

        .action-btn:hover svg:last-child {
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .profile-form {
            padding: 2rem;
          }

          .address-row {
            grid-template-columns: 1fr;
          }

          .info-row {
            flex-direction: column;
            gap: 0.3rem;
          }

          .info-label {
            width: auto;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .profile-header h1 {
            font-size: 2rem;
          }

          .profile-avatar {
            width: 80px;
            height: 80px;
            font-size: 2.5rem;
          }

          .info-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Profile;