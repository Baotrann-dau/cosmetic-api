// src/routes/testDbRoute.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');   // import connection đã export

// ✅ Route test kết nối database
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution'); 
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
});

module.exports = router;
