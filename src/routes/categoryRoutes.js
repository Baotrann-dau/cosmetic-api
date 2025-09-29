const express = require('express');
const router = express.Router();
const db = require('../config/db');
const categoryCtrl = require('../controllers/categoryController');


router.get('/', categoryCtrl.getAll);
router.post('/',  categoryCtrl.create);     


module.exports = router;