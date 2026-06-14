import axios from 'axios'

const API_BASE = '/api/logs'

export async function getLogs(limit?: number) {
  const response = await axios.get(`${API_BASE}`, {
    params: { limit },
  })
  return response.data
}

export async function getLogStats() {
  const response = await axios.get(`${API_BASE}/stats`)
  return response.data
}
