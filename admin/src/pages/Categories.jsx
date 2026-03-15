// admin/src/pages/Categories.jsx - FIXED with real product counts

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
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
      // Fetch products from API
      const productsRes = await axios.get('http://localhost:5000/api/products');
      const productsData = productsRes.data || [];
      console.log('📦 Products from database:', productsData);
      setProducts(productsData);

      // Fetch categories (or use default with real counts)
      const categoriesRes = await axios.get('http://localhost:5000/api/categories').catch(() => null);
      
      if (categoriesRes?.data) {
        // If categories API exists, use it
        setCategories(categoriesRes.data);
      } else {
        // ✅ Calculate real product counts from database
        const glassCount = productsData.filter(p => 
          p.category?.toLowerCase() === 'glass'
        ).length;
        
        const plywoodCount = productsData.filter(p => 
          p.category?.toLowerCase() === 'plywood'
        ).length;
        
        const hardwareCount = productsData.filter(p => 
          p.category?.toLowerCase() === 'hardware'
        ).length;
        
        const interiorCount = productsData.filter(p => 
          p.category?.toLowerCase() === 'interior'
        ).length;

        console.log('📊 Real product counts:', {
          glass: glassCount,
          plywood: plywoodCount,
          hardware: hardwareCount,
          interior: interiorCount
        });

        // Set categories with REAL product counts
        setCategories([
          { 
            id: 1, 
            name: 'Glass', 
            description: 'Premium glass products including window, mirror, and flute glass',
            productCount: glassCount,
            color: '#4f8a8b'
          },
          { 
            id: 2, 
            name: 'Plywood', 
            description: 'High quality plywood for furniture and construction',
            productCount: plywoodCount,
            color: '#bd7b4d'
          },
          { 
            id: 3, 
            name: 'Hardware', 
            description: 'Hardware accessories including handles, hinges, and tools',
            productCount: hardwareCount,
            color: '#c9a96e'
          },
          { 
            id: 4, 
            name: 'Interiors', 
            description: 'Interior design projects and modular solutions',
            productCount: interiorCount,
            color: '#6a4e8c'
          }
        ]);
      }
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update category via API
        await axios.put(`http://localhost:5000/api/categories/${editingCategory.id}`, formData);
        
        // Update local state
        setCategories(categories.map(c => 
          c.id === editingCategory.id ? { ...c, ...formData } : c
        ));
        toast.success('Category updated');
      } else {
        // Add new category via API
        const response = await axios.post('http://localhost:5000/api/categories', {
          ...formData,
          productCount: 0
        });
        
        // Add to local state
        setCategories([...categories, response.data]);
        toast.success('Category added');
      }
      
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        setCategories(categories.filter(c => c.id !== id));
        toast.success('Category deleted');
      } catch (error) {
        console.error('❌ Error:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleRefresh = () => {
    fetchAllData();
    toast.success('Data refreshed from database');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #c9a96e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p>Loading categories from database...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p className="subtitle">Manage your product categories</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={handleRefresh} title="Refresh from database">
            ↻ Refresh
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <span className="stat-label">Total Categories</span>
          <span className="stat-value">{categories.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">
            {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Last Updated</span>
          <span className="stat-value">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card" style={{ borderTop: `4px solid ${category.color || '#c9a96e'}` }}>
            <div className="card-header">
              <h3>{category.name}</h3>
              <div className="actions">
                <button className="btn-edit" onClick={() => handleEdit(category)} title="Edit category">
                  <FaEdit />
                </button>
                <button className="btn-delete" onClick={() => handleDelete(category.id)} title="Delete category">
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
              <small>Last updated: {new Date().toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .categories-page {
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
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #111;
          margin-bottom: 0.25rem;
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
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #c9a96e;
          box-shadow: 0 0 0 2px rgba(201,169,110,0.1);
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
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: #f5f5f5;
        }

        .btn-submit {
          padding: 0.75rem 1.5rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-submit:hover {
          background: #b08e5e;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            flex-direction: column;
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }

          .modal {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Categories;