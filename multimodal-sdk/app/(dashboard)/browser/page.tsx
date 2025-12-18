"use client"

import { BrowserPanel } from "@/components/browser/browser-panel"

export default function BrowserPage() {
  return (
    <div className="p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Browser Panel</h1>
          <p className="text-muted-foreground">Live web rendering, scraping, summarization, and visual reasoning</p>
        </div>

        <BrowserPanel />
      </div>
    </div>
  )
}
