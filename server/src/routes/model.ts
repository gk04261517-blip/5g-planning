import { Router } from 'express';
import { logger } from '../utils/logger';
import { ModelRouterService } from '../services/model-router.service';

const router = Router();
const modelService = new ModelRouterService();

// 模型对话接口
router.post('/chat', async (req, res) => {
  try {
    const { message, context, modelType } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    logger.info(`Model chat request: ${modelType || 'default'}`);

    const response = await modelService.chat({
      message,
      context: context || [],
      modelType: modelType || 'default'
    });

    res.json({ response, modelType: modelType || 'default' });
  } catch (error) {
    logger.error('Model chat failed:', error);
    res.status(500).json({ error: 'Chat failed', details: (error as Error).message });
  }
});

// 获取可用模型列表
router.get('/list', async (req, res) => {
  try {
    const models = await modelService.listModels();
    res.json({ models });
  } catch (error) {
    logger.error('List models failed:', error);
    res.status(500).json({ error: 'Failed to list models' });
  }
});

export default router;
