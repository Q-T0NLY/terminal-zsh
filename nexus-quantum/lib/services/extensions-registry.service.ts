// Registry for managing agent extensions and custom capabilities
export interface Extension {
  id: string
  name: string
  version: string
  description: string
  type: ExtensionType
  category: string
  author: string
  config: ExtensionConfig
  capabilities: ExtensionCapability[]
  dependencies: string[]
  status: ExtensionStatus
  createdAt: Date
  updatedAt: Date
}

export enum ExtensionType {
  CAPABILITY = "CAPABILITY",
  INTEGRATION = "INTEGRATION",
  TRANSFORMER = "TRANSFORMER",
  VALIDATOR = "VALIDATOR",
}

export enum ExtensionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DEPRECATED = "DEPRECATED",
}

export interface ExtensionConfig {
  entryPoint: string
  runtime: "node" | "python" | "wasm"
  permissions: string[]
  resources: {
    memory: number
    cpu: number
    timeout: number
  }
}

export interface ExtensionCapability {
  id: string
  name: string
  description: string
  inputs: CapabilityInput[]
  outputs: CapabilityOutput[]
  examples: CapabilityExample[]
}

export interface CapabilityInput {
  name: string
  type: string
  required: boolean
  description: string
  default?: any
}

export interface CapabilityOutput {
  name: string
  type: string
  description: string
}

export interface CapabilityExample {
  name: string
  inputs: Record<string, any>
  expectedOutput: any
}

export class ExtensionsRegistryService {
  private extensions: Map<string, Extension> = new Map()
  private categoryIndex: Map<string, string[]> = new Map()

  constructor() {
    this.initializeDefaultExtensions()
  }

  private initializeDefaultExtensions(): void {
    const defaultExtensions: Extension[] = [
      {
        id: "ext-web-scraper",
        name: "Web Scraper",
        version: "1.0.0",
        description: "Extract data from websites",
        type: ExtensionType.CAPABILITY,
        category: "data-extraction",
        author: "Nexus Team",
        config: {
          entryPoint: "scraper.js",
          runtime: "node",
          permissions: ["network"],
          resources: {
            memory: 512,
            cpu: 1,
            timeout: 30000,
          },
        },
        capabilities: [
          {
            id: "scrape-url",
            name: "Scrape URL",
            description: "Extract content from a URL",
            inputs: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL to scrape",
              },
              {
                name: "selector",
                type: "string",
                required: false,
                description: "CSS selector for specific elements",
              },
            ],
            outputs: [
              {
                name: "content",
                type: "string",
                description: "Extracted content",
              },
            ],
            examples: [
              {
                name: "Basic scrape",
                inputs: { url: "https://example.com" },
                expectedOutput: { content: "Page content..." },
              },
            ],
          },
        ],
        dependencies: [],
        status: ExtensionStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ext-data-transformer",
        name: "Data Transformer",
        version: "1.0.0",
        description: "Transform data between formats",
        type: ExtensionType.TRANSFORMER,
        category: "data-processing",
        author: "Nexus Team",
        config: {
          entryPoint: "transformer.js",
          runtime: "node",
          permissions: [],
          resources: {
            memory: 256,
            cpu: 1,
            timeout: 10000,
          },
        },
        capabilities: [
          {
            id: "json-to-csv",
            name: "JSON to CSV",
            description: "Convert JSON to CSV format",
            inputs: [
              {
                name: "data",
                type: "object",
                required: true,
                description: "JSON data to convert",
              },
            ],
            outputs: [
              {
                name: "csv",
                type: "string",
                description: "CSV formatted data",
              },
            ],
            examples: [],
          },
        ],
        dependencies: [],
        status: ExtensionStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    for (const ext of defaultExtensions) {
      this.registerExtension(ext)
    }

    console.log(`[v0] Initialized ${defaultExtensions.length} default extensions`)
  }

  registerExtension(extension: Extension): void {
    this.extensions.set(extension.id, extension)

    // Update category index
    const categoryExts = this.categoryIndex.get(extension.category) || []
    categoryExts.push(extension.id)
    this.categoryIndex.set(extension.category, categoryExts)

    console.log(`[v0] Extension registered: ${extension.name} (${extension.id})`)
  }

  getExtension(extensionId: string): Extension | undefined {
    return this.extensions.get(extensionId)
  }

  getAllExtensions(): Extension[] {
    return Array.from(this.extensions.values())
  }

  getExtensionsByCategory(category: string): Extension[] {
    const extIds = this.categoryIndex.get(category) || []
    return extIds.map((id) => this.extensions.get(id)!).filter(Boolean)
  }

  searchExtensions(query: string): Extension[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.extensions.values()).filter(
      (ext) =>
        ext.name.toLowerCase().includes(lowerQuery) ||
        ext.description.toLowerCase().includes(lowerQuery) ||
        ext.category.toLowerCase().includes(lowerQuery),
    )
  }

  updateExtensionStatus(extensionId: string, status: ExtensionStatus): boolean {
    const extension = this.extensions.get(extensionId)
    if (!extension) return false

    extension.status = status
    extension.updatedAt = new Date()
    this.extensions.set(extensionId, extension)

    console.log(`[v0] Extension ${extensionId} status updated to ${status}`)
    return true
  }

  deleteExtension(extensionId: string): boolean {
    const extension = this.extensions.get(extensionId)
    if (!extension) return false

    this.extensions.delete(extensionId)

    // Remove from category index
    const categoryExts = this.categoryIndex.get(extension.category) || []
    this.categoryIndex.set(
      extension.category,
      categoryExts.filter((id) => id !== extensionId),
    )

    console.log(`[v0] Extension deleted: ${extensionId}`)
    return true
  }

  getCategories(): string[] {
    return Array.from(this.categoryIndex.keys())
  }

  getStats(): {
    totalExtensions: number
    byType: Record<string, number>
    byStatus: Record<string, number>
    byCategory: Record<string, number>
  } {
    const byType: Record<string, number> = {}
    const byStatus: Record<string, number> = {}
    const byCategory: Record<string, number> = {}

    for (const ext of this.extensions.values()) {
      byType[ext.type] = (byType[ext.type] || 0) + 1
      byStatus[ext.status] = (byStatus[ext.status] || 0) + 1
      byCategory[ext.category] = (byCategory[ext.category] || 0) + 1
    }

    return {
      totalExtensions: this.extensions.size,
      byType,
      byStatus,
      byCategory,
    }
  }
}
