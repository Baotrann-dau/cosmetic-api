const db = require('../config/db');

exports.getProvinces = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM provinces');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};


exports.getWardsByProvince = async (req, res) => {
  try {
    const { province_id } = req.params;
    const [rows] = await db.query('SELECT * FROM wards WHERE province_id = ?', [district_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};