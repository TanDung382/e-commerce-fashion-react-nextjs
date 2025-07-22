import express from 'express';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4001;

app.get('/', (_, res) => {
  res.send('API Gateway is running.');
});

app.use('/api/auth', createProxyMiddleware({ 
  target: process.env.AUTH_SERVICE_URL || 'http://auth-service:5000', 
  changeOrigin: true 
}));

app.use('/api/products', createProxyMiddleware({ 
  target: process.env.PRODUCT_SERVICE_URL || 'http://product-service:5001', 
  changeOrigin: true 
}));

app.use('/api/users', createProxyMiddleware({ 
  target: process.env.USER_SERVICE_URL || 'http://user-service:5002', 
  changeOrigin: true 
}));

app.use('/api/cart', createProxyMiddleware({ 
  target: process.env.CART_SERVICE_URL || 'http://cart-service:5003', 
  changeOrigin: true 
}));

app.use('/api/order', createProxyMiddleware({ 
  target: process.env.ORDER_SERVICE_URL || 'http://order-service:5004', 
  changeOrigin: true 
}));

app.use('/api/inventory', createProxyMiddleware({ 
  target: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:5005', 
  changeOrigin: true 
}));

app.listen(PORT, () => console.log(`API Gateway running on port http://localhost:${PORT}`));
