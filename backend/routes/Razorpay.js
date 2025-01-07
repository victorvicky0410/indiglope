const express = require("express");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: "rzp_live_pErqeDM4GjZvfX",
  key_secret: "j9lSZKpibwmle4ZEtULVOkvV",
});

// Create Order
router.post("/create-order", async (req, res) => {
    
  const { amount } = req.body;
   console.log(amount);
  const options = {
    amount: amount * 100, // Convert to paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Payment
router.post("/verify-payment", (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha256", "your_razorpay_key_secret")
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (hash === razorpay_signature) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

module.exports = router;
