const db = require('../config/db');

// Lấy giỏ hàng của user (gồm các sản phẩm bên trong)
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Lấy giỏ hàng
    const [cartRows] = await db.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (cartRows.length === 0) return res.status(200).json({ items: [] });

    const cartId = cartRows[0].id;

    // Lấy chi tiết sản phẩm trong giỏ
    const [items] = await db.query(`
      SELECT ci.id, ci.product_id, p.name, p.main_image_url, ci.quantity, ci.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cartId]);

    res.json({
      cart_id: cartId,
      total_items: items.reduce((sum, i) => sum + i.quantity, 0),
      total_price: Number(items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)),
      items
    });
  } catch (err) {
    console.error('getCart error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { product_id, quantity } = req.body;
    if (!product_id) return res.status(400).json({ message: 'product_id required' });

    const [carts] = await db.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    let cartId;
    if (!carts.length) {
      const [r] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      cartId = r.insertId;
    } else cartId = carts[0].id;

    const [p] = await db.query('SELECT price FROM products WHERE id = ?', [product_id]);
    if (!p.length) return res.status(404).json({ message: 'Product not found' });

    const [exists] = await db.query('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, product_id]);
    if (exists.length) {
      await db.query('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity || 1, exists[0].id]);
    } else {
      // get price from product
      const [p] = await db.query('SELECT price FROM products WHERE id = ?', [product_id]);
      const price = p.length ? p[0].price : 0;
      await db.query('INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [cartId, product_id, quantity || 1, price]);
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { cart_item_id, quantity } = req.body;
    if (!cart_item_id) return res.status(400).json({ message: 'cart_item_id required' });
    await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, cart_item_id]);
    res.json({ success: true });

    if (quantity <= 0) {
        await db.query('DELETE FROM cart_items WHERE id = ?', [cart_item_id]);
        return res.json({ message: 'Item removed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🧩 Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const [cart] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (cart.length === 0) return res.status(200).json({ message: 'Cart already empty' });

    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('clearCart error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};