"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Figma, Loader2 } from "lucide-react"

export function FigmaImporter({ onThemeImport }: { onThemeImport: (theme: any) => void }) {
  const [fileId, setFileId] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)

  const handleImport = async () => {
    if (!fileId || !accessToken) return

    setImporting(true)
    try {
      const response = await fetch("/api/themes/figma-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, accessToken }),
      })

      const result = await response.json()

      setImportResult({
        success: true,
        data: result,
        message: "Theme imported successfully!",
      })

      onThemeImport(result.theme)
    } catch (error) {
      setImportResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Import failed. Check your file ID and access token.",
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Figma Access Token</Label>
          <Input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Enter your Figma personal access token"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Get this from Figma → Account Settings → Personal Access Tokens
          </p>
        </div>

        <div>
          <Label>Figma File ID</Label>
          <Input
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            placeholder="Enter Figma file ID (from URL)"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The file ID is in your Figma URL: figma.com/file/FILE_ID/...
          </p>
        </div>

        <Button onClick={handleImport} disabled={importing || !fileId || !accessToken} className="w-full">
          {importing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Figma className="mr-2 h-4 w-4" />
              Import Theme from Figma
            </>
          )}
        </Button>
      </div>

      {importResult && (
        <Card className={`p-4 ${importResult.success ? "border-green-500" : "border-red-500"}`}>
          <h4 className="font-semibold mb-2">{importResult.success ? "✅ Success" : "❌ Error"}</h4>
          <p className="text-sm">{importResult.message}</p>
          {importResult.data && (
            <div className="mt-4">
              <h5 className="text-sm font-semibold mb-2">Color Palette</h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(importResult.data.theme.colors).map(([name, color]) => (
                  <div key={name} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded border" style={{ backgroundColor: color as string }} />
                    <span className="text-xs">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
