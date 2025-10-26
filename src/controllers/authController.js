const db = require('../config/db');
const bcrypt = require('bcryptjs');
// bcrypt.hash('230203', 10).then(console.log);
// bcrypt.hash('000000', 10).then(console.log);
const jwt = require('jsonwebtoken');

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