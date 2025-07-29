import { Router } from 'express';
import { register, login, verifyToken} from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login as any);
router.post('/verify-token', verifyToken as any);

router.get('/health', (req, res) => {
  res.status(200).send('Auth Service Health Check via Auth Router!');
});

export default router;