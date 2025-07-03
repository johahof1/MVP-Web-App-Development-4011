import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMenu, FiBell, FiUser } = FiIcons;

function Header({ sidebarOpen, setSidebarOpen }) {
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
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              TaskFlow
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
            <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;