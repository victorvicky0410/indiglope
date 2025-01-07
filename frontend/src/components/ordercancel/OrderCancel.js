import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./OrderCancel.css";

function OrderCancel() {
  const [showPopup, setShowPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  const handleCancelOrder = () => {
    setIsProcessing(true); // Start processing
    setTimeout(() => {
      setIsProcessing(false); // Stop processing after 3 seconds
      setShowPopup(false);
      navigate("/"); // Redirect to the home page after cancellation
    },); // Simulate a 3-second cancellation process
  };

  const handleKeepOrder = () => {
    setShowPopup(false); // Close the popup
    navigate("/cart"); // Navigate to the cart page when "No, Keep Order" is clicked
  };

  return (
    <div className="order-cancel-page">
      <h1 className="order-cancel-header">Thank You for Visiting! 😔</h1>
      <button className="order-cancel-btn" onClick={handlePopupToggle}>
        Proceed with Cancellation
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div className="order-cancel-popup-modal">
          <div className="order-cancel-popup-content">
            <h2 className="order-cancel-popup-header">
              Are you sure you want to cancel this order?
            </h2>
            <div className="order-cancel-popup-progress-container">
              {isProcessing ? (
                <div className="order-cancel-spinner"></div> // Show spinner while processing
              ) : (
                <div className="order-cancel-popup-button-group">
                  <button
                    className="order-cancel-confirm-btn"
                    onClick={handleCancelOrder}
                  >
                    Yes, Cancel
                  </button>
                  <button
                    className="order-cancel-close-btn"
                    onClick={handleKeepOrder} // Navigate to cart when "No" is clicked
                  >
                    No, Keep Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderCancel;
