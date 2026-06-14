import { Router } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// 系统状态
router.get('/', (req, res) => {
  const status = {
    server: 'running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  };
  res.json(status);
});

// MATLAB 引擎状态
router.get('/matlab', (req, res) => {
  // 这里可以检查 MATLAB 引擎是否可用
  res.json({
    matlab: 'available',
    engine: 'connected',
    version: 'R2023b'
  });
});

export default router;
