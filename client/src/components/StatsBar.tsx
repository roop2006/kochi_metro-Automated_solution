import { Card } from '@/components/ui/card'
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'

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

export default function StatsBar() {
  //todo: remove mock functionality - replace with real stats from API
  const stats = [
    { title: 'Documents Processed', value: 2847, icon: <FileText className="h-8 w-8" />, color: 'blue' as const },
    { title: 'Pending Approvals', value: 23, icon: <Clock className="h-8 w-8" />, color: 'orange' as const },
    { title: 'Completed Today', value: 156, icon: <CheckCircle className="h-8 w-8" />, color: 'green' as const },
    { title: 'Urgent Items', value: 7, icon: <AlertCircle className="h-8 w-8" />, color: 'red' as const },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}