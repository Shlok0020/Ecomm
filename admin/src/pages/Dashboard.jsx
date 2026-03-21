import { useState, useEffect } from 'react';
import { 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaDollarSign,
  FaEye,
  FaStar,
  FaClock,
  FaArrowDown,
  FaSync,
  FaBell,
  FaExclamationTriangle,
  FaDownload,
  FaFilter
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import StatsCard from '../components/StatsCard';
import ChartCard from '../components/ChartCard';
import dashboardService from '../services/dashboardService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStock: 0,
    todayOrders: 0,
    monthlyRevenue: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventorySummary, setInventorySummary] = useState(null);
  const [customerInsights, setCustomerInsights] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAlerts, setShowAlerts] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const COLORS = ['#c9a96e', '#bd7b4d', '#4f8a8b', '#c45a5a', '#6c757d', '#28a745'];

  useEffect(() => {
    loadDashboardData();
    
    const unsubscribe = dashboardService.subscribeToUpdates((update) => {
      console.log('Real-time update:', update);
      loadDashboardData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    loadChartData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        statsResponse,
        activitiesResponse,
        topProductsResponse,
        inventoryResponse,
        customerResponse
      ] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(10),
        dashboardService.getTopProducts(5),
        dashboardService.getInventorySummary(),
        dashboardService.getCustomerInsights()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (activitiesResponse.success) {
        setRecentActivities(activitiesResponse.data);
      }

      if (topProductsResponse.success) {
        setTopProducts(topProductsResponse.data);
      }

      if (inventoryResponse.success) {
        setInventorySummary(inventoryResponse.data);
      }

      if (customerResponse.success) {
        setCustomerInsights(customerResponse.data);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadChartData = async () => {
    try {
      const response = await dashboardService.getChartData(selectedPeriod);
      if (response.success) {
        setSalesData(response.data.sales);
        setCategoryData(response.data.categories);
        setStatusData(response.data.status);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
    loadChartData();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'order': return '🛒';
      case 'product': return '📦';
      case 'user': return '👤';
      default: return '📌';
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({
      stats,
      recentActivities,
      salesData,
      topProducts,
      inventorySummary,
      customerInsights
    }, null, 2);
    
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Dashboard data exported successfully!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="page-title">Dashboard</h1>
          <span className="date-badge">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
        <div className="header-actions">
          <button 
            className={`alert-btn ${stats.lowStock > 0 ? 'has-alerts' : ''}`}
            onClick={() => setShowAlerts(!showAlerts)}
          >
            <FaBell />
            {stats.lowStock > 0 && <span className="alert-badge">{stats.lowStock}</span>}
          </button>
          <button className="export-btn" onClick={exportData}>
            <FaDownload />
            <span className="export-text">Export</span>
          </button>
          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`} 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FaSync className={refreshing ? 'spin' : ''} />
            <span className="refresh-text">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Alert Panel */}
      {showAlerts && (
        <div className="alert-panel">
          <h3><FaExclamationTriangle /> Alerts & Notifications</h3>
          <div className="alert-list">
            {stats.lowStock > 0 && (
              <div className="alert-item warning">
                <span>⚠️ {stats.lowStock} products are running low on stock</span>
              </div>
            )}
            {stats.pendingOrders > 0 && (
              <div className="alert-item info">
                <span>📦 {stats.pendingOrders} orders are pending processing</span>
              </div>
            )}
            {inventorySummary?.outOfStock > 0 && (
              <div className="alert-item danger">
                <span>❌ {inventorySummary.outOfStock} products are out of stock</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Tab Navigation */}
      <div className="mobile-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={activeTab === 'activities' ? 'active' : ''}
          onClick={() => setActiveTab('activities')}
        >
          Activities
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<FaBox />}
          color="#c9a96e"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingCart />}
          color="#bd7b4d"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<FaUsers />}
          color="#4f8a8b"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<FaDollarSign />}
          color="#c45a5a"
        />
      </div>

      {/* Secondary Stats */}
      <div className="stats-row">
        <div className="stat-item">
          <FaClock />
          <div>
            <span className="stat-label">Pending Orders</span>
            <span className="stat-value">{stats.pendingOrders}</span>
          </div>
        </div>
        <div className="stat-item">
          <FaEye />
          <div>
            <span className="stat-label">Today's Orders</span>
            <span className="stat-value">{stats.todayOrders}</span>
          </div>
        </div>
        <div className="stat-item">
          <FaStar />
          <div>
            <span className="stat-label">Monthly Revenue</span>
            <span className="stat-value">₹{stats.monthlyRevenue.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-item warning">
          <FaArrowDown />
          <div>
            <span className="stat-label">Low Stock</span>
            <span className="stat-value">{stats.lowStock}</span>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="period-selector-wrapper">
        <div className="period-selector">
          <button 
            className={selectedPeriod === 'week' ? 'active' : ''}
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </button>
          <button 
            className={selectedPeriod === 'month' ? 'active' : ''}
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </button>
          <button 
            className={selectedPeriod === 'year' ? 'active' : ''}
            onClick={() => setSelectedPeriod('year')}
          >
            Year
          </button>
        </div>
        <button className="filter-btn">
          <FaFilter />
        </button>
      </div>

      {/* Content Sections */}
      <div className={`content-section ${activeTab === 'overview' || activeTab === 'analytics' ? 'active' : ''}`}>
        {/* Charts Row */}
        <div className="charts-row">
          <ChartCard title="Sales Overview">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="sales" stroke="#c9a96e" strokeWidth={2} name="Sales (₹)" />
                <Line type="monotone" dataKey="orders" stroke="#4f8a8b" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Products by Category">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => window.innerWidth > 768 ? `${entry.name}: ${entry.value}` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Second Row - Additional Charts */}
        <div className="charts-row">
          <ChartCard title="Order Status">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => window.innerWidth > 768 ? `${entry.name}: ${entry.value}` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Products">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                <YAxis yAxisId="left" orientation="left" stroke="#c9a96e" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar yAxisId="left" dataKey="sold" fill="#c9a96e" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Insights Grid */}
        <div className="insights-grid-container">
          {customerInsights && (
            <div className="insights-card">
              <h2>Customer Insights</h2>
              <div className="insights-grid">
                <div className="insight-item">
                  <span className="insight-label">Total Customers</span>
                  <span className="insight-value">{customerInsights.totalCustomers}</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">New This Month</span>
                  <span className="insight-value">{customerInsights.newCustomers}</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Active Customers</span>
                  <span className="insight-value">{customerInsights.activeCustomers}</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Avg Order Value</span>
                  <span className="insight-value">₹{customerInsights.avgOrderValue?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {inventorySummary && (
            <div className="insights-card">
              <h2>Inventory Summary</h2>
              <div className="insights-grid">
                <div className="insight-item">
                  <span className="insight-label">In Stock</span>
                  <span className="insight-value">{inventorySummary.inStock}</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Low Stock</span>
                  <span className="insight-value">{inventorySummary.lowStock}</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Out of Stock</span>
                  <span className="insight-value">{inventorySummary.outOfStock}</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Categories</span>
                  <span className="insight-value">{inventorySummary.categories?.length || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activities Section */}
      <div className={`content-section ${activeTab === 'activities' ? 'active' : ''}`}>
        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                <div className="activity-details">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-description">{activity.description}</div>
                  <div className="activity-time">{formatDate(activity.time)}</div>
                </div>
                {activity.status && (
                  <span className={`status-badge ${activity.status}`}>
                    {activity.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard {
          animation: fadeIn 0.5s ease;
          padding: 20px;
          max-width: 1600px;
          margin: 0 auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .page-title {
          font-size: clamp(1.5rem, 4vw, 2rem);
          color: #111;
          margin: 0;
        }

        .date-badge {
          background: #f8f5f0;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #c9a96e;
          border: 1px solid #e8d5c0;
          white-space: nowrap;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        /* Theme-consistent buttons */
        .alert-btn, .export-btn, .refresh-btn, .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          position: relative;
          font-weight: 500;
        }

        .alert-btn {
          background: #f8f5f0;
          color: #c9a96e;
          border: 1px solid #e8d5c0;
        }

        .alert-btn:hover {
          background: #f0e8dd;
          transform: translateY(-2px);
        }

        .alert-btn.has-alerts {
          background: #fff3e0;
          color: #bd7b4d;
          border-color: #bd7b4d;
        }

        .alert-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #c45a5a;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .export-btn {
          background: #4f8a8b;
          color: white;
        }

        .export-btn:hover {
          background: #3d6b6c;
          transform: translateY(-2px);
        }

        .refresh-btn {
          background: #c9a96e;
          color: white;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #b89350;
          transform: translateY(-2px);
        }

        .filter-btn {
          background: #6c757d;
          color: white;
        }

        .filter-btn:hover {
          background: #5a6268;
          transform: translateY(-2px);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }
          
          .refresh-text, .export-text {
            display: none;
          }
          
          .alert-btn, .export-btn, .refresh-btn, .filter-btn {
            padding: 0.5rem;
          }
        }

        .alert-panel {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(201, 169, 110, 0.15);
          border-left: 4px solid #c9a96e;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .alert-panel h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 1rem;
          color: #c9a96e;
        }

        .alert-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .alert-item {
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 0.9rem;
          border-left: 3px solid transparent;
        }

        .alert-item.warning {
          background: #fff9f0;
          color: #bd7b4d;
          border-left-color: #bd7b4d;
        }

        .alert-item.info {
          background: #f0f7f7;
          color: #4f8a8b;
          border-left-color: #4f8a8b;
        }

        .alert-item.danger {
          background: #fef2f2;
          color: #c45a5a;
          border-left-color: #c45a5a;
        }

        .mobile-tabs {
          display: none;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #f0e8dd;
          background: white;
          border-radius: 8px 8px 0 0;
        }

        .mobile-tabs button {
          flex: 1;
          padding: 0.8rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .mobile-tabs button.active {
          color: #c9a96e;
          border-bottom-color: #c9a96e;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .mobile-tabs {
            display: flex;
          }
          
          .content-section:not(.active) {
            display: none;
          }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          background: white;
          border-radius: 12px;
          padding: 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(201, 169, 110, 0.1);
          border: 1px solid #f0e8dd;
        }

        .stat-item svg {
          font-size: clamp(1.2rem, 3vw, 2rem);
          color: #c9a96e;
        }

        .stat-item.warning svg {
          color: #c45a5a;
        }

        .stat-item div {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .stat-label {
          font-size: clamp(0.7rem, 2vw, 0.85rem);
          color: #666;
          margin-bottom: 0.2rem;
          white-space: nowrap;
        }

        .stat-value {
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 600;
          color: #111;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .period-selector-wrapper {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .period-selector {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          flex: 1;
        }

        .period-selector button {
          padding: 0.5rem 1rem;
          border: 1px solid #e8d5c0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          color: #666;
        }

        .period-selector button:hover {
          background: #f8f5f0;
          border-color: #c9a96e;
        }

        .period-selector button.active {
          background: #c9a96e;
          color: white;
          border-color: #c9a96e;
        }

        .charts-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .insights-grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .insights-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(201, 169, 110, 0.1);
          border: 1px solid #f0e8dd;
        }

        .insights-card h2 {
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          color: #c9a96e;
          border-bottom: 2px solid #f0e8dd;
          padding-bottom: 0.5rem;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .insight-item {
          padding: 1rem;
          background: #f8f5f0;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e8d5c0;
        }

        .insight-label {
          display: block;
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 0.3rem;
        }

        .insight-value {
          display: block;
          font-size: 1.2rem;
          font-weight: 600;
          color: #111;
        }

        .recent-activities {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(201, 169, 110, 0.1);
          border: 1px solid #f0e8dd;
        }

        .recent-activities h2 {
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          color: #c9a96e;
          border-bottom: 2px solid #f0e8dd;
          padding-bottom: 0.5rem;
        }

        .activities-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid #f0e8dd;
          transition: background 0.3s ease;
          flex-wrap: wrap;
        }

        .activity-item:hover {
          background: #f8f5f0;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: #f8f5f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
          border: 1px solid #e8d5c0;
        }

        .activity-details {
          flex: 1;
          min-width: 200px;
        }

        .activity-title {
          font-weight: 600;
          color: #111;
          margin-bottom: 0.2rem;
          font-size: 0.95rem;
        }

        .activity-description {
          font-size: 0.85rem;
          color: #666;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #999;
          margin-top: 0.2rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .status-badge.delivered {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }

        .status-badge.processing {
          background: #fff3e0;
          color: #bd7b4d;
          border: 1px solid #ffcc80;
        }

        .status-badge.pending {
          background: #ffebee;
          color: #c45a5a;
          border: 1px solid #ef9a9a;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60vh;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f8f5f0;
          border-top: 4px solid #c9a96e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .stats-grid,
          .stats-row {
            gap: 1rem;
          }
        }

        @media (max-width: 1024px) {
          .stats-grid,
          .stats-row,
          .charts-row,
          .insights-grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 10px;
          }

          .stats-grid,
          .stats-row,
          .charts-row,
          .insights-grid-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stat-item {
            padding: 1rem;
          }

          .activity-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .activity-icon {
            margin-bottom: 0.5rem;
          }

          .activity-details {
            min-width: 100%;
          }

          .status-badge {
            align-self: flex-start;
          }

          .insights-grid {
            gap: 0.5rem;
          }

          .insight-item {
            padding: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .dashboard-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-left {
            justify-content: space-between;
          }

          .header-actions {
            justify-content: flex-end;
          }

          .period-selector button {
            flex: 1;
            padding: 0.5rem;
            font-size: 0.8rem;
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }

          .insight-item {
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .insight-label,
          .insight-value {
            display: inline-block;
          }

          .insight-value {
            font-size: 1rem;
          }
        }

        /* Landscape Mode */
        @media (max-height: 600px) and (orientation: landscape) {
          .activities-list {
            max-height: 200px;
          }

          .charts-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* High-DPI Screens */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .dashboard {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        /* Print Styles */
        @media print {
          .refresh-btn,
          .export-btn,
          .alert-btn,
          .filter-btn,
          .mobile-tabs,
          .period-selector-wrapper {
            display: none;
          }

          .dashboard {
            padding: 0;
          }

          .stat-item,
          .insights-card,
          .recent-activities {
            box-shadow: none;
            border: 1px solid #ddd;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;