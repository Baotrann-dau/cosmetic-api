const express = require('express');
const router = express.Router();
const db = require('../config/db');
const orderCtrl = require('../controllers/orderController');


router.get('/', orderCtrl.getAll);
router.get('/:id', orderCtrl.getOne);
router.post('/',  orderCtrl.create);     


module.exports = router;