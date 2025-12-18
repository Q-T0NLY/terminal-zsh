"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Database, Copy, Check, RefreshCw, Sparkles, ExternalLink, Zap, Server, Shield } from "lucide-react"
import { useCache } from "@/lib/hooks/use-swr-cache"
import { withErrorHandling } from "@/lib/utils/error-handler"
import { toast } from "sonner"

export default function SettingsPage() {
  const [showSql, setShowSql] = useState(false)
  const [copied, setCopied] = useState(false)
  const [seedLoading, setSeedLoading] = useState(false)

  const {
    data: verifyResult,
    isLoading: verifyLoading,
    refresh: refreshVerify,
  } = useCache(
    "database-verify",
    async () => {
      const response = await fetch("/api/database/verify")
      if (!response.ok) throw new Error("Failed to verify database")
      return response.json()
    },
    {
      showErrorToast: false,
      revalidateOnMount: true,
    },
  )

  const SQL_CONTENT = `-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'agent')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AI models table
CREATE TABLE IF NOT EXISTS public.ai_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model_id TEXT NOT NULL,
  capabilities TEXT[] DEFAULT '{}',
  context_window INTEGER,
  pricing JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, model_id)
);

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  model_id UUID REFERENCES public.ai_models(id),
  capabilities TEXT[] DEFAULT '{}',
  system_prompt TEXT,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workflows table
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  nodes JSONB DEFAULT '[]',
  edges JSONB DEFAULT '[]',
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  context JSONB DEFAULT '{}',
  agent_id UUID REFERENCES public.agents(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create code artifacts table
CREATE TABLE IF NOT EXISTS public.code_artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES public.code_artifacts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create knowledge items table
CREATE TABLE IF NOT EXISTS public.knowledge_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('document', 'snippet', 'reference', 'note')),
  tags TEXT[] DEFAULT '{}',
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agent templates table
CREATE TABLE IF NOT EXISTS public.agent_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL,
  capabilities TEXT[] DEFAULT '{}',
  system_prompt TEXT NOT NULL,
  default_config JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create execution logs table
CREATE TABLE IF NOT EXISTS public.execution_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id),
  workflow_id UUID REFERENCES public.workflows(id),
  action TEXT NOT NULL,
  input JSONB,
  output JSONB,
  status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  error TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create system settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view AI models" ON public.ai_models FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view own agents" ON public.agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create agents" ON public.agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agents" ON public.agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own agents" ON public.agents FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own workflows" ON public.workflows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create workflows" ON public.workflows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workflows" ON public.workflows FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workflows" ON public.workflows FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat sessions" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own code" ON public.code_artifacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create code" ON public.code_artifacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own code" ON public.code_artifacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own code" ON public.code_artifacts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own knowledge" ON public.knowledge_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create knowledge" ON public.knowledge_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own knowledge" ON public.knowledge_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own knowledge" ON public.knowledge_items FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public templates" ON public.agent_templates FOR SELECT TO authenticated USING (is_public = true);
CREATE POLICY "Users can view own logs" ON public.execution_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create logs" ON public.execution_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view public settings" ON public.system_settings FOR SELECT TO authenticated USING (is_public = true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_models_updated_at BEFORE UPDATE ON public.ai_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_code_artifacts_updated_at BEFORE UPDATE ON public.code_artifacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_items_updated_at BEFORE UPDATE ON public.knowledge_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_templates_updated_at BEFORE UPDATE ON public.agent_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed AI models
INSERT INTO public.ai_models (name, provider, model_id, capabilities, context_window, pricing, metadata) VALUES
('GPT-4 Turbo', 'openai', 'gpt-4-turbo', ARRAY['text', 'code', 'reasoning'], 128000, '{"input": 0.01, "output": 0.03}', '{"version": "2024-04"}'),
('GPT-4o', 'openai', 'gpt-4o', ARRAY['text', 'vision', 'code'], 128000, '{"input": 0.005, "output": 0.015}', '{"version": "2024-05"}'),
('Claude 3.5 Sonnet', 'anthropic', 'claude-3-5-sonnet', ARRAY['text', 'code', 'reasoning'], 200000, '{"input": 0.003, "output": 0.015}', '{"version": "20241022"}'),
('Claude 3 Opus', 'anthropic', 'claude-3-opus', ARRAY['text', 'vision', 'code'], 200000, '{"input": 0.015, "output": 0.075}', '{"version": "20240229"}'),
('Gemini 2.0 Flash', 'google', 'gemini-2.0-flash', ARRAY['text', 'vision', 'audio', 'code'], 1000000, '{"input": 0.0001, "output": 0.0003}', '{"version": "exp-0121"}'),
('Llama 3.3 70B', 'meta', 'llama-3.3-70b', ARRAY['text', 'code'], 128000, '{"input": 0.0006, "output": 0.0006}', '{"version": "instruct"}'),
('DeepSeek V3', 'deepseek', 'deepseek-v3', ARRAY['text', 'code', 'reasoning'], 64000, '{"input": 0.00014, "output": 0.00028}', '{"version": "v3"}'),
('Grok 2', 'xai', 'grok-2-latest', ARRAY['text', 'code'], 128000, '{"input": 0.002, "output": 0.01}', '{"version": "1212"}')
ON CONFLICT (provider, model_id) DO NOTHING;

-- Seed agent templates
INSERT INTO public.agent_templates (name, description, type, capabilities, system_prompt, default_config) VALUES
('Code Specialist', 'Expert in writing, reviewing, and debugging code', 'code', ARRAY['code_generation', 'debugging', 'review'], 'You are an expert software engineer with deep knowledge of multiple programming languages, design patterns, and best practices.', '{"temperature": 0.2, "max_tokens": 4000}'),
('Data Analyst', 'Analyzes data, creates visualizations', 'data', ARRAY['analysis', 'visualization', 'insights'], 'You are a skilled data analyst who can interpret complex datasets and identify patterns.', '{"temperature": 0.3, "max_tokens": 3000}'),
('Content Writer', 'Creates engaging content', 'content', ARRAY['writing', 'editing', 'creativity'], 'You are a talented content writer who can adapt to different audiences.', '{"temperature": 0.7, "max_tokens": 3000}'),
('Research Assistant', 'Conducts thorough research', 'research', ARRAY['research', 'synthesis', 'fact_checking'], 'You are a meticulous research assistant who finds and synthesizes information.', '{"temperature": 0.4, "max_tokens": 4000}'),
('Task Orchestrator', 'Breaks down complex tasks', 'orchestrator', ARRAY['planning', 'coordination', 'decomposition'], 'You excel at breaking down complex projects into manageable steps.', '{"temperature": 0.5, "max_tokens": 2000}')
ON CONFLICT (name) DO NOTHING;`

  const handleCopySQL = async () => {
    await withErrorHandling(async () => {
      await navigator.clipboard.writeText(SQL_CONTENT)
      setCopied(true)
      toast.success("SQL copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    }, "copy SQL")
  }

  const handleSeedDatabase = async () => {
    setSeedLoading(true)

    await withErrorHandling(async () => {
      const response = await fetch("/api/database/seed", { method: "POST" })
      if (!response.ok) throw new Error("Failed to seed database")
      const data = await response.json()

      if (data.success) {
        toast.success(
          `Seeded ${data.seeded?.models || 0} AI models and ${data.seeded?.templates || 0} agent templates!`,
        )
        setTimeout(() => refreshVerify(), 1000)
      }

      return data
    }, "seed database")

    setSeedLoading(false)
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <div className="space-y-2 animate-in slide-in-from-top duration-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 shadow-lg animate-pulse-glow">
            <Sparkles className="h-8 w-8 text-cyan-400 animate-bounce-subtle" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift">
            ⚙️ Settings
          </h1>
        </div>
        <p className="text-muted-foreground text-lg pl-14">Configure your AI Orchestration Platform with style</p>
      </div>

      <Tabs defaultValue="database" className="w-full animate-in slide-in-from-bottom duration-700">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border border-border/50">
          <TabsTrigger
            value="database"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-cyan-500/10 data-[state=active]:text-cyan-400 transition-all duration-300"
          >
            <Database className="h-4 w-4" />
            <span>💾 Database</span>
          </TabsTrigger>
          <TabsTrigger
            value="general"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-purple-500/10 data-[state=active]:text-purple-400 transition-all duration-300"
          >
            <Server className="h-4 w-4" />
            <span>🎛️ General</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-pink-500/10 data-[state=active]:text-pink-400 transition-all duration-300"
          >
            <Shield className="h-4 w-4" />
            <span>👤 Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-6 animate-in fade-in duration-500">
          <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 via-card/80 to-card/50 backdrop-blur-sm shadow-xl hover-lift hover-glow-cyan transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Database className="h-6 w-6 text-cyan-400 animate-pulse" />
                Database Configuration
              </CardTitle>
              <CardDescription className="text-base">
                Set up and manage your Supabase database schema with advanced RLS policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Server className="h-4 w-4 text-cyan-400" />
                    Supabase URL
                  </Label>
                  <Input
                    value={process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured"}
                    readOnly
                    className="mt-2 bg-background/50 border-cyan-500/30 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-400 animate-pulse" />
                    Database Status
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-green-500/50 text-green-400 bg-green-500/10 animate-pulse"
                    >
                      🟢 Connected
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/50 pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400 animate-bounce-subtle" />
                  Database Setup
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-transparent border border-cyan-500/30 rounded-lg animate-shimmer">
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-cyan-400" />🚀 Quick Setup Guide:
                      </p>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>📋 Copy the SQL script below</li>
                        <li>
                          <a
                            href="https://supabase.com/dashboard/project/_/sql"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 transition-colors duration-200"
                          >
                            🔗 Open your Supabase SQL Editor
                            <ExternalLink className="h-3 w-3 animate-pulse" />
                          </a>
                        </li>
                        <li>✨ Paste and execute the SQL script</li>
                        <li>✅ Click "Verify Database" to confirm setup</li>
                      </ol>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Button
                      onClick={() => setShowSql(!showSql)}
                      variant="outline"
                      className="border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300 hover-lift"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      {showSql ? "Hide SQL Script 🙈" : "Show SQL Script 👁️"}
                    </Button>

                    <Button
                      onClick={handleCopySQL}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2 animate-bounce" />✅ Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />📋 Copy SQL to Clipboard
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={refreshVerify}
                      disabled={verifyLoading}
                      variant="outline"
                      className="border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 hover-lift bg-transparent"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${verifyLoading ? "animate-spin" : ""}`} />
                      {verifyLoading ? "🔄 Verifying..." : "🔍 Verify Database"}
                    </Button>
                  </div>

                  {showSql && (
                    <div className="relative animate-in slide-in-from-top duration-300">
                      <Textarea
                        value={SQL_CONTENT}
                        readOnly
                        className="font-mono text-xs h-96 bg-background/50 resize-none border-cyan-500/30"
                      />
                    </div>
                  )}
                </div>

                {verifyResult && (
                  <div
                    className={`p-6 rounded-lg border backdrop-blur-sm animate-in slide-in-from-bottom duration-500 ${
                      verifyResult.tables?.length > 0
                        ? "border-green-500/50 bg-gradient-to-br from-green-500/10 to-transparent shadow-lg shadow-green-500/10"
                        : "border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-transparent shadow-lg shadow-yellow-500/10"
                    }`}
                  >
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Database className="h-5 w-5" />📊 Database Tables{" "}
                      {verifyResult.tables?.length > 0 ? `(${verifyResult.tables.length})` : "(0)"}
                    </h4>
                    {verifyResult.tables?.length > 0 ? (
                      <div className="space-y-2">
                        {verifyResult.tables.map((table: any, index: number) => (
                          <div
                            key={table.table_name}
                            className="flex items-center justify-between text-sm p-3 rounded-lg bg-background/30 border border-border/30 hover:bg-accent/20 transition-all duration-200 animate-in slide-in-from-left"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <span className="font-mono flex items-center gap-2">
                              <span className="text-cyan-400">▸</span>
                              {table.table_name}
                            </span>
                            <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                              {table.row_count || 0} rows
                            </Badge>
                          </div>
                        ))}

                        {verifyResult.tables.some((t: any) => (t.row_count || 0) === 0) && (
                          <div className="pt-4 border-t border-border/50 mt-4 animate-in fade-in duration-500">
                            <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/30 rounded-lg mb-4 animate-pulse-glow">
                              <Sparkles className="h-6 w-6 text-purple-400 animate-bounce-subtle flex-shrink-0 mt-1" />
                              <div className="flex-1">
                                <p className="text-base font-semibold mb-1 text-purple-400">
                                  ✨ Tables need initial data!
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Your tables are created but empty. Click below to seed with 8 AI models and 5 agent
                                  templates.
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={handleSeedDatabase}
                              disabled={seedLoading}
                              size="lg"
                              className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-lg py-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift hover-glow-cyan animate-gradient-shift"
                            >
                              <Sparkles
                                className={`h-5 w-5 mr-2 ${seedLoading ? "animate-spin" : "animate-bounce-subtle"}`}
                              />
                              {seedLoading ? "🌱 Seeding Database..." : "🚀 Seed Database with Initial Data"}
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>⚠️</span>
                        No tables found. Please run the SQL script in your Supabase SQL Editor.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6 animate-in fade-in duration-500">
          <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 via-card/80 to-card/50 backdrop-blur-sm shadow-xl hover-lift hover-glow-purple transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Server className="h-6 w-6 text-purple-400 animate-pulse" />
                General Settings
              </CardTitle>
              <CardDescription className="text-base">
                Configure general platform settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center space-y-3 animate-in fade-in duration-700">
                <div className="inline-block p-4 rounded-full bg-purple-500/20 mb-2">
                  <Zap className="h-12 w-12 text-purple-400 animate-bounce-subtle" />
                </div>
                <p className="text-lg font-medium">🚧 General settings coming soon...</p>
                <p className="text-sm text-muted-foreground">More configuration options will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6 animate-in fade-in duration-500">
          <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/5 via-card/80 to-card/50 backdrop-blur-sm shadow-xl hover-lift hover-glow-pink transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-pink-400 animate-pulse" />
                Profile Settings
              </CardTitle>
              <CardDescription className="text-base">Manage your user profile and personal preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center space-y-3 animate-in fade-in duration-700">
                <div className="inline-block p-4 rounded-full bg-pink-500/20 mb-2">
                  <Shield className="h-12 w-12 text-pink-400 animate-bounce-subtle" />
                </div>
                <p className="text-lg font-medium">🚧 Profile settings coming soon...</p>
                <p className="text-sm text-muted-foreground">User management features will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
