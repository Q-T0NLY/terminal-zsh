-- Enable required extensions
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

-- Enable Row Level Security on all tables
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

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for ai_models (read-only for all authenticated users)
CREATE POLICY "Anyone can view AI models" ON public.ai_models FOR SELECT TO authenticated USING (true);

-- RLS Policies for agents
CREATE POLICY "Users can view own agents" ON public.agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create agents" ON public.agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agents" ON public.agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own agents" ON public.agents FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for workflows
CREATE POLICY "Users can view own workflows" ON public.workflows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create workflows" ON public.workflows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workflows" ON public.workflows FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workflows" ON public.workflows FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_sessions
CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat sessions" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for code_artifacts
CREATE POLICY "Users can view own code" ON public.code_artifacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create code" ON public.code_artifacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own code" ON public.code_artifacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own code" ON public.code_artifacts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for knowledge_items
CREATE POLICY "Users can view own knowledge" ON public.knowledge_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create knowledge" ON public.knowledge_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own knowledge" ON public.knowledge_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own knowledge" ON public.knowledge_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for agent_templates (public templates readable by all)
CREATE POLICY "Anyone can view public templates" ON public.agent_templates FOR SELECT TO authenticated USING (is_public = true);

-- RLS Policies for execution_logs
CREATE POLICY "Users can view own logs" ON public.execution_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create logs" ON public.execution_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for system_settings (public settings readable by all)
CREATE POLICY "Anyone can view public settings" ON public.system_settings FOR SELECT TO authenticated USING (is_public = true);

-- Create triggers for updated_at
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
('Code Specialist', 'Expert in writing, reviewing, and debugging code across multiple languages', 'code', ARRAY['code_generation', 'debugging', 'review'], 'You are an expert software engineer with deep knowledge of multiple programming languages, design patterns, and best practices. You write clean, efficient, and well-documented code.', '{"temperature": 0.2, "max_tokens": 4000}'),
('Data Analyst', 'Analyzes data, creates visualizations, and provides insights', 'data', ARRAY['analysis', 'visualization', 'insights'], 'You are a skilled data analyst who can interpret complex datasets, identify patterns, and communicate insights clearly. You excel at creating meaningful visualizations and actionable recommendations.', '{"temperature": 0.3, "max_tokens": 3000}'),
('Content Writer', 'Creates engaging, well-structured content for various purposes', 'content', ARRAY['writing', 'editing', 'creativity'], 'You are a talented content writer who can adapt your style to different audiences and formats. You create compelling, clear, and engaging content that achieves its intended purpose.', '{"temperature": 0.7, "max_tokens": 3000}'),
('Research Assistant', 'Conducts thorough research and synthesizes information', 'research', ARRAY['research', 'synthesis', 'fact_checking'], 'You are a meticulous research assistant who can find, evaluate, and synthesize information from multiple sources. You provide well-cited, accurate, and comprehensive research summaries.', '{"temperature": 0.4, "max_tokens": 4000}'),
('Task Orchestrator', 'Breaks down complex tasks and coordinates multiple agents', 'orchestrator', ARRAY['planning', 'coordination', 'decomposition'], 'You are a strategic task orchestrator who excels at breaking down complex projects into manageable steps, identifying the right tools and agents for each task, and coordinating execution efficiently.', '{"temperature": 0.5, "max_tokens": 2000}')
ON CONFLICT (name) DO NOTHING;
