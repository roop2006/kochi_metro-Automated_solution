import WorkflowManagement from '../WorkflowManagement'

export default function WorkflowManagementExample() {
  const mockBack = () => console.log('Back navigation triggered')
  
  return <WorkflowManagement onBack={mockBack} />
}