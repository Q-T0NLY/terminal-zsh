"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications] = useState([
    { id: 1, title: "Agent deployed successfully", time: "2m ago", type: "success" },
    { id: 2, title: "Workflow execution completed", time: "5m ago", type: "info" },
    { id: 3, title: "High memory usage detected", time: "10m ago", type: "warning" },
  ])

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" className="relative bg-transparent" onClick={() => setIsOpen(!isOpen)}>
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-16 right-4 z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="w-96 shadow-xl">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-96 overflow-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border-b last:border-0 hover:bg-accent">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
