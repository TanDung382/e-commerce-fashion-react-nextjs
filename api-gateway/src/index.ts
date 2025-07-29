import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// Import router 
import authProxy from './routes/authProxy';
import userProxy from './routes/userProxy';

dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 

app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('API Gateway is running.');
});

// Sử dụng các router proxy 
app.use('/api/auth', authProxy);
app.use('/api/users', userProxy); 

// Xử lý lỗi 404 (Không tìm thấy route)
app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'API endpoint not found.' });
});

// Xử lý lỗi tổng quát
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => console.log(`API Gateway running on port http://localhost:${PORT}`));