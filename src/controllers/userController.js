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

exports.register = async (req, res) => {

    const { full_name, phone, email, password } = req.body;

    if (!full_name || !phone || !email || !password) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

    if (password.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu phải ít nhất 6 ký tự' });
  } 

  try {
    const [exist] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exist.length > 0) return res.status(400).json({ error: 'Email đã được sử dụng' });

    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (full_name,phone,email,password) VALUES (?,?,?,?)',
        [full_name, phone, email, hashed]);
    res.json({message: 'Đăng ký thành công'});
  } catch(err) {
    console.error('DB ERROR:', err);
    res.status(500).json({error: err.message});
  }
};

exports.login = async (req,res)=>{
  const {email,password} = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Thiếu email hoặc password' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email=?',[email]);
    if(rows.length === 0) return res.status(401).json({error:"Không tồn tại user"});

    const user = rows[0];
    // console.log('Plain password:', password);
    // console.log('Hash from DB:', user.password); 
      const valid = await bcrypt.compare(password,user.password);
    if(!valid) return res.status(401).json({error:"Sai mật khẩu"});

    const token = jwt.sign({id:user.id, role: user.role }, process.env.JWT_SECRET, {expiresIn:'7d'});
    res.json({token, role: user.role});
  } catch (err) {
    console.error('DB ERROR:', err.message, err);
    res.status(500).json({ error: 'Database error' });
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


