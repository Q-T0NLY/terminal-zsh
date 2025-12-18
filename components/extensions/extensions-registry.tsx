"use client"
import { motion } from "framer-motion"
import { Star, Download, Play, Settings, TrendingUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface ExtensionsRegistryProps {
  extensions: any[]
  categories: any[]
  searchTerm: string
  category: string
  onSearchChange: (term: string) => void
  onCategoryChange: (category: string) => void
  onExtensionSelect: (extension: any) => void
  onTestExtension: (id: string) => void
  onDeployExtension: (id: string) => void
}

export function ExtensionsRegistry({
  extensions,
  categories,
  searchTerm,
  category,
  onSearchChange,
  onCategoryChange,
  onExtensionSelect,
  onTestExtension,
  onDeployExtension,
}: ExtensionsRegistryProps) {
  const featuredExtensions = extensions.filter((ext) => ext.featured)

  return (
    <div className="extensions-registry space-y-6">
      {/* Search and Filters */}
      <div className="registry-header space-y-4">
        <div className="search-box relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search extensions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="category-filters flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  category === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-accent"
                }`}
                onClick={() => onCategoryChange(cat.id)}
              >
                <Icon size={16} />
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Featured Extensions */}
      {featuredExtensions.length > 0 && (
        <div className="featured-section space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" fill="currentColor" />
            Featured Extensions
          </h3>
          <div className="featured-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredExtensions.map((extension) => (
              <FeaturedExtensionCard
                key={extension.id}
                extension={extension}
                onSelect={onExtensionSelect}
                onTest={onTestExtension}
                onDeploy={onDeployExtension}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Extensions Grid */}
      <div className="extensions-grid space-y-4">
        <h3 className="text-2xl font-bold">All Extensions ({extensions.length})</h3>
        <div className="grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {extensions.map((extension) => (
            <ExtensionCard
              key={extension.id}
              extension={extension}
              onSelect={onExtensionSelect}
              onTest={onTestExtension}
              onDeploy={onDeployExtension}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeaturedExtensionCard({ extension, onSelect, onTest, onDeploy }: any) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} onClick={() => onSelect(extension)}>
      <Card className="cursor-pointer relative overflow-hidden">
        <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-950 px-2 py-1 rounded text-xs font-bold">
          Featured
        </div>

        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">{extension.icon || "🧠"}</div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">{extension.name}</h4>
              <p className="text-sm text-muted-foreground">{extension.description}</p>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-bold">{extension.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <TrendingUp size={12} />
              <span>{extension.downloads} installs</span>
            </div>
            <span>v{extension.version}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeploy(extension.id)
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Download size={14} />
              Install
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTest(extension.id)
              }}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
            >
              <Play size={14} />
              Test
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ExtensionCard({ extension, onSelect, onTest, onDeploy }: any) {
  return (
    <motion.div whileHover={{ y: -2 }} onClick={() => onSelect(extension)}>
      <Card className="cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl">{extension.icon || "⚡"}</div>
            <div className="flex-1">
              <h4 className="font-bold mb-1">{extension.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{extension.description}</p>
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${
                extension.status === "active"
                  ? "bg-green-500/20 text-green-500"
                  : extension.status === "beta"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-gray-500/20 text-gray-500"
              }`}
            >
              {extension.status}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {extension.tags?.slice(0, 3).map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-accent rounded text-xs">
                {tag}
              </span>
            ))}
            {extension.tags?.length > 3 && (
              <span className="px-2 py-1 bg-accent rounded text-xs">+{extension.tags.length - 3}</span>
            )}
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Performance</span>
              <span>{extension.performance}%</span>
            </div>
            <div className="h-2 bg-accent rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${extension.performance}%` }} />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTest(extension.id)
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 border border-border rounded hover:bg-accent transition-colors text-xs"
            >
              <Play size={12} />
              Test
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeploy(extension.id)
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 border border-border rounded hover:bg-accent transition-colors text-xs"
            >
              <Download size={12} />
              Install
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelect(extension)
              }}
              className="flex items-center justify-center gap-1 px-2 py-1.5 border border-border rounded hover:bg-accent transition-colors text-xs"
            >
              <Settings size={12} />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
