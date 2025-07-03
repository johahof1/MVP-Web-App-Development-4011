import React, { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('n8n-saas-user')
    const savedProfile = localStorage.getItem('n8n-saas-profile')

    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser))
      setProfile(JSON.parse(savedProfile))
    }
    setLoading(false)
  }, [])

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser = {
        id: Date.now().toString(),
        email,
        created_at: new Date().toISOString()
      }

      const newProfile = {
        id: newUser.id,
        email,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        company: userData.company || '',
        token_count: 0,
        subscription_plan: 'free',
        role: 'user', // Default role
        created_at: new Date().toISOString()
      }

      // Save to localStorage
      localStorage.setItem('n8n-saas-user', JSON.stringify(newUser))
      localStorage.setItem('n8n-saas-profile', JSON.stringify(newProfile))

      setUser(newUser)
      setProfile(newProfile)

      toast.success('Account created successfully!')
      return { data: { user: newUser }, error: null }
    } catch (error) {
      toast.error(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const existingUser = localStorage.getItem('n8n-saas-user')
      const existingProfile = localStorage.getItem('n8n-saas-profile')

      if (existingUser && existingProfile) {
        const user = JSON.parse(existingUser)
        const profile = JSON.parse(existingProfile)

        if (user.email === email) {
          setUser(user)
          setProfile(profile)
          toast.success('Signed in successfully!')
          return { data: { user }, error: null }
        }
      }

      // Create demo user if none exists
      let userRole = 'user'
      
      // Demo: Set role based on email
      if (email.includes('client')) {
        userRole = 'client'
      } else if (email.includes('admin')) {
        userRole = 'admin'
      }

      const demoUser = {
        id: Date.now().toString(),
        email,
        created_at: new Date().toISOString()
      }

      const demoProfile = {
        id: demoUser.id,
        email,
        first_name: userRole === 'client' ? 'Client' : 'Demo',
        last_name: 'User',
        company: userRole === 'client' ? 'Client Company' : 'Demo Company',
        token_count: 150,
        subscription_plan: 'starter',
        role: userRole,
        created_at: new Date().toISOString()
      }

      localStorage.setItem('n8n-saas-user', JSON.stringify(demoUser))
      localStorage.setItem('n8n-saas-profile', JSON.stringify(demoProfile))

      setUser(demoUser)
      setProfile(demoProfile)

      toast.success('Signed in successfully!')
      return { data: { user: demoUser }, error: null }
    } catch (error) {
      toast.error(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('n8n-saas-user')
      localStorage.removeItem('n8n-saas-profile')
      localStorage.removeItem('n8n-saas-workflows')
      setUser(null)
      setProfile(null)
      toast.success('Signed out successfully!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const updateProfile = async (updates) => {
    try {
      const updatedProfile = { ...profile, ...updates }
      localStorage.setItem('n8n-saas-profile', JSON.stringify(updatedProfile))
      setProfile(updatedProfile)
      toast.success('Profile updated successfully!')
      return updatedProfile
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}