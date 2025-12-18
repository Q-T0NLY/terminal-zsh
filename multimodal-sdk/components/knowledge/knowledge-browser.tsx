"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, FileText, LinkIcon, Brain } from "lucide-react"
import { searchKnowledge } from "@/lib/api/knowledge"
import { LoadingDots } from "@/components/ui/loading-dots"
import { EmptyState } from "@/components/ui/empty-state"

export function KnowledgeBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const { data, error, isLoading } = useSWR("/api/knowledge", fetcher)

  async function handleSearch() {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchKnowledge(searchQuery)
      setSearchResults(results.results || [])
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const displayItems = searchResults.length > 0 ? searchResults : data?.knowledge || []

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Knowledge Base
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <LoadingDots /> : "Search"}
          </Button>
        </div>
      </Card>

      {/* Results */}
      <Card className="flex-1 p-4">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingDots />
            </div>
          ) : displayItems.length === 0 ? (
            <EmptyState
              icon={Brain}
              title="No knowledge found"
              description="Add knowledge to your base or refine your search"
            />
          ) : (
            <div className="space-y-4">
              {displayItems.map((item: any) => (
                <Card key={item.id} className="p-4 hover:bg-accent cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === "document" && <FileText className="h-4 w-4" />}
                        {item.type === "link" && <LinkIcon className="h-4 w-4" />}
                        {item.type === "note" && <Brain className="h-4 w-4" />}
                        <h3 className="font-medium">{item.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{item.type}</Badge>
                        {item.tags?.map((tag: string) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {item.similarity && <Badge variant="secondary">{Math.round(item.similarity * 100)}% match</Badge>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  )
}
