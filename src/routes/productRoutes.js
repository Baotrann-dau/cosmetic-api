const express = require('express');
const router = express.Router();
const db = require('../config/db');
const productCtrl = require('../controllers/productController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/', productCtrl.getAll);
router.get('/:id', productCtrl.getById);
router.post('/', verifyToken, requireAdmin, productCtrl.create);     
router.put('/:id', productCtrl.update);   
router.delete('/:id', productCtrl.remove);


module.exports = router;

