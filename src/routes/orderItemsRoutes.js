const express = require('express');
const router = express.Router();
const db = require('../config/db');
const orderItemsCtrl = require('../controllers/orderItemsController');


router.get('/orders/:id', orderItemsCtrl.getByOrder);
router.post('/',  orderItemsCtrl.create);     


module.exports = router;
