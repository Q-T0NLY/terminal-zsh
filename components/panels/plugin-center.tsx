"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PluginCenter({ widgets, onWidgetsChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">🔌 Plugins</h2>
      <Card>
        <CardHeader>
          <CardTitle>Plugin Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Plugin center coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
