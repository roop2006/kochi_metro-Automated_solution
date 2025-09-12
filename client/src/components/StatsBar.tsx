import { Card } from '@/components/ui/card'
import { FileText, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'orange' | 'green' | 'red'
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'text-primary',
    orange: 'text-orange-500',
    green: 'text-green-500',
    red: 'text-red-500'
  }

  return (
    <Card className="p-4 hover-elevate" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
        </div>
        <div className={`${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

interface StatsData {
  documents_processed: number
  pending_approvals: number
  completed_today: number
  urgent_items: number
}

export default function StatsBar() {
  const { data: statsData, isLoading, error } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !statsData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="p-4 col-span-full">
          <p className="text-center text-muted-foreground">Failed to load statistics</p>
        </Card>
      </div>
    )
  }

  const stats = [
    { 
      title: 'Documents Processed', 
      value: statsData.documents_processed || 0, 
      icon: <FileText className="h-8 w-8" />, 
      color: 'blue' as const 
    },
    { 
      title: 'Pending Approvals', 
      value: statsData.pending_approvals || 0, 
      icon: <Clock className="h-8 w-8" />, 
      color: 'orange' as const 
    },
    { 
      title: 'Completed Today', 
      value: statsData.completed_today || 0, 
      icon: <CheckCircle className="h-8 w-8" />, 
      color: 'green' as const 
    },
    { 
      title: 'Urgent Items', 
      value: statsData.urgent_items || 0, 
      icon: <AlertCircle className="h-8 w-8" />, 
      color: 'red' as const 
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}