import axios from 'axios'

class N8nApiClient {
  constructor(baseURL, apiKey) {
    this.client = axios.create({
      baseURL: baseURL || 'https://n8n.example.com/api/v1',
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Content-Type': 'application/json'
      }
    })
  }

  // Workflows
  async getWorkflows() {
    const response = await this.client.get('/workflows')
    return response.data
  }

  async getWorkflow(id) {
    const response = await this.client.get(`/workflows/${id}`)
    return response.data
  }

  async createWorkflow(workflow) {
    const response = await this.client.post('/workflows', workflow)
    return response.data
  }

  async updateWorkflow(id, workflow) {
    const response = await this.client.put(`/workflows/${id}`, workflow)
    return response.data
  }

  async deleteWorkflow(id) {
    const response = await this.client.delete(`/workflows/${id}`)
    return response.data
  }

  async executeWorkflow(id, data = {}) {
    const response = await this.client.post(`/workflows/${id}/execute`, data)
    return response.data
  }

  // Executions
  async getExecutions(workflowId) {
    const response = await this.client.get(`/executions?workflowId=${workflowId}`)
    return response.data
  }

  async getExecution(id) {
    const response = await this.client.get(`/executions/${id}`)
    return response.data
  }

  // Credentials
  async getCredentials() {
    const response = await this.client.get('/credentials')
    return response.data
  }

  async createCredential(credential) {
    const response = await this.client.post('/credentials', credential)
    return response.data
  }

  async updateCredential(id, credential) {
    const response = await this.client.put(`/credentials/${id}`, credential)
    return response.data
  }

  async deleteCredential(id) {
    const response = await this.client.delete(`/credentials/${id}`)
    return response.data
  }

  // Webhooks
  async createWebhook(webhook) {
    const response = await this.client.post('/webhooks', webhook)
    return response.data
  }

  async getWebhooks() {
    const response = await this.client.get('/webhooks')
    return response.data
  }

  async deleteWebhook(id) {
    const response = await this.client.delete(`/webhooks/${id}`)
    return response.data
  }
}

export default N8nApiClient