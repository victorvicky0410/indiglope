import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, A11y, Autoplay } from 'swiper';
import 'swiper/scss';
import 'swiper/scss/autoplay';
import 'swiper/scss/pagination';
import 'swiper/scss/effect-coverflow';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching products');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Swiper
      modules={[EffectCoverflow, Pagination, A11y, Autoplay]}
      loop={true}
      speed={400}
      spaceBetween={100}
      slidesPerView={"auto"}
      pagination={{ clickable: true }}
      effect={"coverflow"}
      centeredSlides={true}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 70,
        modifier: 3,
        slideShadows: false,
      }}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      breakpoints={{
        768: {
          slidesPerView: 2,
          spaceBetween: 200,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 250,
        },
      }}
      className="featured_swiper"
    >
      {products.map((product) => (
        <SwiperSlide key={product.product_id}>
          <div className="featured_slides">
            <div featured_title>{product.product_name}</div>
            <figure className="featured_img">
               <Link to={`/product/${product.product_id}`}>
                <img  src={`data:image/jpeg;base64,${product.image}`}  alt={product.product_name}  />
                </Link> 
            </figure>  
            <h2 className='products_price'>{product.selling_price}&nbsp;
            <small><del>{product.product_price} </del></small></h2>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductsList;
 