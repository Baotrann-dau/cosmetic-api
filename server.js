// server.js
require('dotenv').config();           // đọc file .env (nếu có)
const express = require('express');   // import Express
const cors = require('cors');         // cho phép gọi API từ app mobile
const db = require('./src/config/db'); // <--- import file kết nối DB
const expressListEndpoints = require('express-list-endpoints');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());  // parse JSON từ request body



// Test route
const testDbRoute = require('./src/routes/testDbRoute');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const orderItemsRoutes = require('./src/routes/orderItemsRoutes');

app.use('/test-db', testDbRoute); 
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemsRoutes);

// Route test để kiểm tra server
app.get('/', (req, res) => {
  res.send('Hello Cosmetic API!');
});

app.get('/debug/routes', (req,res)=>{
  res.json(expressListEndpoints(app));
});

app.get('/ping', (req, res) => res.send('pong'));


// Lấy PORT từ biến môi trường hoặc mặc định 3000
const PORT = process.env.PORT || 3000;
console.log('Server sẽ chạy ở cổng:', PORT);

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  console.log('📜 Routes đã mount:');

  const endpoints = expressListEndpoints(app);
  console.dir(endpoints, { depth: null });

  if (app._router && app._router.stack) {
    console.log('Mounted middlewares:', app._router.stack.length);
    console.dir(
      app._router.stack
        .filter(r => r.route)
        .map(r => ({ path: r.route.path, methods: Object.keys(r.route.methods) }))
    );
  } else {
    console.log('⚠️  app._router chưa sẵn sàng hoặc không tồn tại.');
  }
});


