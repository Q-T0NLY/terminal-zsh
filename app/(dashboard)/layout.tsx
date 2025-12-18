import type { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyan-950/5 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large animated gradient orbs */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-cyan-400/40 rounded-full animate-float" />
        <div
          className="absolute top-40 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float"
          style={{ animationDelay: "0.5s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-pink-400/30 rounded-full animate-float"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-green-400/30 rounded-full animate-float"
          style={{ animationDelay: "1.5s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-yellow-400/20 rounded-full animate-float"
          style={{ animationDelay: "2s", animationDuration: "4.5s" }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      <div className="flex relative z-10">
        <Sidebar />

        {/* Main Content with enhanced backdrop */}
        <main className="flex-1 relative">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
