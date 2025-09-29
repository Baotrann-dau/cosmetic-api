const db = require('../config/db');

exports.getByOrder = async (req, res) => {
  const [rows] = await db.query(
    `SELECT oi.*, p.name AS product_name
     FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id
     WHERE order_id=?`,
    [req.params.orderId]
  );
  res.json(rows);
};

exports.create = async (req, res) => {
  const { order_id, product_id, product_name, price, quantity } = req.body;
  const [result] = await db.query(
    `INSERT INTO order_items (order_id,product_id,product_name,price,quantity)
     VALUES (?,?,?,?,?)`,
    [order_id,product_id,product_name,price,quantity]
  );
  res.status(201).json({ id: result.insertId });
};
