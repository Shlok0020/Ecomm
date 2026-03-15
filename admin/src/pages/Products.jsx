import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaSort } from "react-icons/fa";
import productService from "../services/productService";
import toast from "react-hot-toast";

const Products = () => {

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
    { id: "interiors", label: "Interiors" }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  // ==========================
  // FETCH PRODUCTS
  // ==========================
  const fetchProducts = async () => {
  try {

    const data = await productService.getAll();

    setProducts(data);
    setFilteredProducts(data);

  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error("Failed to load products");
  } finally {
    setLoading(false);
  }
};

  // ==========================
  // FILTER PRODUCTS
  // ==========================
  const filterProducts = () => {

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
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
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

      fetchProducts();

    } catch (error) {

      console.error(error);

      toast.error("Delete failed");
    }
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {

    return (
      <div className="loading">
        Loading products...
      </div>
    );
  }

  return (
    <div className="products-page">

      <div className="page-header">
        <h1>Products</h1>

        <Link to="/products/add" className="btn-primary">
          <FaPlus /> Add Product
        </Link>
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

      {/* TABLE */}

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

            {filteredProducts.map(product => (

              <tr key={product._id}>

                <td>
                  <img
                    src={product.image || "https://via.placeholder.com/50"}
                    alt={product.name}
                    className="thumb"
                  />
                </td>

                <td>{product.name}</td>

                <td>{product.category}</td>

                <td>₹{product.price}</td>

                <td>{product.stock}</td>

                <td>
                  {product.isActive ? "Active" : "Inactive"}
                </td>

                <td className="actions">

                  <Link to={`/products/edit/${product._id}`}>
                    <FaEdit />
                  </Link>

                  <button onClick={() => handleDelete(product._id)}>
                    <FaTrash />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            No products found
          </div>
        )}

      </div>

      {/* CSS */}

      <style>

        {`

        .products-page{
          padding:20px;
        }

        .page-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:20px;
        }

        .btn-primary{
          background:#c9a96e;
          color:white;
          padding:10px 18px;
          border-radius:6px;
          text-decoration:none;
          display:flex;
          gap:6px;
          align-items:center;
        }

        .filters{
          display:flex;
          gap:15px;
          margin-bottom:20px;
        }

        .search-box{
          display:flex;
          align-items:center;
          gap:10px;
          background:white;
          padding:10px;
          border-radius:6px;
          border:1px solid #ddd;
        }

        .search-box input{
          border:none;
          outline:none;
        }

        .filter{
          display:flex;
          align-items:center;
          gap:8px;
          background:white;
          padding:10px;
          border-radius:6px;
          border:1px solid #ddd;
        }

        .table-container{
          background:white;
          border-radius:10px;
          overflow:hidden;
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        th,td{
          padding:14px;
          border-bottom:1px solid #eee;
        }

        th{
          background:#f7f7f7;
          text-align:left;
        }

        .thumb{
          width:50px;
          border-radius:6px;
        }

        .actions{
          display:flex;
          gap:12px;
        }

        .actions button{
          background:none;
          border:none;
          color:red;
          cursor:pointer;
        }

        .no-products{
          text-align:center;
          padding:40px;
          color:#888;
        }

        `}

      </style>

    </div>
  );
};

export default Products;