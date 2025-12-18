"use client"
import { motion } from "framer-motion"
import { X, Star, Download, Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ExtensionDetailsPanelProps {
  extension: any
  onClose: () => void
  onUpdate: (updates: any) => void
}

export function ExtensionDetailsPanel({ extension, onClose, onUpdate }: ExtensionDetailsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{extension.icon || "⚡"}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{extension.name}</h3>
                  <p className="text-muted-foreground">{extension.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" fill="currentColor" />
                      <span>{extension.rating}</span>
                    </div>
                    <span>{extension.downloads} installs</span>
                    <span>v{extension.version}</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {extension.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-accent rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-2">Performance</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${extension.performance}%` }} />
                  </div>
                  <span className="text-sm font-medium">{extension.performance}%</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <Download size={16} />
                  Install Extension
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                  <Settings size={16} />
                  Configure
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
