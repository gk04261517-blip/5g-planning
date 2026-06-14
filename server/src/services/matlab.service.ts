import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

interface CoverageParams {
  jobId: string;
  baseStations: number[][];
  resolution: number;
  maxDistance: number;
}

interface CapacityParams {
  jobId: string;
  baseStations: number[][];
  userLocations: number[][];
  bandwidth: number;
}

interface OptimizationParams {
  jobId: string;
  areaSize: number[];
  numBs: number;
  iterations: number;
}

export class MatlabService {
  private matlabPath: string;

  constructor() {
    this.matlabPath = process.env.MATLAB_PATH || 'matlab';
  }

  async runCoveragePrediction(params: CoverageParams): Promise<any> {
    const { jobId, baseStations, resolution, maxDistance } = params;

    // 构建 MATLAB 命令
    const bsStr = JSON.stringify(baseStations);
    const cmd = `${this.matlabPath} -batch "addpath('${process.cwd()}/../matlab'); bs=${bsStr}; [cov, xg, yg]=coverage_prediction(bs, ${resolution}, ${maxDistance}); disp(jsonencode(struct('coverage', cov, 'xGrid', xg, 'yGrid', yg)));"`;

    logger.info(`Running MATLAB coverage prediction: ${jobId}`);

    try {
      const { stdout } = await execAsync(cmd, { timeout: 120000 });
      const result = JSON.parse(stdout.trim());
      logger.info(`Coverage prediction completed: ${jobId}`);
      return result;
    } catch (error) {
      logger.error(`MATLAB coverage prediction failed: ${jobId}`, error);
      // 返回模拟数据作为 fallback
      return this.generateMockCoverage(baseStations, resolution, maxDistance);
    }
  }

  async runCapacityAnalysis(params: CapacityParams): Promise<any> {
    const { jobId, baseStations, userLocations, bandwidth } = params;

    const bsStr = JSON.stringify(baseStations);
    const userStr = JSON.stringify(userLocations);
    const cmd = `${this.matlabPath} -batch "addpath('${process.cwd()}/../matlab'); bs=${bsStr}; users=${userStr}; [cap, sinr]=capacity_analysis(bs, users, ${bandwidth}); disp(jsonencode(struct('capacity', cap, 'sinr', sinr)));"`;

    logger.info(`Running MATLAB capacity analysis: ${jobId}`);

    try {
      const { stdout } = await execAsync(cmd, { timeout: 120000 });
      const result = JSON.parse(stdout.trim());
      logger.info(`Capacity analysis completed: ${jobId}`);
      return result;
    } catch (error) {
      logger.error(`MATLAB capacity analysis failed: ${jobId}`, error);
      return this.generateMockCapacity(userLocations.length);
    }
  }

  async runOptimization(params: OptimizationParams): Promise<any> {
    const { jobId, areaSize, numBs, iterations } = params;

    const cmd = `${this.matlabPath} -batch "addpath('${process.cwd()}/../matlab'); [opt, cov]=parameter_optimization([${areaSize[0]}, ${areaSize[1]}], ${numBs}, ${iterations}); disp(jsonencode(struct('optimalParams', opt, 'coverage', cov)));"`;

    logger.info(`Running MATLAB optimization: ${jobId}`);

    try {
      const { stdout } = await execAsync(cmd, { timeout: 300000 });
      const result = JSON.parse(stdout.trim());
      logger.info(`Optimization completed: ${jobId}`);
      return result;
    } catch (error) {
      logger.error(`MATLAB optimization failed: ${jobId}`, error);
      return this.generateMockOptimization(numBs);
    }
  }

  private generateMockCoverage(baseStations: number[][], resolution: number, maxDistance: number): any {
    const gridSize = Math.ceil(maxDistance * 2 / resolution);
    return {
      coverage: Array(gridSize).fill(null).map(() => Array(gridSize).fill(0).map(() => Math.random() > 0.3 ? 1 : 0)),
      xGrid: Array(gridSize).fill(0).map((_, i) => i * resolution - maxDistance),
      yGrid: Array(gridSize).fill(0).map((_, i) => i * resolution - maxDistance),
      mock: true
    };
  }

  private generateMockCapacity(userCount: number): any {
    return {
      capacity: Array(userCount).fill(0).map(() => Math.random() * 100 + 10),
      sinr: Array(userCount).fill(0).map(() => Math.random() * 30 - 5),
      mock: true
    };
  }

  private generateMockOptimization(numBs: number): any {
    return {
      optimalParams: Array(numBs).fill(null).map(() => [Math.random() * 5000, Math.random() * 5000, 46]),
      coverage: 0.85 + Math.random() * 0.1,
      mock: true
    };
  }
}
