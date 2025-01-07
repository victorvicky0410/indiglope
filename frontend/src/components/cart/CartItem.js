import React, { useState } from 'react';
import axios from 'axios';

const CartItem = ({
  product_id,
  product_name,
  description,
  image,
  selling_price,
  quantity,
  updateCart, // Callback function to refresh the cart in the parent component
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);

  // Handle quantity update (increase/decrease)
  const handleQuantityChange = async (change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      console.warn('Quantity cannot be less than 1.');
      handleDelete(); // Automatically remove item when quantity reaches 0
      return; // Prevent quantity below 1
    }

    setIsLoading(true);
    try {
      const mobilenumber = localStorage.getItem('mobilenumber');
      if (!mobilenumber) {
        console.error('Mobile number not found');
        return;
      }

      const response = await axios.put('http://localhost:5000/api/cart/update', {
        mobilenumber,
        product_id,
        quantity: newQuantity,
      });

      if (response.status === 200) {
        setCurrentQuantity(newQuantity);
        updateCart(); // Trigger the refresh callback to reload the cart data
      } else {
        console.error('Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle item deletion
  const handleDelete = async () => {
    setIsLoading(true);
    window.location.reload();
    try {
      const mobilenumber = localStorage.getItem('mobilenumber');
      if (!mobilenumber) {
        console.error('Mobile number not found');
        return;
      }

      const response = await axios.delete('http://localhost:5000/api/cart/delete', {
        data: { mobilenumber, product_id },
      });

      if (response.status === 200) {
        updateCart(); // Refresh the cart after deletion
      } else {
        console.error('Failed to delete item from cart', response.data);
        // Display error to the user if item not found
        if (response.data.error) {
          alert(response.data.error); 
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('An error occurred while trying to delete the item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cart_item">
      <img
        src={`data:image/jpeg;base64,${image}`}
        alt={product_name}
        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
      />
      <div>
        <h3>{product_name}</h3>
        <p>{description}</p>
        <p>Price: {selling_price}</p>
        <p>Total: {selling_price * currentQuantity}</p>

        <button
          onClick={() => handleQuantityChange(-1)} // Decrease quantity
          disabled={isLoading}
        >
          -
        </button>
        <span>{currentQuantity}</span>
        <button
          onClick={() => handleQuantityChange(1)} // Increase quantity
          disabled={isLoading}
        >
          +
        </button>

        <button
          onClick={handleDelete}
          disabled={isLoading}
          style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px', cursor: 'pointer' }}
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
