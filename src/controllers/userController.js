const db = require('../config/db');
const bcrypt = require('bcryptjs');
// bcrypt.hash('230203', 10).then(console.log);
// bcrypt.hash('000000', 10).then(console.log);
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
};

exports.getRegisteredUsers = async (req, res) => {
  try {
    // Lấy toàn bộ thông tin user
    const [rows] = await db.query('SELECT id, full_name, email, phone, password FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Thiếu token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const user = rows[0];
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Thiếu token" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { full_name, phone } = req.body;
    await db.query("UPDATE users SET full_name = ?, phone = ? WHERE id = ?", [
      full_name,
      phone,
      decoded.id,
    ]);

    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.id]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

