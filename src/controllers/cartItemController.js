const db = require('../config/db');

// Thêm sản phẩm vào giỏ
exports.addItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { product_id, quantity, price } = req.body;
    if (!userId || !product_id || !quantity) {
      return res.status(400).json({ message: 'Thiếu dữ liệu' });
    }

    // Tìm giỏ hàng (nếu chưa có thì tạo mới)
    let [cartRows] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    let cartId;
    if (cartRows.length === 0) {
      const [insertResult] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      cartId = insertResult.insertId;
    } else {
      cartId = cartRows[0].id;
    }

    // Kiểm tra nếu sản phẩm đã có trong giỏ
    const [exist] = await db.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, product_id]);
    if (exist.length > 0) {
      const newQty = exist[0].quantity + quantity;
      await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, exist[0].id]);
      return res.json({ message: 'Cập nhật số lượng thành công' });
    }

    // Thêm mới sản phẩm
    await db.query('INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [cartId, product_id, quantity, price]);
    res.json({ message: 'Đã thêm sản phẩm vào giỏ hàng' });
  } catch (err) {
    console.error('addItem error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Cập nhật số lượng
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, id]);
    res.json({ message: 'Cập nhật giỏ hàng thành công' });
  } catch (err) {
    console.error('updateItem error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Xóa sản phẩm khỏi giỏ
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM cart_items WHERE id = ?', [id]);
    res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
  } catch (err) {
    console.error('deleteItem error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
