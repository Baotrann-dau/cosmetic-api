const db = require('../config/db');

exports.getAllCoupons = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM coupons WHERE is_active = 1');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.validateCoupon = async (req, res) => {
  const { code } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM coupons WHERE code = ? AND is_active = 1', [code]);
    if (!rows.length) return res.status(404).json({ message: 'Mã không hợp lệ' });

    const coupon = rows[0];
    res.json({ valid: true, coupon });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};