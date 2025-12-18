"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Save, Mic, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

export function AdvancedEditor({ widgets, onWidgetsChange }: any) {
  const [code, setCode] = useState(
    '// Start coding...\n\nfunction hello() {\n  console.log("Hello, Nexus Quantum!");\n}',
  )
  const [language, setLanguage] = useState("javascript")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [voiceInput, setVoiceInput] = useState(false)
  const [isDualPane, setIsDualPane] = useState(false)
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
  }

  const executeCode = () => {
    console.log("[v0] Executing code:", code)
    // Code execution logic here
  }

  const saveCode = () => {
    console.log("[v0] Saving code")
    localStorage.setItem("nexus-quantum-code", code)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">💻 Advanced Editor</h2>
          <p className="text-sm text-muted-foreground">AI-powered code editor with real-time collaboration</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={executeCode} size="sm">
            <Play className="mr-2 h-4 w-4" />
            Run Code
          </Button>
          <Button onClick={saveCode} size="sm" variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={() => setIsChatOpen(!isChatOpen)} size="sm" variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            AI Chat
          </Button>
          <Button onClick={() => setVoiceInput(!voiceInput)} size="sm" variant={voiceInput ? "destructive" : "outline"}>
            <Mic className="mr-2 h-4 w-4" />
            {voiceInput ? "Stop Voice" : "Voice"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
        </select>
        <Button onClick={() => setIsDualPane(!isDualPane)} size="sm" variant="outline">
          {isDualPane ? "Single Pane" : "Dual Pane"}
        </Button>
      </div>

      <div className="relative flex gap-4">
        <Card className={`flex-1 ${isChatOpen ? "w-2/3" : "w-full"}`}>
          <CardContent className="p-0">
            <div className="h-[600px]">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  wordWrap: "on",
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  parameterHints: { enabled: true },
                  formatOnType: true,
                  formatOnPaste: true,
                  automaticLayout: true,
                }}
                theme="vs-dark"
              />
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-1/3"
            >
              <ContextChatDock codeContext={code} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {voiceInput && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
            <VoiceInputInterface onClose={() => setVoiceInput(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {isDualPane && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted rounded-md p-4">
              <pre className="text-sm">{code}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const ContextChatDock = ({ codeContext }: { codeContext: string }) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: "I can help you with that code. Let me analyze it..." },
    ])
    setInput("")
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">🤖 Quantum Copilot</CardTitle>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline">
            Analyze
          </Button>
          <Button size="sm" variant="outline">
            Optimize
          </Button>
          <Button size="sm" variant="outline">
            Document
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8"}`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the code..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  )
}

const VoiceInputInterface = ({ onClose }: { onClose: () => void }) => (
  <Card>
    <CardHeader>
      <CardTitle>🎤 Voice Input Active</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center h-32">
        <motion.div
          className="w-16 h-16 rounded-full bg-red-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        />
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">Listening...</p>
      <Button onClick={onClose} className="w-full mt-4 bg-transparent" variant="outline">
        Stop Recording
      </Button>
    </CardContent>
  </Card>
)
