const express = require('express');
const router = express.Router();
const locationCtrl = require('../controllers/locationController');

router.get('/provinces', locationCtrl.getProvinces);
router.get('/wards/:province_id', locationCtrl.getWardsByProvince);

module.exports = router;