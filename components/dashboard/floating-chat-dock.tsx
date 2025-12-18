"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function FloatingChatDock() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.div className="fixed bottom-6 right-6 z-50" initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="w-96 h-[500px] shadow-xl">
              <div className="p-4 border-b">
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <div className="p-4 h-[calc(100%-120px)] overflow-auto">
                <p className="text-sm text-muted-foreground">Chat interface coming soon...</p>
              </div>
              <div className="p-4 border-t">
                <input type="text" placeholder="Type a message..." className="w-full px-3 py-2 border rounded-md" />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
