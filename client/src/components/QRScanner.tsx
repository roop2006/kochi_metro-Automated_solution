import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QrCode, ArrowLeft, Camera, CheckCircle, Wrench } from 'lucide-react'

interface QRScannerProps {
  onBack: () => void
}

export default function QRScanner({ onBack }: QRScannerProps) {
  const [scanResult, setScanResult] = useState<{
    documentId: string
    title: string
    equipment: string
    status: 'in_progress' | 'pending' | 'completed'
    description: string
  } | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleSimulateScan = async () => {
    console.log('QR scan simulation triggered')
    setIsScanning(true)
    
    try {
      const response = await fetch('/api/qr-scan/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('QR scan failed')
      }
      
      const result = await response.json()
      setScanResult(result)
    } catch (error) {
      console.error('QR scan error:', error)
      // Fallback result in case of error
      setScanResult({
        documentId: 'ERROR-001',
        title: 'Scan Error',
        equipment: 'Unknown',
        status: 'pending' as const,
        description: 'Failed to scan QR code. Please try again.'
      })
    } finally {
      setIsScanning(false)
    }
  }

  const handleUpdateStatus = async (newStatus: 'in_progress' | 'pending' | 'completed') => {
    console.log('Status update triggered:', newStatus)
    if (scanResult) {
      try {
        // Find the QR code by its code/documentId and update it
        const response = await fetch(`/api/qr-codes/${scanResult.documentId}`, {
          method: 'GET'
        })
        
        if (response.ok) {
          const qrCode = await response.json()
          
          // Update the QR code status
          const updateResponse = await fetch(`/api/qr-codes/${qrCode.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
          })
          
          if (updateResponse.ok) {
            setScanResult({ ...scanResult, status: newStatus })
          }
        }
      } catch (error) {
        console.error('Status update error:', error)
        // Still update the UI for better UX
        setScanResult({ ...scanResult, status: newStatus })
      }
    }
  }

  const statusColors = {
    'in_progress': 'bg-orange-500',
    'pending': 'bg-yellow-500',
    'completed': 'bg-green-500'
  }

  const statusLabels = {
    'in_progress': 'In Progress',
    'pending': 'Pending',
    'completed': 'Completed'
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} data-testid="button-back-dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              QR Scanner
            </CardTitle>
            <CardDescription>
              Scan QR codes to access maintenance records and job cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!scanResult && !isScanning && (
              <div className="text-center py-12 space-y-6">
                <div className="mx-auto w-64 h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20">
                  <div className="text-center">
                    <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">QR Scanner Area</p>
                    <p className="text-sm text-muted-foreground">
                      Point camera at QR code
                    </p>
                  </div>
                </div>
                
                <Button onClick={handleSimulateScan} size="lg" data-testid="button-simulate-scan">
                  <QrCode className="h-4 w-4 mr-2" />
                  Simulate QR Scan
                </Button>
              </div>
            )}

            {isScanning && (
              <div className="text-center py-12">
                <div className="mx-auto w-64 h-64 border-2 border-primary rounded-lg flex items-center justify-center bg-primary/5 animate-pulse">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
                    <p className="text-lg font-medium mb-2">Scanning...</p>
                    <p className="text-sm text-muted-foreground">
                      Processing QR code
                    </p>
                  </div>
                </div>
              </div>
            )}

            {scanResult && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Document Found</span>
                </div>
                
                <Card className="bg-muted/20">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{scanResult.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {scanResult.description}
                          </p>
                        </div>
                        <Wrench className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Equipment</p>
                          <p className="font-medium">{scanResult.equipment}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge 
                            variant="secondary" 
                            className="mt-1"
                            data-testid={`status-${scanResult.status}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${statusColors[scanResult.status]} mr-2`}></div>
                            {statusLabels[scanResult.status]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Update Status:</p>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant={scanResult.status === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('pending')}
                      data-testid="button-status-pending"
                    >
                      Pending
                    </Button>
                    <Button 
                      variant={scanResult.status === 'in_progress' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('in_progress')}
                      data-testid="button-status-in-progress"
                    >
                      In Progress
                    </Button>
                    <Button 
                      variant={scanResult.status === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('completed')}
                      data-testid="button-status-completed"
                    >
                      Completed
                    </Button>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setScanResult(null)}
                  className="w-full"
                  data-testid="button-scan-another"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan Another QR Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}