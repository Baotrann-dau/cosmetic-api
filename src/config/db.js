// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // Đọc biến môi trường từ .env

// Tạo pool kết nối để tái sử dụng, tối ưu performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectTimeout: 10000
});

// connection.connect((err) => {
//     if (err) {
//       console.error('❌ Kết nối MySQL thất bại:', err.message);
//     } else {
//       console.log('✅ Đã kết nối MySQL thành công');
//     }
//   });
  
module.exports = pool;

