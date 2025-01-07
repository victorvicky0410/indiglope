import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./OrderSuccess.css";  // Ensure this path is correct
import {
  faTruck,
  faMapMarkerAlt,
  faCreditCard,
  faClipboardList,
  faIndianRupeeSign,
  faArrowLeft,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";


const OrderSuccess = () => {
  const navigate = useNavigate();

  const orderDetails = {
    orderId: "ORD123456789",
    shippingAddress: {
      name: "John Doe",
      address: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    shippingMethod: "Standard Shipping (5-7 Business Days)",
    billingAddress: {
      name: "John Doe",
      address: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    paymentMethod: "Visa ending in 1234",
    orderSummary: [
      { name: "Product 1", quantity: 2, price: 50.0 },
      { name: "Product 2", quantity: 1, price: 75.0 },
    ],
    totalAmount: 175.0,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="order-success">
      <div className="checkmark-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="checkmark">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <h1>Order Confirmed!</h1>

      {/* Printable Area */}
      <div className="printable-area">
        <section className="order-section order-id">
          <h2>Order ID: {orderDetails.orderId}</h2>
        </section>

        <p><strong>Thank you for your purchase. Your order details are below:</strong></p>

        <section className="order-section">
          <h2>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Shipping Address
          </h2>
          <p>{orderDetails.shippingAddress.name}</p>
          <p>{orderDetails.shippingAddress.address}</p>
          <p>
            {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}
          </p>
          <p>{orderDetails.shippingAddress.country}</p>
        </section>

        <section className="order-section">
          <h2>
            <FontAwesomeIcon icon={faTruck} /> Shipping Method
          </h2>
          <p>{orderDetails.shippingMethod}</p>
        </section>

        <section className="order-section">
          <h2>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Billing Address
          </h2>
          <p>{orderDetails.billingAddress.name}</p>
          <p>{orderDetails.billingAddress.address}</p>
          <p>
            {orderDetails.billingAddress.city}, {orderDetails.billingAddress.state} {orderDetails.billingAddress.zip}
          </p>
          <p>{orderDetails.billingAddress.country}</p>
        </section>

        <section className="order-section">
          <h2>
            <FontAwesomeIcon icon={faCreditCard} /> Payment Method
          </h2>
          <p>{orderDetails.paymentMethod}</p>
        </section>

        <section className="order-section">
          <h2>
            <FontAwesomeIcon icon={faClipboardList} /> Order Summary
          </h2>
          <ul>
            {orderDetails.orderSummary.map((item, index) => (
              <li key={index}>
                {item.name} (x{item.quantity}) - ₹{item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </section>

        <section className="order-section">
          <h2>
            <FontAwesomeIcon icon={faIndianRupeeSign} /> Total Amount
          </h2>
          <p>
            <strong>₹{orderDetails.totalAmount.toFixed(2)}</strong>
          </p>
        </section>
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="print-order" onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} /> Print Order
        </button>
        <button className="back-home" onClick={handleBackToHome}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
