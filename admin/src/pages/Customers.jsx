import { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import customerService from '../services/customerService';
import { formatDate, formatCurrency } from '../utils/helpers';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    new: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchCustomers();
    
    const handleCustomerUpdate = () => {
      fetchCustomers();
    };
    
    window.addEventListener('customerUpdated', handleCustomerUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'customers' || e.key === null) {
        fetchCustomers();
      }
    });
    
    return () => {
      window.removeEventListener('customerUpdated', handleCustomerUpdate);
      window.removeEventListener('storage', handleCustomerUpdate);
    };
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.getAll();
      const customersData = response.data || [];
      setCustomers(customersData);
      
      // Calculate stats
      const stats = {
        total: customersData.length,
        active: customersData.filter(c => c.status === 'active').length,
        new: customersData.filter(c => {
          const days = (new Date() - new Date(c.createdAt)) / (1000 * 60 * 60 * 24);
          return days < 30;
        }).length,
        totalSpent: customersData.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
      };
      setStats(stats);
      
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);
    
    const matchesCity = selectedCity === 'all' || customer.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  const cities = [...new Set(customers.map(c => c.city).filter(Boolean))];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1>Customer Management</h1>
        <button className="btn-primary">
          <FaUserPlus /> Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Active Customers</h3>
          <p className="stat-value">{stats.active}</p>
        </div>
        <div className="stat-card">
          <h3>New This Month</h3>
          <p className="stat-value">{stats.new}</p>
        </div>
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p className="stat-value">{formatCurrency(stats.totalSpent)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {cities.length > 0 && (
          <div className="filter-group">
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Customers Grid */}
      <div className="customers-grid">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="customer-card">
            <div className="card-header">
              <div className="customer-avatar">
                {customer.name?.charAt(0).toUpperCase()}
              </div>
              <div className="customer-info">
                <h3>{customer.name}</h3>
                <p className="customer-since">Customer since {formatDate(customer.createdAt)}</p>
              </div>
              <span className={`status-badge ${customer.status}`}>
                {customer.status || 'active'}
              </span>
            </div>

            <div className="card-body">
              <div className="contact-info">
                <div className="info-item">
                  <FaEnvelope />
                  <a href={`mailto:${customer.email}`}>{customer.email}</a>
                </div>
                <div className="info-item">
                  <FaPhone />
                  <a href={`tel:${customer.phone}`}>{customer.phone}</a>
                </div>
                {customer.address && (
                  <div className="info-item">
                    <FaMapMarkerAlt />
                    <span>{customer.address}, {customer.city} - {customer.pincode}</span>
                  </div>
                )}
              </div>

              <div className="stats-row">
                <div className="stat">
                  <span className="stat-label">Orders</span>
                  <span className="stat-number">{customer.orders || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total Spent</span>
                  <span className="stat-number">{formatCurrency(customer.totalSpent || 0)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Last Order</span>
                  <span className="stat-number">{customer.lastOrder ? formatDate(customer.lastOrder) : 'Never'}</span>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <button className="btn-view" onClick={() => window.location.href = `/customers/${customer.id}`}>
                <FaEye /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .customers-page {
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .stat-card h3 {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 600;
          color: #111;
        }

        .filters-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 0 1rem;
        }

        .search-box svg {
          color: #999;
          margin-right: 0.5rem;
        }

        .search-box input {
          flex: 1;
          padding: 0.75rem 0;
          border: none;
          outline: none;
        }

        .filter-group select {
          padding: 0.75rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
        }

        .customers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .customer-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .customer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(201,169,110,0.2);
        }

        .card-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8f9fa, #ffffff);
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .customer-avatar {
          width: 50px;
          height: 50px;
          background: #c9a96e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .customer-info {
          flex: 1;
        }

        .customer-info h3 {
          font-size: 1.1rem;
          margin-bottom: 0.2rem;
        }

        .customer-since {
          font-size: 0.8rem;
          color: #999;
        }

        .status-badge {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .card-body {
          padding: 1.5rem;
        }

        .contact-info {
          margin-bottom: 1.5rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        .info-item svg {
          color: #c9a96e;
        }

        .info-item a {
          color: #666;
          text-decoration: none;
        }

        .info-item a:hover {
          color: #c9a96e;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 0.2rem;
        }

        .stat-number {
          font-size: 1.1rem;
          font-weight: 600;
          color: #111;
        }

        .card-footer {
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-top: 1px solid #f0f0f0;
        }

        .btn-view {
          width: 100%;
          padding: 0.5rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-view:hover {
          background: #b08e5e;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-bar {
            flex-direction: column;
          }

          .customers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Customers;