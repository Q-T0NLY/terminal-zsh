import { type NextRequest, NextResponse } from "next/server"
import {
  ExtensionsRegistryService,
  type Extension,
  type ExtensionStatus,
} from "@/lib/services/extensions-registry.service"

let extensionsRegistry: ExtensionsRegistryService

function getExtensionsRegistry() {
  if (!extensionsRegistry) {
    extensionsRegistry = new ExtensionsRegistryService()
  }
  return extensionsRegistry
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const extensionId = searchParams.get("id")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const registry = getExtensionsRegistry()

    if (extensionId) {
      const extension = registry.getExtension(extensionId)
      if (!extension) {
        return NextResponse.json({ error: "Extension not found" }, { status: 404 })
      }
      return NextResponse.json(extension)
    }

    if (category) {
      const extensions = registry.getExtensionsByCategory(category)
      return NextResponse.json({ extensions })
    }

    if (search) {
      const extensions = registry.searchExtensions(search)
      return NextResponse.json({ extensions })
    }

    const extensions = registry.getAllExtensions()
    return NextResponse.json({ extensions })
  } catch (error) {
    console.error("[v0] Extension retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve extensions", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const extension = await request.json()

    const registry = getExtensionsRegistry()

    const fullExtension: Extension = {
      ...extension,
      id: crypto.randomUUID(),
      author: "User",
      status: "ACTIVE" as ExtensionStatus,
      dependencies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      config: {
        entryPoint: "index.js",
        runtime: "node",
        permissions: [],
        resources: {
          memory: 256,
          cpu: 1,
          timeout: 10000,
        },
      },
    }

    registry.registerExtension(fullExtension)

    return NextResponse.json({
      extension: fullExtension,
      message: "Extension registered successfully",
    })
  } catch (error) {
    console.error("[v0] Extension registration error:", error)
    return NextResponse.json(
      { error: "Failed to register extension", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
