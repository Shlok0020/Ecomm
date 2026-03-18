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
  FaSync
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

  const COLORS = ['#c9a96e', '#bd7b4d', '#4f8a8b', '#c45a5a', '#6c757d', '#28a745'];

  useEffect(() => {
    loadDashboardData();
    
    // Subscribe to real-time updates
    const unsubscribe = dashboardService.subscribeToUpdates((update) => {
      console.log('Real-time update:', update);
      loadDashboardData(); // Reload data when updates happen
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
      
      // Fetch all dashboard data in parallel
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
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

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <button 
          className={`refresh-btn ${refreshing ? 'refreshing' : ''}`} 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FaSync className={refreshing ? 'spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
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

      {/* Charts Row */}
      <div className="charts-row">
        <ChartCard title="Sales Overview">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#c9a96e" strokeWidth={2} name="Sales (₹)" />
              <Line type="monotone" dataKey="orders" stroke="#4f8a8b" strokeWidth={2} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Products by Category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => `${entry.name}: ${entry.value}`}
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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => `${entry.name}: ${entry.value}`}
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#c9a96e" />
              <YAxis yAxisId="right" orientation="right" stroke="#4f8a8b" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="sold" fill="#c9a96e" name="Units Sold" />
              <Bar yAxisId="right" dataKey="revenue" fill="#4f8a8b" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Activities and Insights */}
      <div className="bottom-section">
        {/* Recent Activities */}
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

        {/* Customer Insights */}
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
                <span className="insight-value">₹{customerInsights.avgOrderValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Summary */}
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

      <style>{`
        .dashboard {
          animation: fadeIn 0.5s ease;
          padding: 20px;
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
        }

        .page-title {
          font-size: 2rem;
          color: #111;
          margin: 0;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #b89350;
          transform: translateY(-2px);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .stat-item svg {
          font-size: 2rem;
          color: #c9a96e;
        }

        .stat-item.warning svg {
          color: #dc3545;
        }

        .stat-item div {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 0.2rem;
        }

        .stat-value {
          font-size: 1.3rem;
          font-weight: 600;
          color: #111;
        }

        .period-selector {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .period-selector button {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
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

        .bottom-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .recent-activities {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .recent-activities h2,
        .insights-card h2 {
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          color: #111;
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
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.3s ease;
        }

        .activity-item:hover {
          background: #f8f9fa;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: #f0f0f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .activity-details {
          flex: 1;
        }

        .activity-title {
          font-weight: 600;
          color: #111;
          margin-bottom: 0.2rem;
        }

        .activity-description {
          font-size: 0.9rem;
          color: #666;
        }

        .activity-time {
          font-size: 0.8rem;
          color: #999;
          margin-top: 0.2rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.delivered {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.processing {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.pending {
          background: #f8d7da;
          color: #721c24;
        }

        .insights-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .insight-item {
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
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

        @media (max-width: 1024px) {
          .stats-grid,
          .stats-row,
          .charts-row,
          .bottom-section {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-grid,
          .stats-row,
          .charts-row,
          .bottom-section {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;