"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Search, Eye, FileText, Sparkles, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function BrowserPanel() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<any>(null)

  const handleScrape = async () => {
    if (!url) return
    setLoading(true)

    try {
      const response = await fetch("/api/browser/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error("Scrape error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSummarize = async () => {
    if (!content) return
    setLoading(true)

    try {
      const response = await fetch("/api/browser/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.text }),
      })

      const data = await response.json()
      setContent({ ...content, summary: data.summary, insights: data.insights })
    } catch (error) {
      console.error("Summarize error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-400" />
          Browser Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter URL to scrape..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScrape()}
          />
          <Button onClick={handleScrape} disabled={loading || !url}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Scrape
          </Button>
        </div>

        {content && (
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="content">
                <FileText className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="summary">
                <Sparkles className="h-4 w-4 mr-2" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Sparkles className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <div className="aspect-video border rounded-lg overflow-hidden bg-muted">
                {url && (
                  <iframe src={url} className="w-full h-full" title="Browser Preview" sandbox="allow-same-origin" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="content">
              <ScrollArea className="h-96 border rounded-lg p-4">
                <div className="space-y-2">
                  <div>
                    <Badge>Title</Badge>
                    <p className="mt-2 font-semibold">{content.title}</p>
                  </div>
                  <div>
                    <Badge>Description</Badge>
                    <p className="mt-2 text-sm text-muted-foreground">{content.description}</p>
                  </div>
                  <div>
                    <Badge>Content</Badge>
                    <pre className="mt-2 text-xs whitespace-pre-wrap">{content.text?.substring(0, 1000)}...</pre>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="summary">
              <Card>
                <CardContent className="pt-6">
                  {content.summary ? (
                    <p className="text-sm">{content.summary}</p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">No summary generated yet.</p>
                      <Button onClick={handleSummarize} disabled={loading}>
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Generate Summary
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card>
                <CardContent className="pt-6">
                  {content.insights ? (
                    <ul className="space-y-2">
                      {content.insights.map((insight: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-yellow-400 mt-0.5" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">No insights generated yet.</p>
                      <Button onClick={handleSummarize} disabled={loading}>
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Generate Insights
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
