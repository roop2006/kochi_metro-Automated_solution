import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GitBranch, ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiRequest, queryClient } from '@/lib/queryClient'
import { type WorkflowItem } from '@shared/schema'

interface WorkflowManagementProps {
  onBack: () => void
}

export default function WorkflowManagement({ onBack }: WorkflowManagementProps) {
  const { data: workflowItems = [], isLoading, error } = useQuery<WorkflowItem[]>({
    queryKey: ['/api/workflow'],
  })
  
  const updateWorkflowMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<WorkflowItem> }) => 
      fetch(`/api/workflow/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflow'] })
    }
  })

  const handleApprove = (itemId: string) => {
    const item = workflowItems.find((item: WorkflowItem) => item.id === itemId)
    if (!item) return
    
    const nextStage = item.currentStage === 'submitted' ? 'review' : 
                      item.currentStage === 'review' ? 'approved' : 'complete'
    
    console.log('Approve action triggered for:', itemId)
    updateWorkflowMutation.mutate({ id: itemId, updates: { currentStage: nextStage } })
  }

  const handleReject = (itemId: string) => {
    console.log('Reject action triggered for:', itemId)
    updateWorkflowMutation.mutate({ id: itemId, updates: { currentStage: 'submitted' } })
  }

  const stageOrder = ['submitted', 'review', 'approved', 'complete']
  const stageLabels = {
    'submitted': 'Submitted',
    'review': 'Review',
    'approved': 'Approved', 
    'complete': 'Complete'
  }
  
  const stageIcons = {
    'submitted': <Clock className="h-4 w-4" />,
    'review': <AlertTriangle className="h-4 w-4" />,
    'approved': <CheckCircle className="h-4 w-4" />,
    'complete': <CheckCircle className="h-4 w-4" />
  }
  
  const stageColors = {
    'submitted': 'bg-gray-500',
    'review': 'bg-orange-500',
    'approved': 'bg-blue-500',
    'complete': 'bg-green-500'
  }

  const pendingItems = workflowItems.filter((item: WorkflowItem) => item.currentStage !== 'complete')
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={onBack} data-testid="button-back-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={onBack} data-testid="button-back-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Failed to load workflow items</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} data-testid="button-back-dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              Workflow Management
            </CardTitle>
            <CardDescription>
              Review pending approvals and manage document workflows
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Approvals</CardTitle>
                <CardDescription>
                  {pendingItems.length} items require attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingItems.map((item: WorkflowItem) => (
                    <Card key={item.id} className="bg-muted/20" data-testid={`workflow-item-${item.id}`}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium">{item.title}</h3>
                                {item.priority === 'urgent' && (
                                  <Badge variant="destructive" className="text-xs">
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Department: {item.department}</span>
                                <span>Submitted: {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {stageIcons[item.currentStage]}
                                <span className="ml-1">{stageLabels[item.currentStage]}</span>
                              </Badge>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="destructive"
                                size="sm"
                                onClick={() => handleReject(item.id)}
                                data-testid={`button-reject-${item.id}`}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                              <Button 
                                variant="default"
                                size="sm"
                                onClick={() => handleApprove(item.id)}
                                data-testid={`button-approve-${item.id}`}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {pendingItems.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                      <p className="text-muted-foreground">
                        No pending approvals at this time.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow Stages</CardTitle>
                <CardDescription>
                  Document approval process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stageOrder.map((stage, index) => (
                    <div key={stage} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${stageColors[stage as keyof typeof stageColors]}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{stageLabels[stage as keyof typeof stageLabels]}</p>
                      </div>
                      {index < stageOrder.length - 1 && (
                        <div className="w-px h-6 bg-border ml-1.5 -mb-4"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}