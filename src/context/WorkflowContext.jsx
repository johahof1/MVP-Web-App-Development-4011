import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import N8nApiClient from '../lib/n8n-api'
import toast from 'react-hot-toast'

const WorkflowContext = createContext()

export const useWorkflow = () => {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}

const initialState = {
  workflows: [],
  currentWorkflow: null,
  executions: [],
  credentials: [],
  webhooks: [],
  loading: false,
  n8nClient: null
}

function workflowReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_N8N_CLIENT':
      return { ...state, n8nClient: action.payload }
    case 'SET_WORKFLOWS':
      return { ...state, workflows: action.payload }
    case 'SET_CURRENT_WORKFLOW':
      return { ...state, currentWorkflow: action.payload }
    case 'ADD_WORKFLOW':
      return { ...state, workflows: [...state.workflows, action.payload] }
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(w => 
          w.id === action.payload.id ? action.payload : w
        )
      }
    case 'DELETE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.filter(w => w.id !== action.payload)
      }
    case 'SET_EXECUTIONS':
      return { ...state, executions: action.payload }
    case 'SET_CREDENTIALS':
      return { ...state, credentials: action.payload }
    case 'ADD_CREDENTIAL':
      return { ...state, credentials: [...state.credentials, action.payload] }
    case 'UPDATE_CREDENTIAL':
      return {
        ...state,
        credentials: state.credentials.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      }
    case 'DELETE_CREDENTIAL':
      return {
        ...state,
        credentials: state.credentials.filter(c => c.id !== action.payload)
      }
    case 'SET_WEBHOOKS':
      return { ...state, webhooks: action.payload }
    case 'ADD_WEBHOOK':
      return { ...state, webhooks: [...state.webhooks, action.payload] }
    case 'DELETE_WEBHOOK':
      return {
        ...state,
        webhooks: state.webhooks.filter(w => w.id !== action.payload)
      }
    default:
      return state
  }
}

export const WorkflowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workflowReducer, initialState)
  const { user, profile } = useAuth()

  // Initialize n8n client when user profile is available
  useEffect(() => {
    if (profile?.n8n_api_key && profile?.n8n_instance_url) {
      const client = new N8nApiClient(profile.n8n_instance_url, profile.n8n_api_key)
      dispatch({ type: 'SET_N8N_CLIENT', payload: client })
    }
  }, [profile])

  // Load workflows when client is ready
  useEffect(() => {
    if (state.n8nClient) {
      loadWorkflows()
      loadCredentials()
      loadWebhooks()
    }
  }, [state.n8nClient])

  const loadWorkflows = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const workflows = await state.n8nClient.getWorkflows()
      dispatch({ type: 'SET_WORKFLOWS', payload: workflows })
    } catch (error) {
      toast.error('Failed to load workflows')
      console.error('Error loading workflows:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createWorkflow = async (workflowData) => {
    try {
      const workflow = await state.n8nClient.createWorkflow(workflowData)
      dispatch({ type: 'ADD_WORKFLOW', payload: workflow })
      
      // Save to database for tracking
      await saveWorkflowToDatabase(workflow)
      
      toast.success('Workflow created successfully!')
      return workflow
    } catch (error) {
      toast.error('Failed to create workflow')
      throw error
    }
  }

  const updateWorkflow = async (id, workflowData) => {
    try {
      const workflow = await state.n8nClient.updateWorkflow(id, workflowData)
      dispatch({ type: 'UPDATE_WORKFLOW', payload: workflow })
      toast.success('Workflow updated successfully!')
      return workflow
    } catch (error) {
      toast.error('Failed to update workflow')
      throw error
    }
  }

  const deleteWorkflow = async (id) => {
    try {
      await state.n8nClient.deleteWorkflow(id)
      dispatch({ type: 'DELETE_WORKFLOW', payload: id })
      
      // Remove from database
      await removeWorkflowFromDatabase(id)
      
      toast.success('Workflow deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete workflow')
      throw error
    }
  }

  const executeWorkflow = async (id, data = {}) => {
    try {
      const execution = await state.n8nClient.executeWorkflow(id, data)
      
      // Update token count
      await updateTokenCount(1)
      
      toast.success('Workflow executed successfully!')
      return execution
    } catch (error) {
      toast.error('Failed to execute workflow')
      throw error
    }
  }

  const loadCredentials = async () => {
    try {
      const credentials = await state.n8nClient.getCredentials()
      dispatch({ type: 'SET_CREDENTIALS', payload: credentials })
    } catch (error) {
      console.error('Error loading credentials:', error)
    }
  }

  const createCredential = async (credentialData) => {
    try {
      const credential = await state.n8nClient.createCredential(credentialData)
      dispatch({ type: 'ADD_CREDENTIAL', payload: credential })
      toast.success('Credential created successfully!')
      return credential
    } catch (error) {
      toast.error('Failed to create credential')
      throw error
    }
  }

  const updateCredential = async (id, credentialData) => {
    try {
      const credential = await state.n8nClient.updateCredential(id, credentialData)
      dispatch({ type: 'UPDATE_CREDENTIAL', payload: credential })
      toast.success('Credential updated successfully!')
      return credential
    } catch (error) {
      toast.error('Failed to update credential')
      throw error
    }
  }

  const deleteCredential = async (id) => {
    try {
      await state.n8nClient.deleteCredential(id)
      dispatch({ type: 'DELETE_CREDENTIAL', payload: id })
      toast.success('Credential deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete credential')
      throw error
    }
  }

  const loadWebhooks = async () => {
    try {
      const webhooks = await state.n8nClient.getWebhooks()
      dispatch({ type: 'SET_WEBHOOKS', payload: webhooks })
    } catch (error) {
      console.error('Error loading webhooks:', error)
    }
  }

  const createWebhook = async (webhookData) => {
    try {
      const webhook = await state.n8nClient.createWebhook(webhookData)
      dispatch({ type: 'ADD_WEBHOOK', payload: webhook })
      toast.success('Webhook created successfully!')
      return webhook
    } catch (error) {
      toast.error('Failed to create webhook')
      throw error
    }
  }

  const deleteWebhook = async (id) => {
    try {
      await state.n8nClient.deleteWebhook(id)
      dispatch({ type: 'DELETE_WEBHOOK', payload: id })
      toast.success('Webhook deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete webhook')
      throw error
    }
  }

  const saveWorkflowToDatabase = async (workflow) => {
    try {
      await supabase.from('workflows').insert({
        id: workflow.id,
        user_id: user.id,
        name: workflow.name,
        data: workflow,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error saving workflow to database:', error)
    }
  }

  const removeWorkflowFromDatabase = async (workflowId) => {
    try {
      await supabase.from('workflows').delete().eq('id', workflowId)
    } catch (error) {
      console.error('Error removing workflow from database:', error)
    }
  }

  const updateTokenCount = async (count) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          token_count: (profile.token_count || 0) + count 
        })
        .eq('id', user.id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating token count:', error)
    }
  }

  const value = {
    ...state,
    loadWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow,
    loadCredentials,
    createCredential,
    updateCredential,
    deleteCredential,
    loadWebhooks,
    createWebhook,
    deleteWebhook
  }

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}