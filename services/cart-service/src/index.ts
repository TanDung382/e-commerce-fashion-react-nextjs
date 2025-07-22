import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cartRoutes from './routes/cartRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', cartRoutes);

app.listen(PORT, () => {
  console.log(`Cart service listening on: http://localhost:${PORT}`);
});
