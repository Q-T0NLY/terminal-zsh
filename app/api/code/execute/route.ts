import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, language } = await req.json()

    // For security, we'll simulate execution
    // In production, use a sandboxed environment
    let output = ""
    let error = null

    try {
      if (language === "javascript" || language === "typescript") {
        // Extract console.log calls
        const logs: string[] = []
        const mockConsole = {
          log: (...args: any[]) => {
            logs.push(args.join(" "))
          },
        }

        // Simple evaluation (NOT SAFE FOR PRODUCTION)
        // Use a proper sandbox like vm2 or isolated-vm
        const result = new Function("console", code)(mockConsole)
        output = logs.join("\n") || String(result)
      } else {
        output = "Language execution not yet supported"
      }
    } catch (err: any) {
      error = err.message
    }

    // Log execution
    await supabase.from("execution_logs").insert({
      user_id: user.id,
      code,
      language,
      output,
      error,
    })

    return Response.json({ output, error })
  } catch (error) {
    console.error("[v0] Code execution error:", error)
    return Response.json({ error: "Failed to execute code" }, { status: 500 })
  }
}
