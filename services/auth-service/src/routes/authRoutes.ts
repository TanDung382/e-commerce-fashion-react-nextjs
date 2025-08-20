import { Router } from 'express';
import { register, login, verifyToken} from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-token', verifyToken);

router.get('/health', (req, res) => {
  res.status(200).send('Auth Service Health Check via Auth Router!');
});

export default router;