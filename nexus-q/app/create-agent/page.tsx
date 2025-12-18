"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const AgentCreationScreen = dynamic(() => import("@/components/agent-creation/agent-creation-screen"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0f111a] to-[#121420] flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md p-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  ),
})

export default function CreateAgentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#0f111a] to-[#121420] flex items-center justify-center">
          <div className="text-white">Loading Agent Creation Interface...</div>
        </div>
      }
    >
      <AgentCreationScreen />
    </Suspense>
  )
}
