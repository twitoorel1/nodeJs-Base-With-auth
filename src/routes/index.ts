import express from 'express';
import formatUptime from '@/utils/dates.util';
import { authMiddleware } from '@/middlewares/auth.middleware';
const router = express.Router();

import authRoutes from './auth.routes';

router.get('/', (req, res) => {
	res.json({
		status: 'OK',
		uptime: formatUptime(process.uptime())
	});
});

router.use('/auth', authRoutes);
router.use('/some', authMiddleware, authRoutes);

export default router;
