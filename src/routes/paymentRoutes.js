const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/paymentController');

router.get('/', paymentCtrl.getPaymentMethods);
router.post('/', paymentCtrl.createPayment);


module.exports = router;