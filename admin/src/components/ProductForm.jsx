import { useState } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductForm = ({ initialData = {}, onSubmit, onCancel, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    category: initialData.category || '',
    price: initialData.price || '',
    mrp: initialData.mrp || '',
    stock: initialData.stock || '',
    brand: initialData.brand || '',
    thickness: initialData.thickness || [],
    size: initialData.size || '',
    features: initialData.features || [],
    images: initialData.images || []
  });

  const [newThickness, setNewThickness] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddThickness = () => {
    if (newThickness.trim()) {
      setFormData(prev => ({
        ...prev,
        thickness: [...prev.thickness, newThickness.trim()]
      }));
      setNewThickness('');
    }
  };

  const handleRemoveThickness = (index) => {
    setFormData(prev => ({
      ...prev,
      thickness: prev.thickness.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In real app, upload to server and get URLs
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
    toast.success(`${files.length} images selected`);
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-grid">
        {/* Left Column */}
        <div className="form-left">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label>MRP</label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., 8x4 ft"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="form-right">
          <div className="form-group">
            <label>Thickness</label>
            <div className="array-input">
              <div className="input-group">
                <input
                  type="text"
                  value={newThickness}
                  onChange={(e) => setNewThickness(e.target.value)}
                  placeholder="e.g., 12mm"
                />
                <button type="button" onClick={handleAddThickness}>Add</button>
              </div>
              <div className="tags">
                {formData.thickness.map((item, index) => (
                  <span key={index} className="tag">
                    {item}
                    <button type="button" onClick={() => handleRemoveThickness(index)}>
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Features</label>
            <div className="array-input">
              <div className="input-group">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature"
                />
                <button type="button" onClick={handleAddFeature}>Add</button>
              </div>
              <div className="tags">
                {formData.features.map((item, index) => (
                  <span key={index} className="tag">
                    {item}
                    <button type="button" onClick={() => handleRemoveFeature(index)}>
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Images</label>
            <div className="image-upload">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-btn">
                <FaUpload /> Upload Images
              </label>
            </div>
            <div className="image-preview">
              {formData.images.map((img, index) => (
                <div key={index} className="preview-item">
                  <img src={img} alt={`Preview ${index}`} />
                  <button type="button" onClick={() => handleRemoveImage(index)}>
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          {initialData.id ? 'Update Product' : 'Create Product'}
        </button>
      </div>

      <style jsx>{`
        .product-form {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
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
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #c9a96e;
          box-shadow: 0 0 0 2px rgba(201,169,110,0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .array-input .input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .array-input .input-group input {
          flex: 1;
        }

        .array-input .input-group button {
          padding: 0.75rem 1.5rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #f0f0f0;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .tag button {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          padding: 0.1rem;
        }

        .tag button:hover {
          color: #dc3545;
        }

        .image-upload {
          margin-bottom: 1rem;
        }

        .image-upload input {
          display: none;
        }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #f0f0f0;
          border: 1px dashed #c9a96e;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-btn:hover {
          background: #e8e8e8;
        }

        .image-preview {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .preview-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
        }

        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-item button {
          position: absolute;
          top: 0.3rem;
          right: 0.3rem;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e0e0e0;
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

        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .product-form {
            padding: 1rem;
          }

          .image-preview {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </form>
  );
};

export default ProductForm;