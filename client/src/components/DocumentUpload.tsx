import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react'

interface DocumentUploadProps {
  onBack: () => void
}

export default function DocumentUpload({ onBack }: DocumentUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedFile, setProcessedFile] = useState<{
    name: string
    classification: string
    summary: string
    department: string
  } | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    console.log('File upload triggered:', file.name)
    setIsProcessing(true)
    setProcessedFile(null)
    
    //todo: remove mock functionality - integrate with real AI processing API
    setTimeout(() => {
      const mockResults = [
        {
          classification: 'Maintenance Report',
          summary: 'Weekly brake system inspection completed successfully for Train Car 205',
          department: 'Maintenance Department'
        },
        {
          classification: 'Safety Circular',
          summary: 'Updated platform safety guidelines and emergency procedures',
          department: 'Safety Department'
        },
        {
          classification: 'Vendor Invoice',
          summary: 'Track supplies and materials procurement invoice for Q1 2025',
          department: 'Finance Department'
        }
      ]
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setProcessedFile({
        name: file.name,
        ...randomResult
      })
      setIsProcessing(false)
    }, 2500)
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Document Upload
            </CardTitle>
            <CardDescription>
              Upload documents for AI-powered classification and routing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isProcessing && !processedFile && (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                data-testid="upload-dropzone"
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Drop files here</h3>
                <p className="text-muted-foreground mb-4">
                  Supports PDF, Word documents, and images
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
                <Button 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  data-testid="button-file-select"
                >
                  Select Files
                </Button>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                <h3 className="text-lg font-medium mb-2">Processing...</h3>
                <p className="text-muted-foreground">
                  AI is analyzing and classifying your document
                </p>
              </div>
            )}

            {processedFile && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Processing Complete</span>
                </div>
                
                <Card className="bg-muted/20">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">File Name</p>
                        <p className="font-medium">{processedFile.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Document Classification</p>
                        <Badge variant="secondary" className="mt-1">
                          {processedFile.classification}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Summary</p>
                        <p className="text-sm">{processedFile.summary}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Routed to</p>
                        <Badge variant="outline" className="mt-1">
                          {processedFile.department}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button 
                  onClick={() => setProcessedFile(null)} 
                  className="w-full"
                  data-testid="button-upload-another"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Another Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}