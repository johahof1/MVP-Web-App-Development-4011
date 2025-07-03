import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'
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
  loading: false
}

function workflowReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_WORKFLOWS':
      return { ...state, workflows: action.payload }
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
    default:
      return state
  }
}

export const WorkflowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workflowReducer, initialState)
  const { user } = useAuth()

  // Load workflows from localStorage
  useEffect(() => {
    if (user) {
      const savedWorkflows = localStorage.getItem('n8n-saas-workflows')
      if (savedWorkflows) {
        dispatch({ type: 'SET_WORKFLOWS', payload: JSON.parse(savedWorkflows) })
      } else {
        // Create demo workflows
        const demoWorkflows = [
          {
            id: '1',
            name: 'Email Notification Workflow',
            description: 'Send email notifications when new users register',
            active: true,
            nodes: [
              { id: 'trigger', type: 'webhook', name: 'Webhook Trigger' },
              { id: 'email', type: 'email', name: 'Send Email' }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Data Sync Workflow',
            description: 'Sync data between CRM and database',
            active: false,
            nodes: [
              { id: 'schedule', type: 'schedule', name: 'Schedule Trigger' },
              { id: 'api', type: 'api', name: 'API Call' },
              { id: 'database', type: 'database', name: 'Database Update' }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Slack Integration',
            description: 'Post messages to Slack channels',
            active: true,
            nodes: [
              { id: 'trigger', type: 'webhook', name: 'Webhook Trigger' },
              { id: 'slack', type: 'slack', name: 'Slack Message' }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        dispatch({ type: 'SET_WORKFLOWS', payload: demoWorkflows })
        localStorage.setItem('n8n-saas-workflows', JSON.stringify(demoWorkflows))
      }
    }
  }, [user])

  // Save workflows to localStorage whenever they change
  useEffect(() => {
    if (state.workflows.length > 0) {
      localStorage.setItem('n8n-saas-workflows', JSON.stringify(state.workflows))
    }
  }, [state.workflows])

  const createWorkflow = async (workflowData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newWorkflow = {
        id: Date.now().toString(),
        ...workflowData,
        active: false,
        nodes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      dispatch({ type: 'ADD_WORKFLOW', payload: newWorkflow })
      toast.success('Workflow created successfully!')
      return newWorkflow
    } catch (error) {
      toast.error('Failed to create workflow')
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateWorkflow = async (id, workflowData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedWorkflow = {
        ...state.workflows.find(w => w.id === id),
        ...workflowData,
        updatedAt: new Date().toISOString()
      }
      
      dispatch({ type: 'UPDATE_WORKFLOW', payload: updatedWorkflow })
      toast.success('Workflow updated successfully!')
      return updatedWorkflow
    } catch (error) {
      toast.error('Failed to update workflow')
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const deleteWorkflow = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      dispatch({ type: 'DELETE_WORKFLOW', payload: id })
      toast.success('Workflow deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete workflow')
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const executeWorkflow = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const execution = {
        id: Date.now().toString(),
        workflow_id: id,
        workflow_name: state.workflows.find(w => w.id === id)?.name || 'Unknown',
        status: Math.random() > 0.2 ? 'success' : 'failed',
        created_at: new Date().toISOString()
      }
      
      // Add to executions
      const newExecutions = [execution, ...state.executions].slice(0, 10)
      dispatch({ type: 'SET_EXECUTIONS', payload: newExecutions })
      
      toast.success('Workflow executed successfully!')
      return execution
    } catch (error) {
      toast.error('Failed to execute workflow')
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const value = {
    ...state,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow
  }

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}