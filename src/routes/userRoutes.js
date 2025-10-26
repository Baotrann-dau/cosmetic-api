const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.get('/', userCtrl.getAllUsers);
router.get('/register', userCtrl.getRegisteredUsers);
router.get('/me', userCtrl.getMe);
router.put('/me', userCtrl.updateProfile);



module.exports = router;

