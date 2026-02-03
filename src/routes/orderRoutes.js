const express = require('express');
const router = express.Router();
const { handlePaymentSuccess } = require('../controllers/orderController');

// This is our simulation trigger point
router.post('/webhook/payment-success', handlePaymentSuccess);

module.exports = router;