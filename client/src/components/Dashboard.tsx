import { useState } from 'react'
import Header from './Header'
import StatsBar from './StatsBar' 
import FeatureCards from './FeatureCards'
import DocumentUpload from './DocumentUpload'
import SmartSearch from './SmartSearch'
import QRScanner from './QRScanner'
import WorkflowManagement from './WorkflowManagement'

type View = 'dashboard' | 'upload' | 'search' | 'scanner' | 'workflow'

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('dashboard')

  const navigateToUpload = () => {
    console.log('Navigating to document upload')
    setCurrentView('upload')
  }

  const navigateToSearch = () => {
    console.log('Navigating to smart search')
    setCurrentView('search')
  }

  const navigateToScanner = () => {
    console.log('Navigating to QR scanner')
    setCurrentView('scanner')
  }

  const navigateToWorkflow = () => {
    console.log('Navigating to workflow management')
    setCurrentView('workflow')
  }

  const backToDashboard = () => {
    console.log('Returning to dashboard')
    setCurrentView('dashboard')
  }

  if (currentView === 'upload') {
    return <DocumentUpload onBack={backToDashboard} />
  }

  if (currentView === 'search') {
    return <SmartSearch onBack={backToDashboard} />
  }

  if (currentView === 'scanner') {
    return <QRScanner onBack={backToDashboard} />
  }

  if (currentView === 'workflow') {
    return <WorkflowManagement onBack={backToDashboard} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8" data-testid="dashboard-main">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
            <p className="text-muted-foreground">
              Monitor document processing and manage workflows across all KMRL departments
            </p>
          </div>
          
          <StatsBar />
          
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6">Core Features</h3>
            <FeatureCards 
              onNavigateToUpload={navigateToUpload}
              onNavigateToSearch={navigateToSearch}
              onNavigateToScanner={navigateToScanner}
              onNavigateToWorkflow={navigateToWorkflow}
            />
          </div>
        </div>
      </main>
    </div>
  )
}