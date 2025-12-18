"use client"

import { Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LeftPalette() {
  return (
    <div className="p-4 border-b">
      <div className="space-y-2">
        <Link href="/create-agent">
          <Button className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Agent
          </Button>
        </Link>
        <Button variant="outline" className="w-full bg-transparent" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  )
}
