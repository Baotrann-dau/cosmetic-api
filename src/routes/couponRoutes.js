const express = require('express');
const router = express.Router();
const coupponCtrl = require('../controllers/couponController');

router.get('/', coupponCtrl.getAllCoupons);
router.post('/validate', coupponCtrl.validateCoupon);

module.exports = router;