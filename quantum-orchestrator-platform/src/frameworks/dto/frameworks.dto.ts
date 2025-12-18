import { IsString, IsEnum, IsArray, IsOptional, IsObject, IsNumber, IsBoolean } from 'class-validator';

// LangGraph DTOs
export class CreateGraphDto {
  @IsOptional()
  @IsString()
    id?: string;

  @IsOptional()
  @IsString()
    templateId?: string;
}

export class AddNodeDto {
  @IsString()
    id!: string;

  @IsEnum(['start', 'end', 'agent', 'tool', 'decision', 'parallel'])
    type: 'start' | 'end' | 'agent' | 'tool' | 'decision' | 'parallel';

  @IsString()
    name!: string;

  @IsOptional()
  @IsObject()
    config?: Record<string, any>;
}

export class AddEdgeDto {
  @IsString()
    from!: string;

  @IsString()
    to!: string;
}

export class ExecuteGraphDto {
  @IsObject()
    input: any;
}

// LlamaIndex DTOs
export class CreateIndexDto {
  @IsOptional()
  @IsString()
    id?: string;

  @IsString()
    name!: string;

  @IsOptional()
  @IsString()
    embeddingModel?: string;

  @IsOptional()
  @IsNumber()
    chunkSize?: number;

  @IsOptional()
  @IsNumber()
    chunkOverlap?: number;
}

export class AddDocumentsDto {
  @IsArray()
    documents: Array<{
    id: string;
    content: string;
    metadata?: Record<string, any>;
  }>;
}

export class QueryIndexDto {
  @IsString()
    query!: string;

  @IsOptional()
  @IsNumber()
    topK?: number;

  @IsOptional()
  @IsObject()
    filter?: Record<string, any>;
}

// CrewAI DTOs
export class CreateAgentDto {
  @IsOptional()
  @IsString()
    id?: string;

  @IsString()
    role!: string;

  @IsString()
    goal!: string;

  @IsString()
    backstory!: string;

  @IsOptional()
  @IsArray()
    tools?: string[];

  @IsOptional()
  @IsString()
    llmModel?: string;
}

export class CreateTaskDto {
  @IsString()
    id!: string;

  @IsString()
    description!: string;

  @IsString()
    expectedOutput!: string;

  @IsOptional()
  @IsString()
    agent?: string;
}

export class CreateCrewDto {
  @IsOptional()
  @IsString()
    id?: string;

  @IsString()
    name!: string;

  @IsArray()
  @IsString({ each: true })
    agents!: string[];

  @IsArray()
    tasks!: CreateTaskDto[];

  @IsEnum(['sequential', 'parallel'])
    executionMode: 'sequential' | 'parallel';
}
