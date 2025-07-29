import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse, isAxiosError } from 'axios';
import dotenv from 'dotenv';

dotenv.config(); 

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string; email: string }; 
    }
  }
}

interface AuthVerifyResponse {
    isValid: boolean;
    userId: string;
    role: string;
    email: string; 
}

const AUTH_SERVICE_INTERNAL_URL = process.env.AUTH_SERVICE_URL;

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        res.status(401).json({ message: 'Authorization token is required.' }); 
        return;  
  }

  try {
    // Sử dụng generic <AuthVerifyResponse> để chỉ định kiểu dữ liệu của response.data
    const response: AxiosResponse<AuthVerifyResponse> = await axios.post(
      `${AUTH_SERVICE_INTERNAL_URL}/api/auth/verify-token`,
      { token }
    );

    if (response.data.isValid) {
      // Nếu token hợp lệ, lưu thông tin người dùng vào req.user
      req.user = {
        id: response.data.userId,
        role: response.data.role,
        email: response.data.email 
      };
      next(); 
    } else {
        res.status(401).json({ message: 'Invalid or expired token.' });
        return;
    }
  } catch (error: any) {
    console.error('Error verifying token with Auth Service:', error.message);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Failed to authenticate token due to internal error.' });
    }
    return;
  }
};

// Middleware kiểm tra vai trò (cho các route yêu cầu quyền admin)
export const authorizeRoles = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
        res.status(403).json({ message: 'Access denied: User information missing.' }); // Lỗi logic
        return;
    }

    if (!requiredRoles.includes(req.user.role)) {
        res.status(403).json({ message: 'Access denied: Insufficient permissions.' }); // Không có quyền
        return;
    }
    next();
  };
};