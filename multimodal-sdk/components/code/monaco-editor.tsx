"use client"

import { useRef, useState } from "react"
import Editor, { type Monaco } from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Play, Save, Sparkles, FileCode, Wand2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: "vs-dark" | "light"
  height?: string
  onSave?: (value: string) => void
  onExecute?: (value: string) => void
  enableAI?: boolean
}

export function MonacoEditor({
  value,
  onChange,
  language = "typescript",
  theme = "vs-dark",
  height = "600px",
  onSave,
  onExecute,
  enableAI = true,
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const { toast } = useToast()

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor
    monacoRef.current = monaco

    // Configure editor
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: "on",
      roundedSelection: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      wordBasedSuggestions: true,
    })

    // Register AI completion provider
    if (enableAI) {
      monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: async (model, position) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          })

          try {
            const response = await fetch("/api/ai/code-completion", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                code: textUntilPosition,
                language,
                position,
              }),
            })

            if (!response.ok) return { suggestions: [] }

            const { completions } = await response.json()

            return {
              suggestions: completions.map((completion: any) => ({
                label: completion.label,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: completion.insertText,
                documentation: completion.documentation,
                detail: completion.detail,
              })),
            }
          } catch (error) {
            console.error("[v0] AI completion error:", error)
            return { suggestions: [] }
          }
        },
      })
    }
  }

  async function handleAIAction(action: string) {
    if (!editorRef.current) return

    const selectedText = editorRef.current.getModel()?.getValueInRange(editorRef.current.getSelection())
    const fullCode = editorRef.current.getValue()
    const code = selectedText || fullCode

    setIsAIProcessing(true)

    try {
      const response = await fetch("/api/ai/code-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          action,
          language,
          fullContext: fullCode,
        }),
      })

      if (!response.ok) throw new Error("AI action failed")

      const { result } = await response.json()

      if (action === "explain") {
        toast({
          title: "Code Explanation",
          description: result,
          duration: 10000,
        })
      } else {
        // Replace selection or full code
        if (selectedText) {
          const selection = editorRef.current.getSelection()
          editorRef.current.executeEdits("", [
            {
              range: selection,
              text: result,
            },
          ])
        } else {
          onChange(result)
        }

        toast({
          title: "AI Action Complete",
          description: `Code ${action} completed successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "AI Action Failed",
        description: "Failed to process AI action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAIProcessing(false)
    }
  }

  async function handleExecute() {
    if (!onExecute) return

    setIsExecuting(true)
    try {
      await onExecute(value)
      toast({
        title: "Execution Complete",
        description: "Code executed successfully",
      })
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Failed to execute code",
        variant: "destructive",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  function handleSave() {
    if (onSave) {
      onSave(value)
      toast({
        title: "Saved",
        description: "Code saved successfully",
      })
    }
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 border-b bg-card">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{language}</span>
        </div>

        <div className="flex items-center gap-2">
          {enableAI && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isAIProcessing}>
                  {isAIProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span className="ml-2">AI Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAIAction("explain")}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Explain Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIAction("optimize")}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Optimize Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIAction("refactor")}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Refactor Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIAction("document")}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Add Documentation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIAction("test")}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Tests
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {onExecute && (
            <Button variant="outline" size="sm" onClick={handleExecute} disabled={isExecuting}>
              {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              <span className="ml-2">Run</span>
            </Button>
          )}

          {onSave && (
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" />
              <span className="ml-2">Save</span>
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height={height}
          defaultLanguage={language}
          language={language}
          value={value}
          theme={theme}
          onChange={(value) => onChange(value || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}
