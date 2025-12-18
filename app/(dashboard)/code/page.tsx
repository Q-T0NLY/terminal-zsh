"use client"

import dynamic from "next/dynamic"
import { PageContainer } from "@/components/layout/page-container"

const CodeWorkspace = dynamic(
  () => import("@/components/code/code-workspace").then((mod) => ({ default: mod.CodeWorkspace })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading code workspace...</p>
        </div>
      </div>
    ),
  },
)

export default function CodePage() {
  return (
    <PageContainer>
      <CodeWorkspace />
    </PageContainer>
  )
}
