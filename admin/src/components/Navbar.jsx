// admin/src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
  }, []);

  const handleLogout = () => {
    console.log('🚪 Logging out from admin panel...');
    
    // Clear admin panel storage
    localStorage.clear();
    sessionStorage.clear();
    
    // ✅ Redirect to main site with logout parameter
    window.location.href = 'http://localhost:5173?logout=true';
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          <FaBell />
          <span className="badge">3</span>
        </button>

        <div className="user-menu">
          <button 
            className="user-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="user-name">{user?.name || 'Admin'}</span>
          </button>

          {showDropdown && (
            <div className="dropdown">
              <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                <FaUser /> Profile
              </Link>
              <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                <FaCog /> Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          height: 70px;
          background: white;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 90;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          width: 300px;
        }
        .search-icon {
          color: #999;
          margin-right: 0.5rem;
        }
        .search-box input {
          border: none;
          background: none;
          outline: none;
          width: 100%;
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .notification-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          color: #666;
        }
        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #c9a96e;
          color: white;
          font-size: 0.7rem;
          padding: 0.1rem 0.3rem;
          border-radius: 50%;
        }
        .user-menu {
          position: relative;
        }
        .user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.3rem 0.5rem;
          border-radius: 8px;
        }
        .user-btn:hover {
          background: #f5f5f5;
        }
        .user-avatar {
          width: 35px;
          height: 35px;
          background: #c9a96e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        .user-name {
          font-weight: 500;
          color: #333;
        }
        .dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: 180px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1rem;
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.9rem;
          text-align: left;
        }
        .dropdown-item:hover {
          background: #f5f5f5;
        }
        .logout-btn {
          color: #ef4444;
        }
        .logout-btn:hover {
          background: #fee2e2;
        }
        .dropdown-divider {
          height: 1px;
          background: #e0e0e0;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default Navbar;