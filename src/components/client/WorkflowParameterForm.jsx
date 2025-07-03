import React from 'react'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiType, FiHash, FiToggleLeft, FiCalendar, FiMail, FiLink, FiList, FiFileText, FiSliders } = FiIcons

const WorkflowParameterForm = ({ workflow, formData, onInputChange }) => {
  // Mock workflow parameters based on n8n field types
  const workflowParameters = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter email address',
      description: 'The email address to send notifications to'
    },
    {
      name: 'subject',
      label: 'Email Subject',
      type: 'string',
      required: true,
      placeholder: 'Enter email subject',
      description: 'Subject line for the email'
    },
    {
      name: 'priority',
      label: 'Priority Level',
      type: 'options',
      required: false,
      options: [
        { value: 'low', label: 'Low Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'high', label: 'High Priority' },
        { value: 'urgent', label: 'Urgent' }
      ],
      description: 'Set the priority level for this workflow'
    },
    {
      name: 'schedule_time',
      label: 'Schedule Time',
      type: 'datetime',
      required: false,
      description: 'When to execute this workflow'
    },
    {
      name: 'webhook_url',
      label: 'Webhook URL',
      type: 'url',
      required: false,
      placeholder: 'https://example.com/webhook',
      description: 'URL to send webhook notifications'
    },
    {
      name: 'retry_count',
      label: 'Retry Count',
      type: 'number',
      required: false,
      min: 0,
      max: 10,
      default: 3,
      description: 'Number of retry attempts on failure'
    },
    {
      name: 'enable_notifications',
      label: 'Enable Notifications',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Send notifications when workflow completes'
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'multiselect',
      required: false,
      options: [
        { value: 'urgent', label: 'Urgent' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'sales', label: 'Sales' },
        { value: 'support', label: 'Support' },
        { value: 'development', label: 'Development' }
      ],
      description: 'Add tags to categorize this workflow'
    },
    {
      name: 'message',
      label: 'Custom Message',
      type: 'textarea',
      required: false,
      placeholder: 'Enter your custom message here...',
      description: 'Custom message to include in notifications'
    },
    {
      name: 'data_source',
      label: 'Data Source',
      type: 'json',
      required: false,
      placeholder: '{"key": "value"}',
      description: 'JSON data to pass to the workflow'
    }
  ]

  const renderField = (param) => {
    const fieldId = `field-${param.name}`
    const value = formData[param.name] || param.default || ''

    const fieldWrapper = (children) => (
      <div key={param.name} className="space-y-2">
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
          <div className="flex items-center space-x-2">
            {getFieldIcon(param.type)}
            <span>{param.label}</span>
            {param.required && <span className="text-red-500">*</span>}
          </div>
        </label>
        {children}
        {param.description && (
          <p className="text-xs text-gray-500">{param.description}</p>
        )}
      </div>
    )

    switch (param.type) {
      case 'string':
      case 'email':
      case 'url':
        return fieldWrapper(
          <input
            id={fieldId}
            type={param.type === 'email' ? 'email' : param.type === 'url' ? 'url' : 'text'}
            value={value}
            onChange={(e) => onInputChange(param.name, e.target.value)}
            placeholder={param.placeholder}
            required={param.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )

      case 'number':
        return fieldWrapper(
          <input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => onInputChange(param.name, parseInt(e.target.value) || 0)}
            min={param.min}
            max={param.max}
            required={param.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )

      case 'boolean':
        return fieldWrapper(
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => onInputChange(param.name, !value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-600">
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        )

      case 'options':
        return fieldWrapper(
          <select
            id={fieldId}
            value={value}
            onChange={(e) => onInputChange(param.name, e.target.value)}
            required={param.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            {param.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : []
        return fieldWrapper(
          <div className="space-y-2">
            {param.options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(v => v !== option.value)
                    onInputChange(param.name, newValues)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'datetime':
        return fieldWrapper(
          <input
            id={fieldId}
            type="datetime-local"
            value={value}
            onChange={(e) => onInputChange(param.name, e.target.value)}
            required={param.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )

      case 'textarea':
        return fieldWrapper(
          <textarea
            id={fieldId}
            value={value}
            onChange={(e) => onInputChange(param.name, e.target.value)}
            placeholder={param.placeholder}
            required={param.required}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )

      case 'json':
        return fieldWrapper(
          <textarea
            id={fieldId}
            value={value}
            onChange={(e) => onInputChange(param.name, e.target.value)}
            placeholder={param.placeholder}
            required={param.required}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
        )

      default:
        return null
    }
  }

  const getFieldIcon = (type) => {
    const iconMap = {
      string: FiType,
      email: FiMail,
      url: FiLink,
      number: FiHash,
      boolean: FiToggleLeft,
      options: FiList,
      multiselect: FiList,
      datetime: FiCalendar,
      textarea: FiFileText,
      json: FiSliders
    }
    
    const IconComponent = iconMap[type] || FiType
    return <SafeIcon icon={IconComponent} className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Workflow Parameters</h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure the parameters for this workflow execution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflowParameters.map(renderField)}
      </div>

      {/* Workflow Steps Preview */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Workflow Steps</h4>
        <div className="space-y-3">
          {workflow.nodes?.map((node, index) => (
            <div key={node.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{node.name}</h5>
                <p className="text-sm text-gray-500">{node.type}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WorkflowParameterForm