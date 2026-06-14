import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { MatlabService } from '../services/matlab.service';

const router = Router();
const matlabService = new MatlabService();

// 运行覆盖预测仿真
router.post('/coverage', async (req, res) => {
  try {
    const { baseStations, resolution, maxDistance } = req.body;
    const jobId = uuidv4();

    logger.info(`Starting coverage simulation: ${jobId}`);

    const result = await matlabService.runCoveragePrediction({
      jobId,
      baseStations,
      resolution: resolution || 50,
      maxDistance: maxDistance || 5000
    });

    res.json({ jobId, status: 'completed', result });
  } catch (error) {
    logger.error('Coverage simulation failed:', error);
    res.status(500).json({ error: 'Simulation failed', details: (error as Error).message });
  }
});

// 运行容量分析仿真
router.post('/capacity', async (req, res) => {
  try {
    const { baseStations, userLocations, bandwidth } = req.body;
    const jobId = uuidv4();

    logger.info(`Starting capacity simulation: ${jobId}`);

    const result = await matlabService.runCapacityAnalysis({
      jobId,
      baseStations,
      userLocations,
      bandwidth: bandwidth || 20
    });

    res.json({ jobId, status: 'completed', result });
  } catch (error) {
    logger.error('Capacity simulation failed:', error);
    res.status(500).json({ error: 'Simulation failed', details: (error as Error).message });
  }
});

// 运行参数优化
router.post('/optimize', async (req, res) => {
  try {
    const { areaSize, numBs, iterations } = req.body;
    const jobId = uuidv4();

    logger.info(`Starting optimization: ${jobId}`);

    const result = await matlabService.runOptimization({
      jobId,
      areaSize,
      numBs,
      iterations: iterations || 100
    });

    res.json({ jobId, status: 'completed', result });
  } catch (error) {
    logger.error('Optimization failed:', error);
    res.status(500).json({ error: 'Optimization failed', details: (error as Error).message });
  }
});

export default router;
