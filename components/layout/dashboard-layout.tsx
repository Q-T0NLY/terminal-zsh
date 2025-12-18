"use client"

import type { ReactNode } from "react"

interface DashboardLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      {sidebar}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
