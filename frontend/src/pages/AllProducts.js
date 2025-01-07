import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';  // Add axios to make HTTP requests
import { BsExclamationCircle } from 'react-icons/bs';
import useDocTitle from '../hooks/useDocTitle';
import FilterBar from '../components/filters/FilterBar';
import ProductCard from '../components/product/ProductCard';
import Services from '../components/common/Services';
import filtersContext from '../contexts/filters/filtersContext';
import EmptyView from '../components/common/EmptyView';


const AllProducts = () => {
    useDocTitle('All Products');
    
    // States for products and loading/error
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products from backend
    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Failed to load products');
                setLoading(false);
            });
    }, []);

    return (
        <>
            <section id="all_products" className="section">
                <FilterBar />

                <div className="container">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : products.length ? (
                        <div className="wrapper products_wrapper">
                            {products.map((item) => (
                                <ProductCard
                                    key={item.product_id}
                                    {...item}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyView
                            icon={<BsExclamationCircle />}
                            msg="No Results Found"
                        />
                    )}
                </div>
            </section>

            <Services />
        </>
    );
};

export default AllProducts;
