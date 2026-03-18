import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import productService from '../services/productService';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productRes, categoriesRes] = await Promise.all([
        productService.getById(id),
        // fetch categories API
        Promise.resolve({ data: [
          { id: 'glass', label: 'Glass' },
          { id: 'plywood', label: 'Plywood' },
          { id: 'hardware', label: 'Hardware' },
          { id: 'interiors', label: 'Interiors' }
        ]})
      ]);

      setProduct(productRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await productService.update(id, formData);
      toast.success('Product updated successfully');
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner"></div>
        <style jsx>{`
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
    <div className="edit-product">
      <h1 className="page-title">Edit Product</h1>
      {product && (
        <ProductForm 
          initialData={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          categories={categories}
        />
      )}

      <style jsx>{`
        .edit-product {
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

export default EditProduct;