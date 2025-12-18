"use client"

import { useState } from "react"
import { MonacoEditor } from "./monaco-editor"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileCode, Terminal, FolderOpen, Plus, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CodeFile {
  id: string
  name: string
  language: string
  content: string
}

export function CodeWorkspace() {
  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: "1",
      name: "index.ts",
      language: "typescript",
      content: '// Start coding here\nconsole.log("Hello, World!");',
    },
  ])
  const [activeFileId, setActiveFileId] = useState("1")
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])

  const activeFile = files.find((f) => f.id === activeFileId)

  function handleFileChange(content: string) {
    setFiles((prev) => prev.map((f) => (f.id === activeFileId ? { ...f, content } : f)))
  }

  function addNewFile() {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: `file-${files.length + 1}.ts`,
      language: "typescript",
      content: "",
    }
    setFiles((prev) => [...prev, newFile])
    setActiveFileId(newFile.id)
  }

  function closeFile(fileId: string) {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    if (activeFileId === fileId && files.length > 1) {
      setActiveFileId(files[0].id)
    }
  }

  async function executeCode() {
    if (!activeFile) return

    setTerminalOutput((prev) => [...prev, `> Executing ${activeFile.name}...`])

    try {
      const response = await fetch("/api/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: activeFile.content,
          language: activeFile.language,
        }),
      })

      const { output, error } = await response.json()

      if (error) {
        setTerminalOutput((prev) => [...prev, `Error: ${error}`])
      } else {
        setTerminalOutput((prev) => [...prev, output])
      }
    } catch (error) {
      setTerminalOutput((prev) => [...prev, `Error: Failed to execute code`])
    }
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Code Workspace
        </h2>
        <Button onClick={addNewFile} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New File
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-[200px_1fr] gap-4">
        {/* File Explorer */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="h-4 w-4" />
            <span className="font-medium text-sm">Files</span>
          </div>
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="space-y-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-accent ${
                    activeFileId === file.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setActiveFileId(file.id)}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="h-3 w-3" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  {files.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeFile(file.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Editor & Terminal */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            {activeFile && (
              <MonacoEditor
                value={activeFile.content}
                onChange={handleFileChange}
                language={activeFile.language}
                height="100%"
                onExecute={executeCode}
                enableAI
              />
            )}
          </Card>

          {/* Terminal */}
          <Card className="h-[200px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4" />
              <span className="font-medium text-sm">Terminal</span>
            </div>
            <ScrollArea className="h-[calc(100%-2rem)] font-mono text-sm">
              {terminalOutput.map((line, i) => (
                <div key={i} className="text-muted-foreground">
                  {line}
                </div>
              ))}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  )
}
