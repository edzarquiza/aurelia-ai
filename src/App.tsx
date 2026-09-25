import { useState } from 'react'
import './App.css'
import AppNav from './components/AppNav'
import type { AppView } from './components/AppNav'
import OperationsPage from './pages/OperationsPage'
import InvoiceControlCenterPage from './pages/InvoiceControlCenterPage'

function App() {
  const [activeView, setActiveView] = useState<AppView>('operations')

  return (
    <div className="page">
      <AppNav activeView={activeView} onNavigate={setActiveView} />

      {activeView === 'operations' && <OperationsPage />}
      {activeView === 'invoice-control-center' && <InvoiceControlCenterPage />}
    </div>
  )
}

export default App
