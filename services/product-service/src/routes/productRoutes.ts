import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  res.json({ message: 'Product route working!' });
});

export default router;
