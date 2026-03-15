import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          
          <Route path="/" element={
            isAuthenticated ? (
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <div style={{ flex: 1, marginLeft: '260px' }}>
                  <Navbar />
                  <div style={{ padding: '2rem' }}>
                    <Dashboard />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="/products" element={
            isAuthenticated ? (
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <div style={{ flex: 1, marginLeft: '260px' }}>
                  <Navbar />
                  <div style={{ padding: '2rem' }}>
                    <Products />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="/products/add" element={
            isAuthenticated ? (
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <div style={{ flex: 1, marginLeft: '260px' }}>
                  <Navbar />
                  <div style={{ padding: '2rem' }}>
                    <AddProduct />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="/products/edit/:id" element={
            isAuthenticated ? (
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <div style={{ flex: 1, marginLeft: '260px' }}>
                  <Navbar />
                  <div style={{ padding: '2rem' }}>
                    <EditProduct />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="/categories" element={
            isAuthenticated ? (
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <div style={{ flex: 1, marginLeft: '260px' }}>
                  <Navbar />
                  <div style={{ padding: '2rem' }}>
                    <Categories />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="/orders" element={
            isAuthenticated ? (
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <div style={{ flex: 1, marginLeft: '260px' }}>
                  <Navbar />
                  <div style={{ padding: '2rem' }}>
                    <Orders />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="/customers" element={
            isAuthenticated ? (
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <div style={{ flex: 1, marginLeft: '260px' }}>
                  <Navbar />
                  <div style={{ padding: '2rem' }}>
                    <Customers />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="/settings" element={
            isAuthenticated ? (
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <div style={{ flex: 1, marginLeft: '260px' }}>
                  <Navbar />
                  <div style={{ padding: '2rem' }}>
                    <Settings />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;