const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.get('/', userCtrl.getAllUsers);
router.get('/register', userCtrl.getRegisteredUsers);
router.get('/getMe', userCtrl.getMe);

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);


console.log('userRoutes loaded');
  


module.exports = router;

