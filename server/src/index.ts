import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import simulationRoutes from './routes/simulation';
import modelRoutes from './routes/model';
import statusRoutes from './routes/status';
import logsRoutes from './routes/logs';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/simulation', simulationRoutes);
app.use('/api/model', modelRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/logs', logsRoutes);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
