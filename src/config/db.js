// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:');
    console.error('   → Host:', process.env.DB_HOST);
    console.error('   → Port:', process.env.DB_PORT);
    console.error('   → Error:', error.message);
  }
})();

pool.on('error', (err) => {
  console.error('⚠️ MySQL Pool Error:', err.code || err.message);
});

module.exports = pool;
