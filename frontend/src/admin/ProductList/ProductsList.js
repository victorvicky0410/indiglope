import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa'; // Import FaSearch
import './ProductsList.css';
import Sidebar from '../Sidebar/Sidebar';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('admintoken');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/products', {
          headers: {
            'Authorization': `Bearer ${token}`,  // Add token here
          },
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products); // If search is empty, show all products
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, products]);

  const handleEditClick = (product) => {
    setEditedProduct(product);
    setImagePreview(`data:image/jpeg;base64,${product.image}`);
    setIsEditPopupVisible(true);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setEditedProduct({ ...editedProduct, image: file });
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editedProduct.product_name?.trim()) newErrors.product_name = 'Product name is required.';
    if (!editedProduct.product_price || isNaN(editedProduct.product_price)) newErrors.product_price = 'Valid price is required.';
    if (!editedProduct.selling_price || isNaN(editedProduct.selling_price)) newErrors.selling_price = 'Valid selling price is required.';
    if (!editedProduct.description?.trim()) newErrors.description = 'Description is required.';
    if (!editedProduct.short_description?.trim()) newErrors.short_description = 'Short description is required.';
    if (!editedProduct.category?.trim()) newErrors.category = 'Category is required.';
    if (!editedProduct.sub_category?.trim()) newErrors.sub_category = 'Sub-category is required.';
    if (!editedProduct.tags?.trim()) newErrors.tags = 'Tags are required.';
    if (!editedProduct.image) newErrors.image = 'Product image is required.';
    if (!editedProduct.brand?.trim()) newErrors.brand = 'Brand is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (validateForm()) {
      const formData = new FormData();
      Object.keys(editedProduct).forEach((key) => {
        formData.append(key, editedProduct[key]);
      });

      try {
        const token = localStorage.getItem('admintoken');

        const response = await axios.put(
          `http://localhost:5000/admin/products/${editedProduct.product_id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',  // Required for file uploads
              'Authorization': `Bearer ${token}`,     // Add token here
            },
          }
        );

        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.product_id === editedProduct.product_id ? response.data.updatedProduct : p))
        );

        setIsEditPopupVisible(false);
        setEditedProduct(null);
        setImagePreview(null);
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    }
  };

  const handleDeleteClick = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/admin/products/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,  // Add token here
          },
        }
      );
      setProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <Sidebar/>
    <div className="admin-products-list">
      <h2>Products List</h2>
      
      {/* Search Bar with Icon */}
      <div className="admin-search-bar-container">
        <FaSearch className="admin-search-icon" /> {/* Search icon */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="admin-products-table-container">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Selling Price</th>
              <th>Description</th>
              <th>Short Description</th>
              <th>Category</th>
              <th>Sub-category</th>
              <th>Tags</th>
              <th>Brand</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="12">No products found. Try different search terms!</td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>
                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt={product.product_name}
                      className="admin-product-image"
                    />
                  </td>
                  <td>{product.product_name}</td>
                  <td>{product.product_price}</td>
                  <td>{product.selling_price}</td>
                  <td>{product.description}</td>
                  <td>{product.short_description}</td>
                  <td>{product.category}</td>
                  <td>{product.sub_category}</td>
                  <td>{product.tags}</td>
                  <td>{product.brand}</td>
                  <td>
                    <FaEdit onClick={() => handleEditClick(product)} className="admin-edit-icon" />
                    <FaTrashAlt onClick={() => handleDeleteClick(product.product_id)} className="admin-delete-icon" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditPopupVisible && editedProduct && (
        <div className="admin-edit-popup">
          <div className="admin-popup-content">
            <h3>Edit Product</h3>
            <form>
              <label>Product Name:</label>
              <input
                type="text"
                name="product_name"
                value={editedProduct.product_name}
                onChange={handleChange}
              />
              <label>Product Price:</label>
              <input
                type="number"
                name="product_price"
                value={editedProduct.product_price}
                onChange={handleChange}
              />
              <label>Selling Price:</label>
              <input
                type="number"
                name="selling_price"
                value={editedProduct.selling_price}
                onChange={handleChange}
              />
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={editedProduct.description}
                onChange={handleChange}
              />
              <label>Short Description:</label>
              <input
                type="text"
                name="short_description"
                value={editedProduct.short_description}
                onChange={handleChange}
              />
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={editedProduct.category}
                onChange={handleChange}
              />
              <label>Sub Category:</label>
              <input
                type="text"
                name="sub_category"
                value={editedProduct.sub_category}
                onChange={handleChange}
              />
              <label>Tags:</label>
              <input
                type="text"
                name="tags"
                value={editedProduct.tags}
                onChange={handleChange}
              />
              <label>Brand:</label>
              <input
                type="text"
                name="brand"
                value={editedProduct.brand}
                onChange={handleChange}
              />
              <button onClick={handleSaveChanges}>Save Changes</button>
              <button
                onClick={() => setIsEditPopupVisible(false)}
                type="button"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ProductsList;
