import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  res.json({ message: 'Order route working!' });
});

export default router;
