import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', productRoutes);

app.listen(PORT, () => {
  console.log(`Product service listening on: http://localhost:${PORT}`);
});
