import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', orderRoutes);

app.listen(PORT, () => {
  console.log(`Product service listening on: http://localhost:${PORT}`);
});
