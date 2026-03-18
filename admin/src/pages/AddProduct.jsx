// admin/src/pages/AddProduct.jsx - FIXED
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import productService from "../services/productService";
import toast from "react-hot-toast";


// Add this right after your imports in AddProduct.jsx
const testDirectAPI = async () => {
  const token = localStorage.getItem('adminToken');
  
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
    const response = await fetch('http://localhost:5000/api/products', {
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

// Add a button in your component (temporarily)
// Add this somewhere in your JSX, maybe after the h1:
<button 
  onClick={testDirectAPI}
  style={{
    background: '#4CAF50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    marginBottom: '20px',
    cursor: 'pointer'
  }}
>
  Test API Directly
</button>

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
      const token = localStorage.getItem('adminToken');
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
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
        glassSubcategories={glassSubcategories}
      />
      <style>{`
        .add-product {
          animation: fadeIn 0.5s ease;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .page-title {
          margin-bottom: 2rem;
          font-size: 2rem;
          color: #111;
          font-family: 'Cormorant Garamond', serif;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;