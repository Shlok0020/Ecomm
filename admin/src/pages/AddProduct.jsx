// admin/src/pages/AddProduct.jsx - RESPONSIVE VERSION
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import productService from "../services/productService";
import toast from "react-hot-toast";

// Test API function
const testDirectAPI = async () => {
  const token = localStorage.getItem('token');
  
  const testData = {
    name: "Test Product",
    category: "glass",
    price: 1000,
    description: "Test description",
    stock: 10
  };
  
  const formData = new FormData();
  formData.append('name', testData.name);
  formData.append('category', testData.category);
  formData.append('price', testData.price);
  formData.append('description', testData.description);
  formData.append('stock', testData.stock);
  
  try {
    await fetch('api.newpremglasshouse.in/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    console.log('Test Response:', response.status, data);
    alert(`Test ${response.status}: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error('Test Error:', error);
    alert('Test failed');
  }
};

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [glassSubcategories, setGlassSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchGlassSubcategories();
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

  const fetchGlassSubcategories = async () => {
    try {
      setGlassSubcategories([
        { id: "window-glass", label: "Window Glass", description: "Clear glass for windows and doors" },
        { id: "mirror-glass", label: "Mirror Glass", description: "Premium mirrors for bathrooms" },
        { id: "flute-glass", label: "Flute Glass", description: "Textured glass with flute pattern" },
        { id: "plain-glass", label: "Plain Glass", description: "Standard clear glass" },
        { id: "laminated-glass", label: "Laminated Glass", description: "Safety glass with PVB interlayer" },
        { id: "toughened-glass", label: "Toughened Glass", description: "Heat-strengthened safety glass" },
        { id: "frosted-glass", label: "Frosted Glass", description: "Privacy glass with etched finish" }
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (formData) => {
    const loadingToast = toast.loading("Creating product...");
    
    try {
      console.log("📤 Submitting product data:", formData);
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        toast.dismiss(loadingToast);
        toast.error("Please login first");
        navigate('/login');
        return;
      }
      
      await productService.create(formData);
      
      toast.dismiss(loadingToast);
      toast.success("Product created successfully");
      
      // Trigger refresh in Products page
      navigate("/products", { state: { refresh: true } });
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('productAdded'));
      
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error creating product:", error);
      // Error already shown by productService
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="add-product">
      <div className="page-header">
        <h1 className="page-title">Add New Product</h1>
        
        {/* Test API Button */}
        <button 
          className="test-api-btn"
          onClick={testDirectAPI}
        >
          Test API Directly
        </button>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        categories={categories}
        glassSubcategories={glassSubcategories}
      />

      <style>{`
        .add-product {
          animation: fadeIn 0.5s ease;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
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
          gap: 1rem;
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

        .page-title {
          font-size: 2rem;
          color: #111;
          font-family: 'Cormorant Garamond', serif;
          margin: 0;
        }

        .test-api-btn {
          background: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .test-api-btn:hover {
          background: #45a049;
          transform: translateY(-2px);
        }

        /* ===== RESPONSIVE STYLES ===== */
        @media (max-width: 768px) {
          .add-product {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .test-api-btn {
            width: 100%;
            padding: 12px;
          }
        }

        @media (max-width: 480px) {
          .add-product {
            padding: 0.75rem;
          }

          .page-title {
            font-size: 1.3rem;
          }

          .page-header {
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AddProduct;