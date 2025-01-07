import React from 'react';
import { Routes, Route } from 'react-router';
import useScrollRestore from '../hooks/useScrollRestore.js';

import Login from '../admin/Login/Login.js';
import Sidebar from '../admin/Sidebar/Sidebar.js'; // Import Sidebar component
import Dashboard from '../admin/Dashboard/Dashboard.js';
import ProductsList from '../admin/ProductList/ProductsList.js';
import AddProduct from '../admin/AddProducts/AddProduct.js';
import OrdersList from '../admin/Orders/OrdersList.js'

const AdminRoutes = () => {

    useScrollRestore();

    return (
        <>
            <Routes>
             


                {/* Admin Route /*/}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<ProductsList />} />
                <Route path="/admin/add-product" element={<AddProduct />} />
                <Route path="/admin/orders" element={<OrdersList />} />
                <Route path="/admin" element={<Dashboard />} />

            </Routes>
        </>
    );
};

export default AdminRoutes;