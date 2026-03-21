// admin/src/pages/Categories.jsx - COMPLETE RESPONSIVE CODE
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSync } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // ===== FETCH REAL DATA FROM DATABASE =====
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const productsRes = await axios.get('api.newpremglasshouse.in/api/products', { headers });
      
      let productsData = [];
      if (productsRes.data?.success && Array.isArray(productsRes.data.data)) {
        productsData = productsRes.data.data;
      } else if (Array.isArray(productsRes.data)) {
        productsData = productsRes.data;
      } else if (productsRes.data?.data && Array.isArray(productsRes.data.data)) {
        productsData = productsRes.data.data;
      }
      
      setProducts(productsData);

      const glassCount = productsData.filter(p => p.category?.toLowerCase() === 'glass').length;
      const plywoodCount = productsData.filter(p => p.category?.toLowerCase() === 'plywood').length;
      const hardwareCount = productsData.filter(p => p.category?.toLowerCase() === 'hardware').length;
      const interiorCount = productsData.filter(p => p.category?.toLowerCase() === 'interior').length;

      setCategories([
        { id: 'glass', name: 'Glass', description: 'Premium glass products', productCount: glassCount, color: '#4f8a8b' },
        { id: 'plywood', name: 'Plywood', description: 'High quality plywood', productCount: plywoodCount, color: '#bd7b4d' },
        { id: 'hardware', name: 'Hardware', description: 'Hardware accessories', productCount: hardwareCount, color: '#c9a96e' },
        { id: 'interior', name: 'Interiors', description: 'Interior design projects', productCount: interiorCount, color: '#6a4e8c' }
      ]);

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      toast.error('Failed to load data');
      setCategories([
        { id: 'glass', name: 'Glass', description: 'Premium glass products', productCount: 0, color: '#4f8a8b' },
        { id: 'plywood', name: 'Plywood', description: 'High quality plywood', productCount: 0, color: '#bd7b4d' },
        { id: 'hardware', name: 'Hardware', description: 'Hardware accessories', productCount: 0, color: '#c9a96e' },
        { id: 'interior', name: 'Interiors', description: 'Interior design projects', productCount: 0, color: '#6a4e8c' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id ? { ...c, ...formData } : c
      ));
      toast.success('Category updated (local only)');
    } else {
      toast.info('Category creation is not available in demo');
    }
    
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      toast.info('Category deletion is not available in demo');
    }
  };

  const handleRefresh = () => {
    fetchAllData();
    toast.success('Data refreshed from database');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);

  return (
    <div className="categories-page">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p className="subtitle">Manage your product categories</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={handleRefresh}>
            <FaSync /> Refresh
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <span className="stat-label">Total Categories</span>
          <span className="stat-value">{categories.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{totalProducts}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Last Updated</span>
          <span className="stat-value">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card" style={{ borderTop: `4px solid ${category.color}` }}>
            <div className="card-header">
              <h3>{category.name}</h3>
              <div className="actions">
                <button className="btn-edit" onClick={() => handleEdit(category)}>
                  <FaEdit />
                </button>
                <button className="btn-delete" onClick={() => handleDelete(category.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="description">{category.description}</p>
            <div className="product-count">
              <span className="count-number">{category.productCount || 0}</span>
              <span className="count-label">Products</span>
            </div>
            <div className="category-footer">
              <small>ID: {category.id}</small>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Glass, Plywood, Hardware"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingCategory ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .categories-page {
          padding: 20px;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 20px;
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

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #111;
        }

        .subtitle {
          color: #666;
          font-size: 0.95rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary, .btn-refresh {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #c9a96e;
          color: white;
        }

        .btn-primary:hover {
          background: #b08e5e;
        }

        .btn-refresh {
          background: #f0f0f0;
          color: #333;
        }

        .btn-refresh:hover {
          background: #e0e0e0;
        }

        .stats-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 600;
          color: #c9a96e;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .category-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(201,169,110,0.2);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-header h3 {
          font-size: 1.2rem;
          color: #111;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-edit, .btn-delete {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .btn-edit {
          background: #c9a96e;
          color: white;
        }

        .btn-edit:hover {
          background: #b08e5e;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
        }

        .btn-delete:hover {
          background: #bb2d3b;
        }

        .description {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.5;
          min-height: 60px;
        }

        .product-count {
          padding: 1rem 0;
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .count-number {
          font-size: 1.5rem;
          font-weight: 600;
          color: #c9a96e;
        }

        .count-label {
          color: #666;
          font-size: 0.9rem;
        }

        .category-footer {
          padding-top: 1rem;
          color: #999;
          font-size: 0.8rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal h2 {
          margin-bottom: 1.5rem;
          color: #111;
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
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.95rem;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-submit {
          padding: 0.75rem 1.5rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        /* ===== RESPONSIVE STYLES ===== */
        @media (max-width: 1200px) {
          .stats-summary {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 992px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .header-actions {
            width: 100%;
          }
          
          .btn-primary, .btn-refresh {
            flex: 1;
          }
        }

        @media (max-width: 768px) {
          .categories-page {
            padding: 10px;
          }
          
          .page-header h1 {
            font-size: 1.5rem;
          }
          
          .subtitle {
            font-size: 0.85rem;
          }
          
          .header-actions {
            flex-direction: column;
          }
          
          .btn-primary, .btn-refresh {
            width: 100%;
          }
          
          .stats-summary {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .stat-card {
            padding: 1rem;
          }
          
          .stat-value {
            font-size: 1.5rem;
          }
          
          .categories-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .category-card {
            padding: 1rem;
          }
          
          .card-header h3 {
            font-size: 1.1rem;
          }
          
          .description {
            font-size: 0.9rem;
            min-height: 40px;
          }
          
          .count-number {
            font-size: 1.2rem;
          }
          
          .modal {
            padding: 1.5rem;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .btn-cancel, .btn-submit {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .categories-page {
            padding: 8px;
          }
          
          .page-header h1 {
            font-size: 1.3rem;
          }
          
          .stat-card {
            padding: 0.8rem;
          }
          
          .stat-label {
            font-size: 0.8rem;
          }
          
          .stat-value {
            font-size: 1.3rem;
          }
          
          .category-card {
            padding: 0.8rem;
          }
          
          .card-header h3 {
            font-size: 1rem;
          }
          
          .actions .btn-edit,
          .actions .btn-delete {
            width: 28px;
            height: 28px;
            font-size: 0.8rem;
          }
          
          .count-number {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Categories;