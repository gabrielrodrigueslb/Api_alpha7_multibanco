import { Router } from 'express';

const router = Router();

router.get('/', async (__dirname, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
  });
});

export default router