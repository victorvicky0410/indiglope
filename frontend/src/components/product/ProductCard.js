import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoMdStar } from 'react-icons/io';
import cartContext from '../../contexts/cart/cartContext';
import useActive from '../../hooks/useActive';

const ProductCard = ({ product_name, product_price, description, image, selling_price, product_id }) => {
  const { active, handleActive, activeClass } = useActive(false);
  const { addItem, updateCartItemCount} = useContext(cartContext);
  const [quantity, setQuantity] = useState(1); // Default quantity to 1

  // Function to get cart data from sessionStorage (temporary storage)
  const getCartFromStorage = () => {
    const cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : []; // Return empty array if no cart found
  };

  // Function to save cart data to sessionStorage
  const saveCartToStorage = (cart) => {
    sessionStorage.setItem('cart', JSON.stringify(cart)); // Store the cart as a JSON string
    localStorage.setItem('cartItemCount', cart.length);
  };
    
  


  const handleAddItem = async () => {
    const mobilenumber = localStorage.getItem('mobilenumber'); // Get mobilenumber from localStorage
    window.location.reload();

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
          description,
          image,
          selling_price,
          quantity,
        };
        addItem(newItem);
       
        cart.push(newItem);
      }
       
          
       handleActive(product_id);

      setTimeout(()=>{
        handleActive(false);
      }, 3000);
      // Save the updated cart back to sessionStorage
      saveCartToStorage(cart);
      updateCartItemCount(cart.length);

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
    <div className="card products_card" key={product_id}>
      <figure className="products_img">
        <Link to={`/product/${product_id}`}>
          <img src={`data:image/jpeg;base64,${image}`} alt={`Image of ${product_name}`} />
        </Link>
      </figure>
      <div className="products_details">
        <h3 className="products_title">{product_name}</h3>
        <h5 className="products_info">{description}</h5>
        <div className="separator"></div>
        <h2 className="products_price">
          {selling_price} &nbsp;
          <small>
            <del>{product_price}</del>
          </small>
        </h2>
        <button
          type="button"
          className={`btn products_btn ${activeClass(product_id)}`}
          onClick={handleAddItem}
        >
          {active ? 'Added' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
