import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service listening on: http://localhost:${PORT}`);
});
