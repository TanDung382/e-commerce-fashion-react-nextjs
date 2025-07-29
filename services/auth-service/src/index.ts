import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('Auth Service is healthy!');
});

// Use Auth Routes
app.use('/api/auth', authRoutes);

// Error handling middleware 
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong in Auth Service!', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Auth Service running on port http://localhost:${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});