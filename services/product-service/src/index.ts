import dotenv from 'dotenv';
import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';

import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productImageRoutes from './routes/imageRoutes'; 
import sizeRoutes from './routes/sizeRoutes';   
import productSizeRoutes from './routes/productSizeRoutes';   
import productTypeRoutes from './routes/typeRoutes';   
import promotionRoutes from './routes/promotionRoutes';       
import sizeTypeRoutes from './routes/sizeTypeRoutes';   
     
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('Product Service is healthy!');
});

// Sử dụng các routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/productImage', productImageRoutes); 
app.use('/api/size', sizeRoutes);   
app.use('/api/productSize', productSizeRoutes);   
app.use('/api/productType', productTypeRoutes);   
app.use('/api/promotion', promotionRoutes);       
app.use('/api/sizeType', sizeTypeRoutes);         


app.listen(PORT, () => {
  console.log(`Product service listening on: http://localhost:${PORT}`);
});
