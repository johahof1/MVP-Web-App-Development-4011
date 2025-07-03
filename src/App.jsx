import React, { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WorkflowProvider } from './context/WorkflowContext'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import Dashboard from './components/dashboard/Dashboard'
import WorkflowList from './components/workflows/WorkflowList'
import BillingPage from './components/billing/BillingPage'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return user ? <Navigate to="/dashboard" /> : children
}

// Main App Layout
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex pt-16">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <WorkflowProvider>
        <Router>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <LoginForm />
                  </div>
                </PublicRoute>
              } />
              
              <Route path="/register" element={
                <PublicRoute>
                  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <RegisterForm />
                  </div>
                </PublicRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/workflows" element={
                <ProtectedRoute>
                  <AppLayout>
                    <WorkflowList />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/billing" element={
                <ProtectedRoute>
                  <AppLayout>
                    <BillingPage />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </WorkflowProvider>
    </AuthProvider>
  )
}

export default App