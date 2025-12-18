import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createAdminClient()

    // Seed AI models
    const { data: models, error: modelsError } = await supabase.from("ai_models").upsert(
      [
        {
          name: "GPT-4 Turbo",
          provider: "openai",
          model_id: "gpt-4-turbo",
          capabilities: ["text", "code", "reasoning"],
          context_window: 128000,
          pricing: { input: 0.01, output: 0.03 },
          metadata: { version: "2024-04" },
        },
        {
          name: "GPT-4o",
          provider: "openai",
          model_id: "gpt-4o",
          capabilities: ["text", "vision", "code"],
          context_window: 128000,
          pricing: { input: 0.005, output: 0.015 },
          metadata: { version: "2024-05" },
        },
        {
          name: "Claude 3.5 Sonnet",
          provider: "anthropic",
          model_id: "claude-3-5-sonnet",
          capabilities: ["text", "code", "reasoning"],
          context_window: 200000,
          pricing: { input: 0.003, output: 0.015 },
          metadata: { version: "20241022" },
        },
        {
          name: "Claude 3 Opus",
          provider: "anthropic",
          model_id: "claude-3-opus",
          capabilities: ["text", "vision", "code"],
          context_window: 200000,
          pricing: { input: 0.015, output: 0.075 },
          metadata: { version: "20240229" },
        },
        {
          name: "Gemini 2.0 Flash",
          provider: "google",
          model_id: "gemini-2.0-flash",
          capabilities: ["text", "vision", "audio", "code"],
          context_window: 1000000,
          pricing: { input: 0.0001, output: 0.0003 },
          metadata: { version: "exp-0121" },
        },
        {
          name: "Llama 3.3 70B",
          provider: "meta",
          model_id: "llama-3.3-70b",
          capabilities: ["text", "code"],
          context_window: 128000,
          pricing: { input: 0.0006, output: 0.0006 },
          metadata: { version: "instruct" },
        },
        {
          name: "DeepSeek V3",
          provider: "deepseek",
          model_id: "deepseek-v3",
          capabilities: ["text", "code", "reasoning"],
          context_window: 64000,
          pricing: { input: 0.00014, output: 0.00028 },
          metadata: { version: "v3" },
        },
        {
          name: "Grok 2",
          provider: "xai",
          model_id: "grok-2-latest",
          capabilities: ["text", "code"],
          context_window: 128000,
          pricing: { input: 0.002, output: 0.01 },
          metadata: { version: "1212" },
        },
      ],
      { onConflict: "provider,model_id" },
    )

    if (modelsError) {
      return NextResponse.json({ success: false, error: modelsError.message }, { status: 500 })
    }

    // Seed agent templates
    const { data: templates, error: templatesError } = await supabase.from("agent_templates").upsert(
      [
        {
          name: "Code Specialist",
          description: "Expert in writing, reviewing, and debugging code",
          type: "code",
          capabilities: ["code_generation", "debugging", "review"],
          system_prompt:
            "You are an expert software engineer with deep knowledge of multiple programming languages, design patterns, and best practices.",
          default_config: { temperature: 0.2, max_tokens: 4000 },
        },
        {
          name: "Data Analyst",
          description: "Analyzes data, creates visualizations",
          type: "data",
          capabilities: ["analysis", "visualization", "insights"],
          system_prompt: "You are a skilled data analyst who can interpret complex datasets and identify patterns.",
          default_config: { temperature: 0.3, max_tokens: 3000 },
        },
        {
          name: "Content Writer",
          description: "Creates engaging content",
          type: "content",
          capabilities: ["writing", "editing", "creativity"],
          system_prompt: "You are a talented content writer who can adapt to different audiences.",
          default_config: { temperature: 0.7, max_tokens: 3000 },
        },
        {
          name: "Research Assistant",
          description: "Conducts thorough research",
          type: "research",
          capabilities: ["research", "synthesis", "fact_checking"],
          system_prompt: "You are a meticulous research assistant who finds and synthesizes information.",
          default_config: { temperature: 0.4, max_tokens: 4000 },
        },
        {
          name: "Task Orchestrator",
          description: "Breaks down complex tasks",
          type: "orchestrator",
          capabilities: ["planning", "coordination", "decomposition"],
          system_prompt: "You excel at breaking down complex projects into manageable steps.",
          default_config: { temperature: 0.5, max_tokens: 2000 },
        },
      ],
      { onConflict: "name" },
    )

    if (templatesError) {
      return NextResponse.json({ success: false, error: templatesError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      seeded: {
        models: 8,
        templates: 5,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
