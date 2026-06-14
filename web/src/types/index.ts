export interface BaseStation {
  x: number
  y: number
  power: number
}

export interface UserLocation {
  x: number
  y: number
}

export interface CoverageResult {
  coverage: number[][]
  xGrid: number[]
  yGrid: number[]
  mock?: boolean
}

export interface CapacityResult {
  capacity: number[]
  sinr: number[]
  mock?: boolean
}

export interface OptimizationResult {
  optimalParams: number[][]
  coverage: number
  mock?: boolean
}

export interface SimulationJob {
  jobId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  type: 'coverage' | 'capacity' | 'optimization'
  result?: any
  error?: string
  createdAt: string
}

export interface LogEntry {
  level: string
  message: string
  timestamp: string
  meta?: any
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ModelInfo {
  id: string
  name: string
  description: string
}
