export const handlePayment = async (amount, userDetails) => {
  try {
    // Fetch order ID from your backend
    const response = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();
    if (!data.id) throw new Error("Failed to fetch order details");

    // Razorpay payment options
    const options = {
      key: "rzp_live_pErqeDM4GjZvfX", // Replace with your Razorpay key ID
      amount: data.amount, // Amount in paise (e.g., ₹100 = 10000 paise)
      currency: "INR",
      name: "INDIGLOPE",
      description: "Purchase Description",
      image: "/logo_2.jpg", // Optional logo (ensure this is accessible in public folder)
      order_id: data.orderId,
      handler: function (paymentResponse) {
        console.log("Payment successful", paymentResponse);

        // Handle post-payment logic here, e.g., saving payment details to backend
        fetch("http://localhost:5000/api/payment/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentResponse),
        })
          .then((verificationResponse) => verificationResponse.json())
          .then((verificationData) => {
            console.log("Payment verified", verificationData);
          })
          .catch((error) => {
            console.error("Error during payment verification", error);
          });
      },
      prefill: {
        name: userDetails.fullName,
        email: userDetails.email, // Make sure to collect email from the user
        contact: userDetails.mobile,
      },
      notes: {
        address: `${userDetails.houseDetails}, ${userDetails.area}, ${userDetails.pinCode}`,
      },
      theme: { color: "#F37254" },
    };

    // Initialize Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();

    // Handle payment failure
    rzp.on("payment.failed", function (errorResponse) {
      console.error("Payment failed", errorResponse.error);
    });
  } catch (error) {
    console.error("Error in payment", error);
    alert("There was an issue initiating the payment process. Please try again.");
  }
};
