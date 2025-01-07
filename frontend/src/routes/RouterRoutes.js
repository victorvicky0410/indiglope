import React from 'react';
import { Routes, Route } from 'react-router';
import useScrollRestore from '../hooks/useScrollRestore';
import AllProducts from '../pages/AllProducts';
import Cart from '../pages/Cart';
import Home from '../pages/Home';
import ProductDetails from '../pages/ProductDetails';
import ErrorPage from '../pages/ErrorPage';
import CheckoutPage from '../components/checkout/CheckoutPage';
import Login from '../admin/Login/Login.js';
import Dashboard from '../admin/Dashboard/Dashboard.js';
import ProductsList from '../admin/ProductList/ProductsList.js';
import AddProduct from '../admin/AddProducts/AddProduct.js';
import OrdersList from '../admin/Orders/OrdersList.js'
import PrivateRoute from '../PrivateRoute.js'
import OrderSuccess from '../components/Ordersuccess/OrderSuccess.js'
import OrderCancel from '../components/ordercancel/OrderCancel.js'

const RouterRoutes = () => {

    useScrollRestore();

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/all-products" element={<AllProducts />} />
                <Route path="/product-details/:productId" element={<ProductDetails />} />
                <Route path="*" element={<ErrorPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/ordersuccess" element={<OrderSuccess />} />
                <Route path="/ordercancel" element={<OrderCancel />} />
                <Route path="/admin/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<ProductsList />} />
                <Route path="/admin/add-product" element={<AddProduct />} />
                <Route path="/admin/orders" element={<OrdersList />} />
                <Route path="/admin" element={<Dashboard />} />
         
         
        </Route>

            </Routes>
        </>
    );
};

export default RouterRoutes;