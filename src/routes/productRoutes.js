const express = require('express');
const router = express.Router();
const db = require('../config/db');
const productCtrl = require('../controllers/productController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

// router.post('/', verifyToken, requireAdmin, productCtrl.create); 
router.get('/', productCtrl.getAll);
router.get('/:id', productCtrl.getById);
router.post('/', verifyToken, requireAdmin, productCtrl.create);     
router.put('/:id', productCtrl.update);   
router.delete('/:id', productCtrl.remove);


// router.get('/', async (req, res) => {
//   try {
//     const [products] = await db.query('SELECT id, name FROM products');
//     res.json(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database query error' });
//   }
// });

module.exports = router;

