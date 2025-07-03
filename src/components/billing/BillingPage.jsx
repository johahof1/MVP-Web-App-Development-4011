import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Elements } from '@stripe/react-stripe-js'
import stripePromise from '../../lib/stripe'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiCreditCard, FiCheck, FiX, FiDollarSign, FiCalendar, FiTrendingUp } = FiIcons

const BillingPage = () => {
  const { user, profile } = useAuth()
  const [currentPlan, setCurrentPlan] = useState('free')
  const [billingHistory, setBillingHistory] = useState([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        '100 workflow executions/month',
        '5 active workflows',
        'Basic integrations',
        'Email support'
      ],
      limitations: [
        'Limited execution time',
        'Basic webhook support'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      interval: 'month',
      features: [
        '1,000 workflow executions/month',
        '25 active workflows',
        'All integrations',
        'Priority support',
        'Custom webhooks',
        'Advanced scheduling'
      ],
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      interval: 'month',
      features: [
        '10,000 workflow executions/month',
        'Unlimited active workflows',
        'All integrations',
        '24/7 support',
        'Custom nodes',
        'Advanced analytics',
        'Team collaboration'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      interval: 'month',
      features: [
        'Unlimited executions',
        'Unlimited workflows',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Advanced security',
        'Custom deployment'
      ]
    }
  ]

  useEffect(() => {
    loadBillingData()
  }, [user])

  const loadBillingData = async () => {
    // Load current subscription and billing history
    // This would typically come from your backend/Stripe
    setCurrentPlan(profile?.subscription_plan || 'free')
  }

  const handleUpgrade = (planId) => {
    setShowUpgradeModal(true)
    // Implement Stripe checkout
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
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600 mt-1">Manage your subscription and billing information</p>
        </div>
      </motion.div>

      {/* Current Plan */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {plans.find(p => p.id === currentPlan)?.name}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Cost</p>
              <p className="text-xl font-bold text-gray-900">
                ${plans.find(p => p.id === currentPlan)?.price || 0}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tokens Used</p>
              <p className="text-xl font-bold text-gray-900">{profile?.token_count || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiCalendar} className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Billing</p>
              <p className="text-xl font-bold text-gray-900">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pricing Plans */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Plans</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-6 ${
                plan.popular 
                  ? 'border-blue-500 bg-blue-50' 
                  : currentPlan === plan.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              {currentPlan === plan.id && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-600">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <SafeIcon icon={FiX} className="w-5 h-5 text-red-500 mt-0.5" />
                    <span className="text-sm text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={currentPlan === plan.id}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  currentPlan === plan.id
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Billing History */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.length > 0 ? (
                billingHistory.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-600">{item.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.description}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">${item.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No billing history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BillingPage