const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.get('/', userCtrl.getAllUsers);
router.get('/register', userCtrl.getRegisteredUsers);

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);


// router.get('/', (req, res) => {
//   res.json([
//     { id: 1, name: 'Nguyen Van A' },
//     { id: 2, name: 'Tran Thi B' }
//   ]);
// });

// router.get('/register', (req, res) => {
//   res.send('Register page');
// });

console.log('userRoutes loaded');


module.exports = router;

