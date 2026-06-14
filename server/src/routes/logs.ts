import { Router } from 'express';
import { logger, getRecentLogs } from '../utils/logger';

const router = Router();

// 获取最近日志
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const logs = getRecentLogs(limit);
    res.json({ logs, count: logs.length });
  } catch (error) {
    logger.error('Failed to get logs:', error);
    res.status(500).json({ error: 'Failed to get logs' });
  }
});

// 获取日志级别统计
router.get('/stats', (req, res) => {
  try {
    const logs = getRecentLogs(1000);
    const stats = {
      error: logs.filter((l: any) => l.level === 'error').length,
      warn: logs.filter((l: any) => l.level === 'warn').length,
      info: logs.filter((l: any) => l.level === 'info').length,
      debug: logs.filter((l: any) => l.level === 'debug').length,
    };
    res.json(stats);
  } catch (error) {
    logger.error('Failed to get log stats:', error);
    res.status(500).json({ error: 'Failed to get log stats' });
  }
});

export default router;
