import { Request, Response } from 'express';
import authService from '../services/authService';
import { generateToken } from '../services/authService';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config'; 
import { User } from '../models/authModel';


export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  const provider: 'local' | 'google' | 'facebook' = 'local';
  try {
    const newUser = await authService.registerUser(name, email, password, role, provider);
      res.status(201).json({
          message: 'User registered successfully',
          user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
  } catch (error: any) {
    console.error('Error in register controller:', error.message);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password, provider, oauthToken } = req.body;
  try {
    let user: User | null = null;

    if (provider === 'google' || provider === 'facebook') {
      // Logic cho đăng nhập Google/Facebook
      if (!email || !oauthToken) {
        res.status(400).json({ message: `Email and OAuth token are required for ${provider} login.` });
        return;
      }
      user = await authService.authenticateOAuthUser(email, provider, oauthToken); 
    } else { // Mặc định là 'local' nếu không có provider hoặc provider là 'local'
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required for local login.' });
        return;
      }
      user = await authService.authenticateUser(email, password); 
    }

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id, user.role, user.email, user.name);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error: any) {
    console.error('Error in login controller:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ isValid: false, message: 'Token is required for verification.' });
    return;
  }

  try {
    // Sử dụng JWT_SECRET từ config trực tiếp
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; name: string; email: string; iat: number; exp: number };
    res.status(200).json({
      isValid: true,
      userId: decoded.id,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
      message: 'Token is valid.'
    });
    return;
  } catch (err: any) {
    console.error('Token verification failed:', err.message);
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({ isValid: false, message: 'Token has expired.' });
    }
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ isValid: false, message: 'Invalid token.' });
    }
    res.status(401).json({ isValid: false, message: 'Token verification failed.' });
    return;
  }
};