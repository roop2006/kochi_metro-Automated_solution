import QRScanner from '../QRScanner'

export default function QRScannerExample() {
  const mockBack = () => console.log('Back navigation triggered')
  
  return <QRScanner onBack={mockBack} />
}