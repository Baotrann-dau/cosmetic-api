const express = require('express');
const router = express.Router();
const cartItemCtrl = require('../controllers/cartItemController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, cartItemCtrl.addItem);
router.put('/:id', verifyToken, cartItemCtrl.updateItem);
router.delete('/:id', verifyToken, cartItemCtrl.deleteItem);

module.exports = router;