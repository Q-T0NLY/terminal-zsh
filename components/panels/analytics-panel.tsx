"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsPanel({ widgets, onWidgetsChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">📊 Analytics</h2>
      <Card>
        <CardHeader>
          <CardTitle>System Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
