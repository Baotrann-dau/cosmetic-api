const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query('SELECT id, name, slug, description, parent_id FROM categories WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Category not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { name, slug, description } = req.body;
  const [result] = await db.query(
    'INSERT INTO categories (name,slug,description) VALUES (?,?)',
    [name,slug,description]
  );
  res.status(201).json({ id: result.insertId });
};

