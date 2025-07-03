import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiMenu, FiBell, FiUser, FiSettings, FiLogOut, FiChevronDown } = FiIcons

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiMenu} className="w-6 h-6 text-gray-600" />
          </button>
          
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N8</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              n8n SaaS
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Token Count */}
          <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
            <span className="text-sm text-gray-600">Tokens:</span>
            <span className="font-semibold text-gray-900">{profile?.token_count || 0}</span>
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
            <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {profile?.first_name || user?.email?.split('@')[0]}
              </span>
              <SafeIcon icon={FiChevronDown} className="w-4 h-4 text-gray-500" />
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  <SafeIcon icon={FiUser} className="w-4 h-4 mr-3" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  <SafeIcon icon={FiSettings} className="w-4 h-4 mr-3" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <SafeIcon icon={FiLogOut} className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header