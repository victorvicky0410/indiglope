import { createContext, useState } from 'react';

const cartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const addItem = (item) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    setCartItemCount(updatedCart.length); // Update the item count
  };

  const updateCartItemCount = (count) => {
    setCartItemCount(count);
  };

  return (
    <cartContext.Provider value={{ cart, addItem, cartItemCount, updateCartItemCount }}>
      {children}
    </cartContext.Provider>
  );
};

export default cartContext;
