const db = require('../config/db');

exports.getAll = async (req, res) => {
  const [rows] = await db.query(`
    SELECT o.*, u.full_name AS user_name
    FROM orders o LEFT JOIN users u ON o.user_id = u.id
  `);
  res.json(rows);
};

exports.getOne = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE id=?', [req.params.id]);
  rows.length ? res.json(rows[0]) : res.status(404).json({message:'Order not found'});
};

exports.create = async (req, res) => {
  const { user_id, order_number, province_id, ward_id, address_detail,
          status, sub_total, discount, shipping_fee, total } = req.body;
  const [result] = await db.query(
    `INSERT INTO orders
     (user_id,order_number,province_id,ward_id,address_detail,status,sub_total,discount,shipping_fee,total)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [user_id,order_number,province_id,ward_id,address_detail,status,sub_total,discount,shipping_fee,total]
  );
  res.status(201).json({ id: result.insertId });
};
