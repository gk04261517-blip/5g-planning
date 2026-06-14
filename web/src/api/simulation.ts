import axios from 'axios'

const API_BASE = '/api/simulation'

export async function runCoverageSimulation(
  baseStations: number[][],
  resolution?: number,
  maxDistance?: number
) {
  const response = await axios.post(`${API_BASE}/coverage`, {
    baseStations,
    resolution,
    maxDistance,
  })
  return response.data
}

export async function runCapacitySimulation(
  baseStations: number[][],
  userLocations: number[][],
  bandwidth?: number
) {
  const response = await axios.post(`${API_BASE}/capacity`, {
    baseStations,
    userLocations,
    bandwidth,
  })
  return response.data
}

export async function runOptimization(
  areaSize: number[],
  numBs: number,
  iterations?: number
) {
  const response = await axios.post(`${API_BASE}/optimize`, {
    areaSize,
    numBs,
    iterations,
  })
  return response.data
}
