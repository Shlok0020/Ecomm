// admin/src/pages/AddProduct.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import productService from "../services/productService";
import toast from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategories([
        { id: "glass", label: "Glass" },
        { id: "plywood", label: "Plywood" },
        { id: "hardware", label: "Hardware" },
        { id: "interior", label: "Interior" },
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // ✅ FIXED: Using correct function name 'create' instead of 'createProduct'
      await productService.create(formData);

      toast.success("Product created successfully");
      navigate("/products");

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
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
    <div className="add-product">
      <h1 className="page-title">Add New Product</h1>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        categories={categories}
      />

      <style>{`
        .add-product {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .page-title {
          margin-bottom: 2rem;
          font-size: 2rem;
          color: #111;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;