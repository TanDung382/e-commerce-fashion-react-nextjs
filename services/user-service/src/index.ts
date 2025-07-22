import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', apiRoutes);

app.listen(PORT, () => {
  console.log(`User service listening on: http://localhost:${PORT}`);
});
