import axios from 'axios'

const API_BASE = '/api/model'

export async function chatWithModel(
  message: string,
  context?: any[],
  modelType?: string
) {
  const response = await axios.post(`${API_BASE}/chat`, {
    message,
    context,
    modelType,
  })
  return response.data
}

export async function getModelList() {
  const response = await axios.get(`${API_BASE}/list`)
  return response.data
}
