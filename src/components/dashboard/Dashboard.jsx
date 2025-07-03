import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useWorkflow } from '../../context/WorkflowContext'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const { FiZap, FiPlay, FiClock, FiTrendingUp, FiPlus, FiActivity, FiKey, FiLink, FiSettings } = FiIcons

const Dashboard = () => {
  const { user, profile } = useAuth()
  const { workflows, loading, executions } = useWorkflow()
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    totalExecutions: 0,
    activeWorkflows: 0,
    tokensUsed: 0
  })
  const [executionData, setExecutionData] = useState([])

  useEffect(() => {
    if (workflows.length > 0) {
      const totalWorkflows = workflows.length
      const totalExecutions = executions.length
      const activeWorkflows = workflows.filter(w => w.active).length
      const tokensUsed = profile?.token_count || 0

      setStats({ totalWorkflows, totalExecutions, activeWorkflows, tokensUsed })

      // Generate execution chart data
      const chartData = generateExecutionChartData()
      setExecutionData(chartData)
    }
  }, [workflows, executions, profile])

  const generateExecutionChartData = () => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Generate random execution data for demo
      const dayExecutions = Math.floor(Math.random() * 10) + 1
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        executions: dayExecutions
      })
    }
    return last7Days
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
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.first_name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your automation workflows
          </p>
        </div>
        <Link
          to="/workflows/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>New Workflow</span>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkflows}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiZap} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Executions</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalExecutions}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiPlay} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activeWorkflows}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tokens Used</p>
              <p className="text-2xl font-bold text-orange-600">{stats.tokensUsed}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={executionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="executions" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Workflows */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Workflows</h3>
          </div>
          <div className="p-6">
            {workflows.length > 0 ? (
              <div className="space-y-4">
                {workflows.slice(0, 5).map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(workflow.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          workflow.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {workflow.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiClock} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No workflows yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/workflows"
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <SafeIcon icon={FiZap} className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Workflows</span>
          </Link>

          <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
            <SafeIcon icon={FiKey} className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Credential</span>
          </div>

          <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
            <SafeIcon icon={FiLink} className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Create Webhook</span>
          </div>

          <Link
            to="/settings"
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <SafeIcon icon={FiSettings} className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard