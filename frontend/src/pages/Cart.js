import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCartX } from 'react-icons/bs';
import { calculateTotal, displayMoney } from '../helpers/utils';
import useDocTitle from '../hooks/useDocTitle';
import CartItem from '../components/cart/CartItem';
import EmptyView from '../components/common/EmptyView';
import axios from 'axios';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';

const Cart = () => {
  useDocTitle('Cart');

  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch cart items from the server or local storage
  const fetchCartItems = async () => {
    const mobilenumber = localStorage.getItem('mobilenumber');
    try {
      let fetchedItems = [];
      if (mobilenumber) {
        const response = await axios.get('http://localhost:5000/api/cart', { params: { mobilenumber } });
        fetchedItems = response.data;
      } else {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        fetchedItems = storedCart;
      }

      if (Array.isArray(fetchedItems)) {
        const uniqueItems = removeDuplicateItems(fetchedItems);
        setCartItems(uniqueItems);
      } else {
        setError('Invalid cart data received from the server.');
      }
    } catch (err) {
      setError('Failed to fetch cart data from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove duplicate items based on product_id
  const removeDuplicateItems = (items) => {
    const uniqueItemsMap = new Map();
    items.forEach(item => {
      if (!uniqueItemsMap.has(item.product_id)) {
        uniqueItemsMap.set(item.product_id, item);
      }
    });
    return Array.from(uniqueItemsMap.values());
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const cartQuantity = cartItems.length;

  // Calculate totals
  const cartTotal = cartItems.map(item => item.product_price * item.quantity);
  const calculateCartTotal = calculateTotal(cartTotal);
  const displayCartTotal = displayMoney(calculateCartTotal);

  const cartDiscount = cartItems.map(item => (item.product_price - item.selling_price) * item.quantity);
  const calculateCartDiscount = calculateTotal(cartDiscount);
  const displayCartDiscount = displayMoney(calculateCartDiscount);

  const totalAmount = calculateCartTotal - calculateCartDiscount + 40;
  const displayTotalAmount = displayMoney(totalAmount);

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems, totalAmount } });
  };

  return (
    <>
      <Header />
      <section id="cart" className="section">
        <div className="container">
          {isLoading ? (
            <div>Loading...</div>
          ) : cartQuantity === 0 ? (
            <EmptyView
              icon={<BsCartX />}
              msg="Your Cart is Empty"
              link="/all-products"
              btnText="Start Shopping"
            />
          ) : (
            <div className="wrapper cart_wrapper">
              <div className="cart_left_col">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.product_id}  // Use product_id for better performance and consistency
                    index={index}           // Passing index to CartItem (if needed)
                    product_id={item.product_id}
                    product_name={item.product_name}
                    description={item.description}
                    image={item.image}
                    selling_price={item.selling_price}
                    product_price={item.product_price}
                    quantity={item.quantity}
                    updateCart={fetchCartItems} // Refresh the cart when an item is updated
                  />
                ))}
              </div>

              <div className="cart_right_col">
                <div className="order_summary">
                  <h3>
                    Order Summary &nbsp; ({cartQuantity} {cartQuantity > 1 ? 'items' : 'item'})
                  </h3>
                  <div className="order_summary_details">
                    <div className="price">
                      <span>Original Price</span>
                      <b>{displayCartTotal}</b>
                    </div>
                    <div className="discount">
                      <span>Discount</span>
                      <b>- {displayCartDiscount}</b>
                    </div>
                    <div className="delivery">
                      <span>Delivery</span>
                      <b>Rs 40</b>
                    </div>
                    <div className="separator"></div>
                    <div className="total_price">
                      <b><small>Total Price</small></b>
                      <b>{displayTotalAmount}</b>
                    </div>
                  </div>
                  <button type="button" className="btn checkout_btn" onClick={handleCheckout}>
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Cart;
