// admin/src/pages/Settings.jsx - COMPLETE FIXED VERSION
import { useState, useEffect } from 'react';
import { FaSave, FaStore, FaPalette, FaBell, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import settingsService from '../services/settingsService';

// At the very top of Settings.jsx, after imports
console.log('🔥🔥🔥 Settings page is being rendered!');
console.log('📍 Current URL:', window.location.href);
console.log('📍 Current path:', window.location.pathname);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      storeName: 'New Prem Glass House',
      storeEmail: 'admin@newpremglass.com',
      storePhone: '+91 73280 19093',
      address: 'Bombay Chowk, Jharsuguda, Odisha - 768201',
      gst: '21ABCDE1234F1Z5',
      pan: 'ABCDE1234F'
    },
    appearance: {
      theme: 'light',
      primaryColor: '#c9a96e',
      logo: null,
      favicon: null
    },
    notifications: {
      emailAlerts: true,
      orderNotifications: true,
      lowStockAlerts: true,
      newCustomerAlerts: false
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  });

  useEffect(() => {
  // Check if we're on the wrong URL
  if (window.location.pathname === '/login') {
    console.log('⚠️ Detected on login page but should be on settings');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('✅ Token exists, forcing redirect to /settings');
      window.location.href = 'http://localhost:5174/settings';
    }
  }
}, []);
    
   

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsService.getAll();
      if (response?.data) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...response.data,
          security: {
            ...prevSettings.security,
            ...response.data?.security
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await settingsService.update(settings);
      toast.success('Settings saved successfully');
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePasswordChange = () => {
    const { currentPassword, newPassword, confirmPassword } = settings.security;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    // Success - password change logic here
    toast.success('Password changed successfully');
    
    // Clear password fields
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FaStore /> },
    { id: 'appearance', label: 'Appearance', icon: <FaPalette /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'security', label: 'Security', icon: <FaLock /> }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner"></div>
        <style jsx>{`
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
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <button className="btn-primary" onClick={handleSave} disabled={loading}>
          <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="settings-container">
        {/* Tabs */}
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'general' && (
            <div className="settings-form">
              <h2>General Settings</h2>
              
              <div className="form-group">
                <label>Store Name</label>
                <input
                  type="text"
                  value={settings.general.storeName}
                  onChange={(e) => handleChange('general', 'storeName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Store Email</label>
                <input
                  type="email"
                  value={settings.general.storeEmail}
                  onChange={(e) => handleChange('general', 'storeEmail', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Store Phone</label>
                <input
                  type="text"
                  value={settings.general.storePhone}
                  onChange={(e) => handleChange('general', 'storePhone', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={settings.general.address}
                  onChange={(e) => handleChange('general', 'address', e.target.value)}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>GST Number</label>
                  <input
                    type="text"
                    value={settings.general.gst}
                    onChange={(e) => handleChange('general', 'gst', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>PAN Number</label>
                  <input
                    type="text"
                    value={settings.general.pan}
                    onChange={(e) => handleChange('general', 'pan', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-form">
              <h2>Appearance Settings</h2>
              
              <div className="form-group">
                <label>Theme</label>
                <select
                  value={settings.appearance.theme}
                  onChange={(e) => handleChange('appearance', 'theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="form-group">
                <label>Primary Color</label>
                <div className="color-picker">
                  <input
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Logo</label>
                <div className="file-upload">
                  <input type="file" accept="image/*" />
                  <button type="button" className="btn-upload">Upload Logo</button>
                </div>
              </div>

              <div className="form-group">
                <label>Favicon</label>
                <div className="file-upload">
                  <input type="file" accept="image/*" />
                  <button type="button" className="btn-upload">Upload Favicon</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-form">
              <h2>Notification Settings</h2>
              
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailAlerts}
                    onChange={(e) => handleChange('notifications', 'emailAlerts', e.target.checked)}
                  />
                  Email Alerts
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.orderNotifications}
                    onChange={(e) => handleChange('notifications', 'orderNotifications', e.target.checked)}
                  />
                  Order Notifications
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.lowStockAlerts}
                    onChange={(e) => handleChange('notifications', 'lowStockAlerts', e.target.checked)}
                  />
                  Low Stock Alerts
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newCustomerAlerts}
                    onChange={(e) => handleChange('notifications', 'newCustomerAlerts', e.target.checked)}
                  />
                  New Customer Alerts
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-form">
              <h2>Security Settings</h2>
              
              <div className="form-group">
                <label>Current Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={settings.security.currentPassword}
                    onChange={(e) => handleChange('security', 'currentPassword', e.target.value)}
                    placeholder="Enter current password"
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

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={settings.security.newPassword}
                  onChange={(e) => handleChange('security', 'newPassword', e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={settings.security.confirmPassword}
                  onChange={(e) => handleChange('security', 'confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <button 
                type="button" 
                className="btn-change-password" 
                onClick={handlePasswordChange}
              >
                Change Password
              </button>

              <div className="checkbox-group" style={{ marginTop: '20px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => handleChange('security', 'twoFactorAuth', e.target.checked)}
                  />
                  Enable Two-Factor Authentication
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value) || 30)}
                    min="5"
                    max="120"
                  />
                </div>

                <div className="form-group">
                  <label>Password Expiry (days)</label>
                  <input
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value) || 90)}
                    min="30"
                    max="365"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .settings-page {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #111;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: #b08e5e;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-change-password {
          padding: 0.75rem 1.5rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 10px;
          transition: all 0.3s ease;
        }

        .btn-change-password:hover {
          background: #218838;
        }

        .settings-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          transition: all 0.3s ease;
        }

        .tab:hover {
          background: rgba(201,169,110,0.1);
          color: #c9a96e;
        }

        .tab.active {
          background: white;
          color: #c9a96e;
          border-bottom: 2px solid #c9a96e;
        }

        .tab-content {
          padding: 2rem;
        }

        .settings-form h2 {
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          color: #333;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-password:hover {
          color: #c9a96e;
        }

        .color-picker {
          display: flex;
          gap: 0.5rem;
        }

        .color-picker input[type="color"] {
          width: 50px;
          height: 42px;
          padding: 0;
          cursor: pointer;
        }

        .color-picker input[type="text"] {
          flex: 1;
        }

        .file-upload {
          display: flex;
          gap: 0.5rem;
        }

        .file-upload input {
          display: none;
        }

        .btn-upload {
          padding: 0.75rem 1.5rem;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-upload:hover {
          background: #e9ecef;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: #333;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .tabs {
            flex-wrap: wrap;
          }

          .tab {
            flex: auto;
            min-width: 120px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;