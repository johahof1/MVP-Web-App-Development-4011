import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkflow } from '../../context/WorkflowContext'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiPlus, FiSearch, FiEdit2, FiTrash2, FiPlay, FiPause, FiCopy, FiMoreVertical } = FiIcons

const WorkflowList = () => {
  const { workflows, loading, deleteWorkflow, executeWorkflow } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredWorkflows, setFilteredWorkflows] = useState([])
  const [showActionMenu, setShowActionMenu] = useState(null)

  useEffect(() => {
    if (searchTerm) {
      setFilteredWorkflows(
        workflows.filter(workflow =>
          workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredWorkflows(workflows)
    }
  }, [workflows, searchTerm])

  const handleExecute = async (workflowId) => {
    try {
      await executeWorkflow(workflowId)
    } catch (error) {
      console.error('Error executing workflow:', error)
    }
  }

  const handleDelete = async (workflowId) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteWorkflow(workflowId)
      } catch (error) {
        console.error('Error deleting workflow:', error)
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-1">Manage your automation workflows</p>
        </div>
        <Link
          to="/workflows/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>New Workflow</span>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Workflows Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredWorkflows.map((workflow) => (
            <motion.div
              key={workflow.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{workflow.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{workflow.description || 'No description'}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      workflow.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.active ? 'Active' : 'Inactive'}
                    </span>
                    <span>Updated: {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setShowActionMenu(showActionMenu === workflow.id ? null : workflow.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
                  </button>
                  
                  {showActionMenu === workflow.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        onClick={() => handleExecute(workflow.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <SafeIcon icon={FiPlay} className="w-4 h-4 mr-3" />
                        Execute
                      </button>
                      <Link
                        to={`/workflows/${workflow.id}/edit`}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-3" />
                        Edit
                      </Link>
                      <button
                        onClick={() => {/* Handle duplicate */}}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <SafeIcon icon={FiCopy} className="w-4 h-4 mr-3" />
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleDelete(workflow.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExecute(workflow.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiPlay} className="w-3 h-3" />
                    <span>Run</span>
                  </button>
                  <Link
                    to={`/workflows/${workflow.id}/edit`}
                    className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </Link>
                </div>
                <div className="text-xs text-gray-500">
                  {workflow.nodes?.length || 0} nodes
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
        >
          <SafeIcon icon={FiZap} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No workflows found' : 'No workflows yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by creating your first automation workflow'
            }
          </p>
          <Link
            to="/workflows/new"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Create Workflow</span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}

export default WorkflowList