"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Heart, Lightbulb, Palette, Wand2, Play } from "lucide-react"

export function CreativeAIStudio() {
  const [emotionalIntensity, setEmotionalIntensity] = useState([70])
  const [creativityLevel, setCreativityLevel] = useState([80])
  const [storyPrompt, setStoryPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (type: string) => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setGeneratedContent(
        `Generated ${type} content with emotional intensity ${emotionalIntensity[0]}% and creativity ${creativityLevel[0]}%...`,
      )
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-500" />
          Creative AI Studio
        </h2>
      </div>

      <Tabs defaultValue="storytelling" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="storytelling">Emotional Storytelling</TabsTrigger>
          <TabsTrigger value="brainstorming">Creative Brainstorming</TabsTrigger>
          <TabsTrigger value="style">Style Transfer</TabsTrigger>
          <TabsTrigger value="multimodal">Multimodal Narratives</TabsTrigger>
        </TabsList>

        <TabsContent value="storytelling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Emotional Intelligence Storytelling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Story Prompt</label>
                <Textarea
                  placeholder="Enter your story prompt..."
                  value={storyPrompt}
                  onChange={(e) => setStoryPrompt(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Emotional Intensity: {emotionalIntensity[0]}%</label>
                <Slider value={emotionalIntensity} onValueChange={setEmotionalIntensity} max={100} step={1} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Badge variant="outline" className="justify-center py-2">
                  <Heart className="h-3 w-3 mr-1" />
                  Joy: 85%
                </Badge>
                <Badge variant="outline" className="justify-center py-2">
                  <Heart className="h-3 w-3 mr-1" />
                  Tension: 72%
                </Badge>
                <Badge variant="outline" className="justify-center py-2">
                  <Heart className="h-3 w-3 mr-1" />
                  Hope: 90%
                </Badge>
              </div>

              <Button onClick={() => handleGenerate("storytelling")} disabled={isGenerating} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Emotional Story"}
              </Button>

              {generatedContent && (
                <Card className="bg-muted">
                  <CardContent className="pt-6">
                    <p className="text-sm">{generatedContent}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brainstorming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Advanced Creative Brainstorming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Creativity Level: {creativityLevel[0]}%</label>
                <Slider value={creativityLevel} onValueChange={setCreativityLevel} max={100} step={1} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-500">92</div>
                      <div className="text-sm text-muted-foreground">Originality Score</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-500">87</div>
                      <div className="text-sm text-muted-foreground">Innovation Index</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={() => handleGenerate("brainstorming")} disabled={isGenerating} className="w-full">
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? "Brainstorming..." : "Generate Creative Ideas"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-pink-500" />
                Style Transfer & Creation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {["Poetic", "Technical", "Narrative", "Persuasive", "Humorous", "Formal"].map((style) => (
                  <Button key={style} variant="outline" size="sm">
                    {style}
                  </Button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Style Fidelity: 85%</label>
                <Slider defaultValue={[85]} max={100} step={1} />
              </div>

              <Button onClick={() => handleGenerate("style")} disabled={isGenerating} className="w-full">
                <Palette className="h-4 w-4 mr-2" />
                {isGenerating ? "Transferring..." : "Apply Style Transfer"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multimodal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Modal Narrative Creation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">Text → Image</Button>
                <Button variant="outline">Text → Audio</Button>
                <Button variant="outline">Image → Text</Button>
                <Button variant="outline">Audio → Text</Button>
              </div>

              <Button onClick={() => handleGenerate("multimodal")} disabled={isGenerating} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? "Creating..." : "Generate Multimodal Content"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
