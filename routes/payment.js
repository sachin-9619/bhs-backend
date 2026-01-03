const express = require('express');
const router = express.Router();



router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // rupees → paise
      currency: 'INR',
      receipt: 'bhs_receipt_' + Date.now(),
    });

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
