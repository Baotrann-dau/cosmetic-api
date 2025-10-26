const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, cartCtrl.getCart);
router.post('/add', verifyToken, cartCtrl.addToCart);
router.put('/update', verifyToken, cartCtrl.updateQuantity);
router.delete('/clear', verifyToken, cartCtrl.clearCart);

module.exports = router;