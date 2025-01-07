import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper';
import 'swiper/scss';
import 'swiper/scss/autoplay';
import 'swiper/scss/pagination';

const HeroSlider = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch products from backend
    useEffect(() => {
        axios
            .get('http://localhost:5000/api/products')
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

    // Get the last three products
    const lastThreeProducts = products.slice(-3);

    return (
        <Swiper
            modules={[Pagination, A11y, Autoplay]}
            loop={true}
            speed={400}
            spaceBetween={100}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
            }}
        >
            {lastThreeProducts.map((product, i) => (
                <SwiperSlide
                    key={product.product_id}
                    className={`wrapper hero_wrapper hero_slide-${i}`}
                >
                    <div className="hero_item_txt">
                        <h3>{product.product_name}</h3>
                        <h1>{product.short_description}</h1>
                        <h2 className="hero_price">
                            {product.selling_price} &nbsp;
                            <small>
                                <del>{product.product_price}</del>
                            </small>
                        </h2>
                        <Link className="btn">Shop Now</Link>
                    </div>
                    <figure className="hero_item_img">
                        <img
                            src={`data:image/jpeg;base64,${product.image}`}
                            alt="product-img"
                        />
                    </figure>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default HeroSlider;
