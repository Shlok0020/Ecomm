// admin/src/pages/Products.jsx - COMPLETELY FIXED
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaSort, FaSync } from "react-icons/fa";
import productService from "../services/productService";
import toast from "react-hot-toast";

// ============= IMAGE URL HELPER =============
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
  return `http://localhost:5000/uploads/${imagePath}`;
};
// ============================================

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const categories = [
    { id: "glass", label: "Glass" },
    { id: "plywood", label: "Plywood" },
    { id: "hardware", label: "Hardware" },
    { id: "interior", label: "Interior" }
  ];

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-refresh when navigating back from AddProduct
  useEffect(() => {
    if (location.state?.refresh) {
      console.log("🔄 Refreshing products after add/edit");
      fetchProducts();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Listen for custom event from AddProduct
  useEffect(() => {
    const handleProductAdded = () => {
      console.log("🔄 Product added event received");
      fetchProducts();
    };
    
    window.addEventListener('productAdded', handleProductAdded);
    
    return () => {
      window.removeEventListener('productAdded', handleProductAdded);
    };
  }, []);

  // Filter products when dependencies change
  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  // ==========================
  // FETCH PRODUCTS - FIXED
  // ==========================
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAll();
      console.log("📦 Products fetched:", response);
      
      // SAFETY CHECK: Ensure we always have an array
      let productsArray = [];
      
      if (Array.isArray(response)) {
        productsArray = response;
      } else if (response?.data && Array.isArray(response.data)) {
        productsArray = response.data;
      } else if (response?.products && Array.isArray(response.products)) {
        productsArray = response.products;
      } else {
        console.warn("Unexpected data format:", response);
        productsArray = [];
      }
      
      setProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setProducts([]); // Set to empty array on error
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // FILTER PRODUCTS - FIXED
  // ==========================
  const filterProducts = () => {
    // Ensure products is an array before filtering
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }
    
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name?.localeCompare(b.name);
      if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      return 0;
    });

    setFilteredProducts(filtered);
  };

  // ==========================
  // DELETE PRODUCT
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await productService.delete(id);
      toast.success("Product deleted");
      fetchProducts(); // Refresh after delete
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // ==========================
  // MANUAL REFRESH
  // ==========================
  const handleRefresh = () => {
    fetchProducts();
    toast.success("Products refreshed");
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="loading" style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner" style={{
          width: "50px",
          height: "50px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #c9a96e",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px"
        }} />
        <p>Loading products...</p>
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
    <div className="products-page">

      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="subtitle">Total {filteredProducts.length} products</p>
        </div>

        <div className="header-actions">
          <button className="btn-refresh" onClick={handleRefresh} title="Refresh products">
            <FaSync /> Refresh
          </button>
          <Link to="/products/add" className="btn-primary">
            <FaPlus /> Add Product
          </Link>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="filters">

        <div className="search-box">
          <FaSearch />
          <input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter">
          <FaFilter />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <FaSort />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price-asc">Price Low → High</option>
            <option value="price-desc">Price High → Low</option>
          </select>
        </div>

      </div>

      {/* TABLE - WITH SAFETY CHECK */}
      <div className="table-container">

        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={getImageUrl(product.image) || "https://via.placeholder.com/50"}
                      alt={product.name}
                      className="thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/50";
                      }}
                    />
                  </td>
                  <td>
                    <div className="product-name">{product.name}</div>
                    {product.subcategory && product.subcategory !== 'none' && (
                      <div className="product-subcategory">({product.subcategory})</div>
                    )}
                  </td>
                  <td>
                    <span className={`category-badge category-${product.category}`}>
                      {product.category}
                    </span>
                  </td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/products/edit/${product._id}`} className="btn-edit">
                      <FaEdit />
                    </Link>
                    <button className="btn-delete" onClick={() => handleDelete(product._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#888', fontSize: '1.1rem' }}>No products found</p>
                  {searchTerm && <p style={{ color: '#999', fontSize: '0.9rem' }}>Try adjusting your search</p>}
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* CSS */}
      <style>
        {`
        .products-page {
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #111;
          margin-bottom: 5px;
        }

        .subtitle {
          color: #666;
          font-size: 0.9rem;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .btn-primary, .btn-refresh {
          background: #c9a96e;
          color: white;
          padding: 10px 18px;
          border-radius: 6px;
          text-decoration: none;
          display: flex;
          gap: 6px;
          align-items: center;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .btn-refresh {
          background: #f0f0f0;
          color: #333;
        }

        .btn-refresh:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }

        .btn-primary:hover {
          background: #b08e5e;
          transform: translateY(-2px);
        }

        .filters {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ddd;
          flex: 1;
          min-width: 250px;
        }

        .search-box input {
          border: none;
          outline: none;
          width: 100%;
        }

        .filter {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ddd;
          min-width: 180px;
        }

        .filter select {
          border: none;
          outline: none;
          background: none;
          width: 100%;
          cursor: pointer;
        }

        .table-container {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 14px;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #f7f7f7;
          text-align: left;
          font-weight: 600;
          color: #333;
        }

        .thumb {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
        }

        .product-name {
          font-weight: 500;
        }

        .product-subcategory {
          font-size: 0.8rem;
          color: #c9a96e;
        }

        .category-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
          text-transform: capitalize;
        }

        .category-glass {
          background: #4f8a8b20;
          color: #2c3e50;
        }

        .category-plywood {
          background: #bd7b4d20;
          color: #8b5a2b;
        }

        .category-hardware {
          background: #c9a96e20;
          color: #a07840;
        }

        .category-interior {
          background: #6a4e8c20;
          color: #4a2c5a;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .status-badge.active {
          background: #10b98120;
          color: #047857;
        }

        .status-badge.inactive {
          background: #ef444420;
          color: #b91c1c;
        }

        .actions {
          display: flex;
          gap: 12px;
        }

        .actions a, .actions button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .btn-edit {
          color: #c9a96e;
        }

        .btn-edit:hover {
          color: #b08e5e;
          transform: scale(1.1);
        }

        .btn-delete {
          color: #ef4444;
        }

        .btn-delete:hover {
          color: #b91c1c;
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .filters {
            flex-direction: column;
          }
          
          .search-box, .filter {
            width: 100%;
          }
          
          .table-container {
            overflow-x: auto;
          }
        }
        `}
      </style>

    </div>
  );
};

export default Products;