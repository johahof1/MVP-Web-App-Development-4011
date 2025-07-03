import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { 
  FiHome, FiZap, FiSettings, FiKey, FiLink, FiX, FiUsers, FiCreditCard, FiBarChart3, FiShield 
} = FiIcons

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const { profile } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Workflows', href: '/workflows', icon: FiZap },
    { name: 'Credentials', href: '/credentials', icon: FiKey },
    { name: 'Webhooks', href: '/webhooks', icon: FiLink },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart3 },
    { name: 'Billing', href: '/billing', icon: FiCreditCard },
    { name: 'Settings', href: '/settings', icon: FiSettings }
  ]

  // Add admin routes for admin users
  if (profile?.role === 'admin') {
    navigation.push(
      { name: 'Admin Panel', href: '/admin', icon: FiShield },
      { name: 'Users', href: '/admin/users', icon: FiUsers }
    )
  }

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 mt-16 lg:mt-0">
            <div className="flex items-center space-x-2 lg:hidden">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N8</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">n8n SaaS</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <SafeIcon icon={FiX} className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <SafeIcon 
                    icon={item.icon} 
                    className={`w-5 h-5 mr-3 ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`} 
                  />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar