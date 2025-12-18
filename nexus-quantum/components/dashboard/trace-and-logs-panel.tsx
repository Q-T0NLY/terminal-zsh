"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TraceAndLogsPanelProps {
  events: any[]
  traces: any[]
}

export function TraceAndLogsPanel({ events, traces }: TraceAndLogsPanelProps) {
  return (
    <Card className="h-full p-4">
      <Tabs defaultValue="logs" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="traces">Traces</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="flex-1 mt-4">
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {events.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">No events yet</div>
              ) : (
                events.map((event, i) => (
                  <div key={i} className="border-b pb-2 text-xs">
                    <div className="text-muted-foreground">{new Date(event.ts || Date.now()).toLocaleTimeString()}</div>
                    <div className="mt-1">
                      {event.node || event.type}: {event.message || JSON.stringify(event.payload).slice(0, 100)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="traces" className="flex-1 mt-4">
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {traces.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">No traces yet</div>
              ) : (
                traces.map((trace, i) => (
                  <div key={i} className="border-b pb-2 text-xs">
                    <div className="font-medium">{trace.name}</div>
                    <div className="text-muted-foreground">Duration: {trace.duration_ms}ms</div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
