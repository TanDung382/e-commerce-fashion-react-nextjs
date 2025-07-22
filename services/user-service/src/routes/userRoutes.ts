import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  res.json({ message: 'User service active' });
});

export default router;
