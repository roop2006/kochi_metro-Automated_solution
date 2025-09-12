import DocumentUpload from '../DocumentUpload'

export default function DocumentUploadExample() {
  const mockBack = () => console.log('Back navigation triggered')
  
  return <DocumentUpload onBack={mockBack} />
}