import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || '5002', 10); 

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('User Service is healthy!');
});

// Use User Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong in User Service!', error: err.message });
});

app.listen(PORT, () => {
    console.log(`User Service running on port http://localhost:${PORT}`);
});