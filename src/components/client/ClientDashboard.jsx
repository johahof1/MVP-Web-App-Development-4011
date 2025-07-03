import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWorkflow } from '../../context/WorkflowContext'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import toast from 'react-hot-toast'

const { FiPlay, FiClock, FiCheckCircle, FiAlertCircle, FiSettings, FiEye, FiFilter, FiSearch } = FiIcons

const ClientDashboard = () => {
  const { workflows, loading, executeWorkflow, executions } = useWorkflow()
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredWorkflows, setFilteredWorkflows] = useState([])

  useEffect(() => {
    let filtered = workflows.filter(workflow => workflow.active)
    
    if (searchTerm) {
      filtered = filtered.filter(workflow =>
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(workflow => workflow.status === statusFilter)
    }

    setFilteredWorkflows(filtered)
  }, [workflows, searchTerm, statusFilter])

  const handleExecuteWorkflow = async (workflowId) => {
    try {
      await executeWorkflow(workflowId)
      toast.success('Workflow executed successfully!')
    } catch (error) {
      toast.error('Failed to execute workflow')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'running': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 p-4 lg:p-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workflow Dashboard</h1>
            <p className="text-gray-600 mt-2">Execute and monitor your automated workflows</p>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="running">Running</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Workflows Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <motion.div
            key={workflow.id}
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedWorkflow(workflow)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{workflow.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{workflow.description || 'No description'}</p>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                  <span className="text-xs text-gray-500">
                    {workflow.nodes?.length || 0} steps
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Updated: {new Date(workflow.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedWorkflow(workflow)
                  }}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <SafeIcon icon={FiEye} className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleExecuteWorkflow(workflow.id)
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <SafeIcon icon={FiPlay} className="w-3 h-3" />
                  <span>Execute</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Executions */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Executions</h3>
          </div>
          <div className="p-6">
            {executions.length > 0 ? (
              <div className="space-y-4">
                {executions.slice(0, 5).map((execution) => (
                  <div key={execution.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        execution.status === 'success' ? 'bg-green-500' : 
                        execution.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{execution.workflow_name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(execution.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                      {execution.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiClock} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No executions yet</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Workflow Detail Modal */}
      {selectedWorkflow && (
        <WorkflowDetailModal
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
          onExecute={handleExecuteWorkflow}
        />
      )}
    </motion.div>
  )
}

// Workflow Detail Modal Component
const WorkflowDetailModal = ({ workflow, onClose, onExecute }) => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  const handleExecute = async () => {
    setLoading(true)
    try {
      await onExecute(workflow.id, formData)
      onClose()
    } catch (error) {
      toast.error('Failed to execute workflow')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{workflow.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiSettings} className="w-5 h-5 rotate-45" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">{workflow.description}</p>
        </div>

        <div className="p-6">
          <WorkflowParameterForm
            workflow={workflow}
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlay} className="w-4 h-4" />
            <span>{loading ? 'Executing...' : 'Execute Workflow'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ClientDashboard