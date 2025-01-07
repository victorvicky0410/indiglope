import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IoMdStar, IoMdCheckmark } from 'react-icons/io';
import ProductSummary from '../components/product/ProductSummary';
import SectionsHead from '../components/common/SectionsHead';
import RelatedSlider from '../components/sliders/RelatedSlider';
import Services from '../components/common/Services';
import useDocTitle from '../hooks/useDocTitle';
import Footer from '../components/common/Footer';
import BackTop from '../components/common/BackTop';
import Header from '../components/common/Header';
import axios from 'axios';

const ProductDetails = () => {
  useDocTitle('Product Details');
  const { id } = useParams(); // Retrieve product ID from URL
  const [product, setProduct] = useState(null);

// Access addItem from CartContext
  const [quantity, setQuantity] = useState(1); // Default quantity to 1

  useEffect(() => {
    // Fetch product details using the product ID
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // You can customize this to show a loading spinner or a message
  }

  const { product_id, product_name, short_description, selling_price, product_price, image, category } = product;

  // Function to get cart data from sessionStorage (temporary storage)
  const getCartFromStorage = () => {
    const cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : []; // Return empty array if no cart found
  };

  // Function to save cart data to sessionStorage
  const saveCartToStorage = (cart) => {
    sessionStorage.setItem('cart', JSON.stringify(cart)); // Store the cart as a JSON string
  };

  const handleAddItem = async () => {
    const mobilenumber = localStorage.getItem('mobilenumber'); // Get mobilenumber from localStorage

    if (!mobilenumber) {
      // If no mobilenumber is found, temporarily store the cart in sessionStorage
      let cart = getCartFromStorage(); // Get the current cart from sessionStorage

      const existingItemIndex = cart.findIndex(item => item.product_id === product_id);
      if (existingItemIndex !== -1) {
        // If item exists, update quantity
        cart[existingItemIndex].quantity += quantity;
      } else {
        // If item doesn't exist, add new item to cart
        const newItem = {
          product_id,
          product_name,
          description: short_description, // Added description
          image,
          selling_price,
          quantity,
        };// Assuming this updates the global cart context
        cart.push(newItem);
      }

      // Save the updated cart back to sessionStorage
      saveCartToStorage(cart);
      alert('Item added to cart. Please log in to save the cart permanently.');

      return; // Exit the function since we are not making an API call
    }

    // If mobilenumber exists, proceed with API call to save the cart
    const item = {
      mobilenumber, // Use mobilenumber from localStorage
      product_id,
      quantity,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', item);
      console.log('Item added to cart:', response.data);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <>
      <Header />
      <section id="product_details" className="section">
        <div className="container">
          <div className="wrapper prod_details_wrapper">
            {/*=== Product Details Left-content ===*/}
            <div className="prod_details_left_col">
              <div className="prod_details_tabs">
                {/* Add tabs if required */}
                <div className={`tabs_item`}>
                  <img src={`data:image/jpeg;base64,${image}`} alt="product-img" />
                </div>
              </div>
              <figure className="prod_details_img">
                <img src={`data:image/jpeg;base64,${image}`} alt={product_name} className="product-image" />
              </figure>
            </div>

            {/*=== Product Details Right-content ===*/}
            <div className="prod_details_right_col">
              <h1 className="prod_details_title">{product_name}</h1>
              <h4 className="prod_details_info">{short_description}</h4>

              <div className="prod_details_ratings">
                <span className="rating_star">
                  {[...Array(5)].map((_, i) => (
                    <IoMdStar key={i} />
                  ))}
                </span>
                <span>|</span>
                <Link to="#"> {product.ratings} Ratings</Link>
              </div>

              <div className="separator"></div>

              <div className="prod_details_price">
                <div className="price_box">
                  <h2 className="price">
                    {selling_price} &nbsp;
                    <small className="del_price">
                      <del>{product_price}</del>
                    </small>
                  </h2>
                  <span className="tax_txt">(Inclusive of all taxes)</span>
                </div>

                <div className="badge">
                  <span>
                    <IoMdCheckmark /> In Stock
                  </span>
                </div>
              </div>

              <div className="separator"></div>

              <div className="prod_details_buy_btn">
                <button type="button" className="btn" onClick={handleAddItem}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Summary */}
      <ProductSummary {...product} />

      {/* Related Products Section */}
      <section id="related_products" className="section">
        <div className="container">
          <SectionsHead heading="Related Products" />
          <RelatedSlider category={category} />
        </div>
      </section>

      {/* Services Section */}
      <Services />
      <Footer />
      <BackTop />
    </>
  );
};

export default ProductDetails;
