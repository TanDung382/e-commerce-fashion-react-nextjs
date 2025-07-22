import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import invtRoutes from './routes/inventoryRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', invtRoutes);

app.listen(PORT, () => {
  console.log(`Inventory service listening on: http://localhost:${PORT}`);
});
