import React from 'react'
import { Toaster } from 'react-hot-toast'
import { WorkflowProvider } from '../../context/WorkflowContext'
import ClientLayout from './ClientLayout'
import ClientDashboard from './ClientDashboard'

const ClientApp = () => {
  return (
    <WorkflowProvider>
      <div className="client-app">
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
        <ClientLayout>
          <ClientDashboard />
        </ClientLayout>
      </div>
    </WorkflowProvider>
  )
}

export default ClientApp