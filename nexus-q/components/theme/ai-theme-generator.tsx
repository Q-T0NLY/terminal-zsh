"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"

export function AIThemeGenerator({ onThemeGenerated }: { onThemeGenerated: (theme: any) => void }) {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("modern")
  const [mood, setMood] = useState("professional")
  const [generating, setGenerating] = useState(false)
  const [generatedThemes, setGeneratedThemes] = useState<any[]>([])

  const handleGenerate = async () => {
    if (!prompt) return

    setGenerating(true)
    try {
      const response = await fetch("/api/themes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          mood,
          colorPreference: "vibrant",
          variations: 3,
        }),
      })

      const themes = await response.json()
      setGeneratedThemes(themes)
    } catch (error) {
      console.error("[v0] Theme generation error:", error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Describe your ideal theme</Label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Dark cyberpunk theme with neon accents"
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Style</Label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full mt-2 px-3 py-2 border rounded-md"
            >
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="bold">Bold</option>
              <option value="elegant">Elegant</option>
            </select>
          </div>

          <div>
            <Label>Mood</Label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full mt-2 px-3 py-2 border rounded-md"
            >
              <option value="professional">Professional</option>
              <option value="playful">Playful</option>
              <option value="serious">Serious</option>
              <option value="energetic">Energetic</option>
            </select>
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={generating || !prompt} className="w-full">
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Themes with AI
            </>
          )}
        </Button>
      </div>

      {generatedThemes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Themes</h3>
          <div className="grid gap-4">
            {generatedThemes.map((theme) => (
              <Card key={theme.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{theme.name}</h4>
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                  </div>
                  <Button size="sm" onClick={() => onThemeGenerated(theme)}>
                    Apply
                  </Button>
                </div>
                <div className="flex gap-2 mt-4">
                  {Object.entries(theme.colors)
                    .slice(0, 6)
                    .map(([name, color]) => (
                      <div
                        key={name}
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: color as string }}
                        title={name}
                      />
                    ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
