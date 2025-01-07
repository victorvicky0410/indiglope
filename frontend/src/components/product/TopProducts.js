import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { BsArrowRight } from 'react-icons/bs';



const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetching products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products'); // Change URL if necessary
        setProducts(response.data);
        // Get unique categories
        const uniqueCategories = [
          'All',
          ...new Set(response.data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>

      {/* Category Filter as a Slider */}
      <div className="products_filter_tabs">
      <ul className="tabs">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`tabs_item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </div>
        ))}
        </ul>
      </div>

      {/* Products Display */}
      <div className="wrapper products_wrapper">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.product_id} {...product} />
          ))
        ) : (
          <div>No products found in this category.</div>
        )}

      <div className="card products_card browse_card">
        <a href="/all-products">
          Browse All <br /> Products <BsArrowRight />
        </a>
      </div>
      </div>
    </>
  );
};

export default TopProducts;
