import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowLeft, FileText, Calendar, Building2, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface SearchResult {
  id: string
  title: string
  department: string
  date: string
  summary: string
  type: 'maintenance' | 'safety' | 'finance' | 'hr'
}

interface SmartSearchProps {
  onBack: () => void
}

export default function SmartSearch({ onBack }: SmartSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  
  const { data: searchResultsData, isLoading, error } = useQuery<SearchResult[]>({
    queryKey: ['/api/documents/search', searchQuery, activeFilter],
    queryFn: () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append('q', searchQuery)
      if (activeFilter !== 'all') params.append('type', activeFilter)
      return fetch(`/api/documents/search?${params}`).then(res => res.json())
    }
  })
  
  // Ensure searchResults is always an array
  const searchResults = Array.isArray(searchResultsData) ? searchResultsData : []

  const filters = [
    { id: 'all', label: 'All Documents' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'safety', label: 'Safety' },
    { id: 'finance', label: 'Finance' },
    { id: 'hr', label: 'HR' }
  ]

  const handleSearch = () => {
    console.log('Search triggered:', searchQuery)
  }

  const handleFilterClick = (filterId: string) => {
    console.log('Filter selected:', filterId)
    setActiveFilter(filterId)
  }

  const handleResultClick = (result: SearchResult) => {
    console.log('Document selected:', result.title)
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
              <Search className="h-5 w-5 text-primary" />
              Smart Search
            </CardTitle>
            <CardDescription>
              Search through KMRL documents with advanced filtering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
                data-testid="input-search"
              />
              <Button onClick={handleSearch} data-testid="button-search">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterClick(filter.id)}
                  data-testid={`button-filter-${filter.id}`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Failed to load search results</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-sm text-muted-foreground" data-testid="search-results-count">
                {searchResults.length} documents found
              </div>
              
              {searchResults.length > 0 ? searchResults.map((result: SearchResult) => (
                <Card 
                  key={result.id} 
                  className="hover-elevate cursor-pointer" 
                  onClick={() => handleResultClick(result)}
                  data-testid={`card-result-${result.id}`}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">{result.title}</h3>
                          <p className="text-sm text-muted-foreground">{result.summary}</p>
                        </div>
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {result.department}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(result.date).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {result.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No documents found</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}