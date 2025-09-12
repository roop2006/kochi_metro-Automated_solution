import FeatureCards from '../FeatureCards'

export default function FeatureCardsExample() {
  const mockNavigate = () => console.log('Navigation triggered')
  
  return (
    <div className="p-6 bg-background">
      <FeatureCards 
        onNavigateToUpload={mockNavigate}
        onNavigateToSearch={mockNavigate}
        onNavigateToScanner={mockNavigate}
        onNavigateToWorkflow={mockNavigate}
      />
    </div>
  )
}