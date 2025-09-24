// src/controllers/productController.js
const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products'); 
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
};

exports.getById = async (req,res)=>{
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id=?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
};

exports.create = async (req, res) => {
  const { name, price, description } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Thiếu thông tin sản phẩm' });
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, price, description) VALUES (?,?,?)',
      [name, price, description || null]
    );
    res.json({ id: result.insertId, name, price, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database insert error' });
  }
};

exports.update = async (req, res) => {
  const { name, price, description } = req.body;
  try {
    await db.query(
      'UPDATE products SET name=?, price=?, description=? WHERE id=?',
      [name, price, description, req.params.id]
    );
    res.json({ message: 'Cập nhật sản phẩm thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error' });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database delete error' });
  }
};