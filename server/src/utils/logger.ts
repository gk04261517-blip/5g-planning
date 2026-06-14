import winston from 'winston';

const { combine, timestamp, json, errors } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'wireless-simulation-server' },
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// 内存中的最近日志 (用于前端展示)
const recentLogs: any[] = [];
const MAX_LOGS = 1000;

// 添加内存日志存储
const memoryTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

// 拦截日志并存储到内存
const originalLog = logger.log.bind(logger);
logger.log = function(level: string, message: any, ...meta: any[]) {
  const logEntry = {
    level,
    message: typeof message === 'string' ? message : JSON.stringify(message),
    timestamp: new Date().toISOString(),
    meta: meta.length > 0 ? meta : undefined
  };

  recentLogs.push(logEntry);
  if (recentLogs.length > MAX_LOGS) {
    recentLogs.shift();
  }

  return originalLog(level, message, ...meta);
};

export function getRecentLogs(limit: number = 100): any[] {
  return recentLogs.slice(-limit);
}
