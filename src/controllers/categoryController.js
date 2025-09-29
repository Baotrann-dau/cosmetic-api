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

exports.create = async (req, res) => {
  const { name, slug, description } = req.body;
  const [result] = await db.query(
    'INSERT INTO categories (name,slug,description) VALUES (?,?)',
    [name,slug,description]
  );
  res.status(201).json({ id: result.insertId });
};
