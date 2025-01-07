import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faBox, faInfoCircle, faFileImage, faTags, faArrowUpShortWide, faTowerObservation } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Import axios for HTTP requests
import './AddProduct.css';
import Sidebar from '../Sidebar/Sidebar';

const AddProduct = ({ onAddProduct }) => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    sellingPrice: '',
    description: '',
    shortDescription: '',
    category: '',
    subCategory: '',
    brand: '',
    tags: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({
        ...product,
        image: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('product_name', product.name);
    formData.append('product_price', product.price);
    formData.append('selling_price', product.sellingPrice);
    formData.append('description', product.description);
    formData.append('short_description', product.shortDescription);
    formData.append('category', product.category);
    formData.append('sub_category', product.subCategory);
    formData.append('brand', product.brand);
    formData.append('tags', product.tags);
    formData.append('image', product.image); // Assuming this is a file
  
    try {
      const token = localStorage.getItem('admintoken');

      const response = await axios.post('http://localhost:5000/admin/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,  // Add token here

        },
      });
      if (response.status === 200) {
        alert('Product added successfully');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };
  

  return (
    <div>
      <Sidebar/>
    
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Name and Prices */}
        <div className="form-row">
          <div className="input-container">
            <label>Product Name</label>
            <FontAwesomeIcon icon={faBox} style={{ marginRight: '8px', color: 'grey' }} />
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>
          <div className="input-container">
            <label>Product Price</label>
            <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px', color: 'grey' }} />
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter product price"
              required
              min="0"
            />
          </div>
        </div>

        {/* Selling Price */}
        <div className="form-row">
          <div className="input-container">
            <label>Selling Price</label>
            <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px', color: 'grey' }} />
            <input
              type="number"
              name="sellingPrice"
              value={product.sellingPrice}
              onChange={handleChange}
              placeholder="Enter selling price"
              required
              min="0"
            />
          </div>
        </div>

        {/* Description and Short Description */}
        <div className="form-row">
          <div className="input-container">
            <label>Description</label>
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px', color: 'grey' }} />
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
            />
          </div>
          <div className="input-container">
            <label>Short Description</label>
            <FontAwesomeIcon icon={faArrowUpShortWide} style={{ marginRight: '8px', color: 'grey' }} />
            <textarea
              name="shortDescription"
              value={product.shortDescription}
              onChange={handleChange}
              placeholder="Enter short description"
              required
            />
          </div>
        </div>

        {/* Category and Sub-Category */}
        <div className="form-row">
          <div className="input-container">
            <label>Category</label>
            <FontAwesomeIcon icon={faTags} style={{ marginRight: '8px', color: 'grey' }} />
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Enter product category"
              required
            />
          </div>
          <div className="input-container">
            <label>Sub-Category</label>
            <FontAwesomeIcon icon={faTags} style={{ marginRight: '8px', color: 'grey' }} />
            <input
              type="text"
              name="subCategory"
              value={product.subCategory}
              onChange={handleChange}
              placeholder="Enter product sub-category"
              required
            />
          </div>
        </div>

        {/* Brand */}
        <div className="form-row">
          <div className="input-container">
            <label>Brand</label>
            <FontAwesomeIcon icon={faTowerObservation} style={{ marginRight: '8px', color: 'grey' }} />
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              placeholder="Enter product brand"
              required
            />
          </div>
        </div>

        {/* Tags */}
        <div className="form-row">
          <div className="input-container">
            <label>Tags</label>
            <FontAwesomeIcon icon={faTags} style={{ marginRight: '8px', color: 'grey' }} />
            <select
              name="tags"
              value={product.tags}
              onChange={handleChange}
              required
            >
              <option value="">Select tags</option>
              <option value="new">New</option>
              <option value="popular">Popular</option>
              <option value="sale">Sale</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        {/* Image */}
        <div className="form-row">
          <div className="input-container">
            <label>Images</label>
            <FontAwesomeIcon icon={faFileImage} style={{ marginRight: '8px', color: 'grey' }} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="button-container">
          <button type="submit">Add Product</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddProduct;
