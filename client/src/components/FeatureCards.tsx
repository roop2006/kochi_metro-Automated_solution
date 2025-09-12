import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Search, QrCode, GitBranch, ArrowRight } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  onNavigate: () => void
}

function FeatureCard({ title, description, icon, onNavigate }: FeatureCardProps) {
  return (
    <Card className="hover-elevate cursor-pointer transition-all" onClick={onNavigate} data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="ghost" size="sm" className="w-full justify-between" data-testid={`button-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          Open Feature
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

interface FeatureCardsProps {
  onNavigateToUpload: () => void
  onNavigateToSearch: () => void
  onNavigateToScanner: () => void
  onNavigateToWorkflow: () => void
}

export default function FeatureCards({ onNavigateToUpload, onNavigateToSearch, onNavigateToScanner, onNavigateToWorkflow }: FeatureCardsProps) {
  const features = [
    {
      title: 'Document Upload',
      description: 'Upload and process documents with AI classification and routing',
      icon: <Upload className="h-6 w-6" />,
      onNavigate: onNavigateToUpload
    },
    {
      title: 'Smart Search',
      description: 'Search through documents with advanced filtering by department and type',
      icon: <Search className="h-6 w-6" />,
      onNavigate: onNavigateToSearch
    },
    {
      title: 'QR Scanner',
      description: 'Scan QR codes to quickly access maintenance records and job cards',
      icon: <QrCode className="h-6 w-6" />,
      onNavigate: onNavigateToScanner
    },
    {
      title: 'Workflow Management',
      description: 'Review pending approvals and manage document workflows efficiently',
      icon: <GitBranch className="h-6 w-6" />,
      onNavigate: onNavigateToWorkflow
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  )
}