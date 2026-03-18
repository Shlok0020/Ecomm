// admin/src/components/ProductForm.jsx - COMPLETELY FIXED WITH PROPER SUBMISSION
import { useState } from 'react';
import { FaUpload, FaTimes, FaImage, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductForm = ({ initialData = {}, onSubmit, onCancel, categories = [], glassSubcategories = [] }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    category: initialData.category || '',
    subcategory: initialData.subcategory || 'none',
    price: initialData.price || '',
    mrp: initialData.mrp || '',
    stock: initialData.stock || '',
    brand: initialData.brand || '',
    thickness: initialData.thickness || [],
    size: initialData.size || '',
    features: initialData.features || [],
    imageUrl: initialData.imageUrl || initialData.image || '',
  });

  const [newThickness, setNewThickness] = useState('');
  const [newFeature, setNewFeature] = useState('');
  
  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || initialData.image || null);
  const [imageSource, setImageSource] = useState(initialData.imageUrl ? 'url' : 'file');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      setImageSource('file');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  // Handle image URL change
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setImageSource('url');
    setImageFile(null);
    
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  // Clear image
  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    document.getElementById('imageFile') && (document.getElementById('imageFile').value = '');
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

  // In ProductForm.jsx - the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.name || !formData.category || !formData.price) {
    toast.error('Please fill all required fields');
    return;
  }

  // ✅ Add description validation
  if (!formData.description) {
    toast.error('Please enter a description');
    return;
  }

  // Image validation
  if (!imageFile && !formData.imageUrl) {
    toast.error('Please provide either an image URL or upload an image file');
    return;
  }

  // Glass category validation
  if (formData.category === 'glass' && (!formData.subcategory || formData.subcategory === 'none')) {
    toast.error('Please select a glass type');
    return;
  }

  setUploading(true);

  try {
    const submitData = new FormData();
    
    // Add all fields
    submitData.append('name', formData.name);
    submitData.append('description', formData.description); // ✅ Now this is guaranteed to have a value
    submitData.append('category', formData.category);
    submitData.append('price', String(formData.price));
    
    if (formData.subcategory && formData.subcategory !== 'none') {
      submitData.append('subcategory', formData.subcategory);
    }
    
    if (formData.mrp) {
      submitData.append('mrp', String(formData.mrp));
    }
    
    if (formData.stock) {
      submitData.append('stock', String(formData.stock));
    }
    
    if (formData.brand) {
      submitData.append('brand', formData.brand);
    }
    
    if (formData.size) {
      submitData.append('size', formData.size);
    }
    
    // Handle arrays
    if (formData.thickness && formData.thickness.length > 0) {
      submitData.append('thickness', JSON.stringify(formData.thickness));
    }
    
    if (formData.features && formData.features.length > 0) {
      submitData.append('features', JSON.stringify(formData.features));
    }
    
    // Handle image
    if (imageFile) {
      submitData.append('images', imageFile);
    } else if (formData.imageUrl) {
      submitData.append('image', formData.imageUrl);
    }

    await onSubmit(submitData);
    
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error('Failed to save product');
  } finally {
    setUploading(false);
  }
};
  // ✅ Check if selected category is glass
  const isGlassCategory = formData.category === 'glass';

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-grid">
        {/* Left Column - Image Upload Section */}
        <div className="form-left">
          <h3 className="section-title">Product Image</h3>
          
          <div className="image-upload-section">
            {/* Image Source Toggle */}
            <div className="image-source-toggle">
              <button
                type="button"
                className={`toggle-btn ${imageSource === 'file' ? 'active' : ''}`}
                onClick={() => setImageSource('file')}
              >
                <FaUpload /> Upload File
              </button>
              <button
                type="button"
                className={`toggle-btn ${imageSource === 'url' ? 'active' : ''}`}
                onClick={() => setImageSource('url')}
              >
                <FaLink /> Image URL
              </button>
            </div>

            {/* File Upload Input */}
            {imageSource === 'file' && (
              <div className="file-upload">
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="file-input"
                />
                <label htmlFor="imageFile" className="file-label">
                  <FaUpload />
                  <span>Choose an image</span>
                </label>
                {imageFile && (
                  <p className="file-name">{imageFile.name}</p>
                )}
              </div>
            )}

            {/* URL Input */}
            {imageSource === 'url' && (
              <div className="url-input">
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  className="url-field"
                />
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=Invalid+Image';
                    }}
                  />
                  <button 
                    type="button" 
                    className="remove-image"
                    onClick={clearImage}
                    title="Remove image"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}

            {!imagePreview && (
              <div className="no-image">
                <FaImage size={48} color="#c9a96e" />
                <p>No image selected</p>
                <small>Upload an image or provide a URL</small>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="form-right">
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

          {/* Glass Subcategory Dropdown - Sirf Glass Category ke liye */}
          {isGlassCategory && (
            <div className="form-group glass-section">
              <label>Glass Type *</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Glass Type</option>
                {glassSubcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.label} {sub.description && `- ${sub.description}`}
                  </option>
                ))}
              </select>
              <small className="help-text">Select the specific type of glass product</small>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>MRP (₹)</label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
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
                min="0"
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

          <div className="form-group">
            <label>Thickness Options</label>
            <div className="array-input">
              <div className="input-group">
                <input
                  type="text"
                  value={newThickness}
                  onChange={(e) => setNewThickness(e.target.value)}
                  placeholder="e.g., 12mm"
                />
                <button type="button" onClick={handleAddThickness} className="add-btn">
                  Add
                </button>
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
                <button type="button" onClick={handleAddFeature} className="add-btn">
                  Add
                </button>
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
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={uploading}>
          Cancel
        </button>
        <button type="submit" className="btn-submit" disabled={uploading}>
          {uploading ? 'Saving...' : (initialData.id ? 'Update Product' : 'Create Product')}
        </button>
      </div>

      <style>{`
        .product-form {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          max-width: 1200px;
          margin: 0 auto;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #c9a96e;
          font-family: 'Cormorant Garamond', serif;
        }

        /* Image Upload Section */
        .image-upload-section {
          background: #f8f5f0;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .image-source-toggle {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .toggle-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .toggle-btn.active {
          background: #c9a96e;
          color: white;
          border-color: #c9a96e;
        }

        .toggle-btn:hover:not(.active) {
          border-color: #c9a96e;
        }

        .file-upload {
          margin-bottom: 1rem;
        }

        .file-input {
          display: none;
        }

        .file-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: white;
          border: 2px dashed #c9a96e;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-label:hover {
          background: #f0e9de;
        }

        .file-name {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
          word-break: break-all;
        }

        .url-field {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .url-field:focus {
          outline: none;
          border-color: #c9a96e;
          box-shadow: 0 0 0 2px rgba(201,169,110,0.1);
        }

        .image-preview-container {
          margin-top: 1rem;
        }

        .image-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .image-preview img {
          width: 100%;
          height: 250px;
          object-fit: contain;
          background: #f0f0f0;
        }

        .remove-image {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #ef4444;
          font-size: 1rem;
        }

        .remove-image:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.1);
        }

        .no-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background: white;
          border-radius: 8px;
          color: #999;
          text-align: center;
        }

        .no-image small {
          margin-top: 0.5rem;
          color: #c9a96e;
        }

        /* Form Fields */
        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
          font-size: 0.95rem;
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

        /* Glass section styling */
        .glass-section {
          background: #f9f5f0;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #c9a96e;
          margin-bottom: 1.5rem;
        }

        .help-text {
          display: block;
          margin-top: 0.5rem;
          color: #666;
          font-size: 0.85rem;
        }

        .array-input .input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .add-btn {
          padding: 0.75rem 1.5rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .add-btn:hover {
          background: #b08e5e;
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
          transition: all 0.3s ease;
        }

        .tag button:hover {
          color: #dc3545;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 2rem;
          border-top: 2px solid #f0f0f0;
          margin-top: 1rem;
        }

        .btn-cancel {
          padding: 0.75rem 2rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #f5f5f5;
        }

        .btn-submit {
          padding: 0.75rem 2rem;
          background: #c9a96e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-submit:hover:not(:disabled) {
          background: #b08e5e;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(201,169,110,0.3);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

          .image-source-toggle {
            flex-direction: column;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
};

export default ProductForm;