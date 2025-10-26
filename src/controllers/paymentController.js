const db = require('../config/db');

exports.getPaymentMethods = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM payments ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { order_id, provider, provider_payment_id, amount, currency, status } = req.body;
    if (!order_id || !amount) return res.status(400).json({ message: 'order_id and amount are required' });

    const [r] = await db.query(
        'INSERT INTO payments (order_id, provider, provider_payment_id, amount, currency, status, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', 
        [order_id, provider || null, provider_payment_id || null, amount, currency || 'USD', status || 'pending', null]
    );
    res.status(201).json({ id: r.insertId, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};