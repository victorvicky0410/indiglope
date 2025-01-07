import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { dropdownMenu } from '../../data/headerData';
import commonContext from '../../contexts/common/commonContext';
import cartContext from '../../contexts/cart/cartContext';
import AccountForm from '../form/AccountForm';
import SearchBar from './SearchBar';
import axios from 'axios';


const Header = () => {

    const { formUserInfo, toggleForm, toggleSearch } = useContext(commonContext);
    const [isSticky, setIsSticky] = useState(false);
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
    
     const itemQuantity = cartItems.length;


    // handle the sticky-header
    useEffect(() => {
        const handleIsSticky = () => window.scrollY >= 50 ? setIsSticky(true) : setIsSticky(false);

        window.addEventListener('scroll', handleIsSticky);

        return () => {
            window.removeEventListener('scroll', handleIsSticky);
        };
    }, [isSticky]);
     


    return (
        <>
            <header id="header" className={isSticky ? 'sticky' : ''}>
                <div className="container">
                    <div className="navbar">
                        <h2 className="nav_logo">
                            <Link to="/">INDIGLOPE</Link>
                        </h2>
                        <nav className="nav_actions">
                            <div className="search_action">
                                <span onClick={() => toggleSearch(true)}>
                                    <AiOutlineSearch />
                                </span>
                                <div className="tooltip">Search</div>
                            </div>

                            <div className="cart_action">
                                <Link to="/cart">
                                    <AiOutlineShoppingCart />
                                      {itemQuantity > 0 && <span className="cart-count">{itemQuantity}</span>}
                                </Link>
                                <div className="tooltip">Cart</div>
                            </div>

                            <div className="user_action">
                                <span>
                                    <AiOutlineUser />
                                </span>
                                <div className="dropdown_menu">
                                    <h4>Hello! {formUserInfo && <Link to="*">&nbsp;{formUserInfo}</Link>}</h4>
                                    <p>Access account and manage orders</p>
                                    {
                                        !formUserInfo && (
                                            <button
                                                type="button"
                                                onClick={() => toggleForm(true)}
                                            >
                                                Login / Signup
                                            </button>
                                        )
                                    }
                                    <div className="separator"></div>
                                    <ul>
                                        {
                                            dropdownMenu.map(item => {
                                                const { id, link, path } = item;
                                                return (
                                                    <li key={id}>
                                                        <Link to={path}>{link}</Link>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            <SearchBar />
            <AccountForm />
        </>
    );
};

export default Header;