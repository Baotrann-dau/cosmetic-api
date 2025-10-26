const express = require('express');
const router = express.Router();
const db = require('../config/db');
const categoryCtrl = require('../controllers/categoryController');


router.get('/', categoryCtrl.getAll);
router.get('/:id', categoryCtrl.getCategory)
router.post('/',  categoryCtrl.create);     


module.exports = router;