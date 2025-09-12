import SmartSearch from '../SmartSearch'

export default function SmartSearchExample() {
  const mockBack = () => console.log('Back navigation triggered')
  
  return <SmartSearch onBack={mockBack} />
}