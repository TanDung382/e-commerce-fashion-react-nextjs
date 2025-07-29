import { Router } from 'express';
import { createUserProfile } from '../controllers/userController';

const router = Router();

// Endpoint cho Auth Service gọi để tạo user profile
router.post('/profiles', createUserProfile as any);


export default router;