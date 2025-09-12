import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import kmrlLogo from '@assets/generated_images/KMRL_metro_logo_design_4b36d6ab.png'

export default function Header() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark)
    
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newTheme)
  }

  return (
    <header className="bg-card border-b border-card-border px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3" data-testid="header-logo">
          <img 
            src={kmrlLogo} 
            alt="KMRL Logo" 
            className="h-10 w-10 rounded-md"
          />
          <div>
            <h1 className="text-xl font-semibold text-foreground">KMRL</h1>
            <p className="text-sm text-muted-foreground">Document Management System</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  )
}