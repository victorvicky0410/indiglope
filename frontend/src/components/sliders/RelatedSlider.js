import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper';
import axios from 'axios';

import 'swiper/scss';
import 'swiper/scss/pagination';

import ProductCard from '../product/ProductCard';

const RelatedSlider = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products'); // Adjust URL as needed
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the provided category prop
  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Swiper
      modules={[Pagination, A11y]}
      spaceBetween={10}
      slidesPerView="auto"
      pagination={{ clickable: true }}
      breakpoints={{
        480: { slidesPerView: 2 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 4 },
      }}
      className="related_swiper"
    >
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <SwiperSlide key={product.product_id}>
            <ProductCard {...product} />
          </SwiperSlide>
        ))
      ) : (
        <div>No products found in this category.</div>
      )}
    </Swiper>
  );
};

export default RelatedSlider;
