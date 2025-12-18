import { IsString, IsOptional, IsNumber, IsArray, IsEnum, IsObject, Min, Max } from 'class-validator';
import { FusionStrategy } from '../dag-rag/DAGRAGEngine';

// DAG/RAG DTOs
export class IndexDocumentsDto {
  @IsArray()
  documents!: Array<{
    id: string;
    content: string;
    metadata?: Record<string, any>;
  }>;
}

export class GenerateRAGDto {
  @IsString()
  query!: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(20)
  topK?: number;
}

export class MultiStrategySearchDto {
  @IsString()
  query!: string;

  @IsArray()
  @IsString({ each: true })
  strategies!: Array<'semantic' | 'keyword' | 'hybrid' | 'structured'>;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(20)
  topK?: number;
}

export class FuseResultsDto {
  @IsArray()
  results!: any[];

  @IsEnum(FusionStrategy)
  strategy!: FusionStrategy;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(20)
  topK?: number;
}

// Prompt Toolkit DTOs
export class RenderTemplateDto {
  @IsString()
  templateId!: string;

  @IsObject()
  variables!: Record<string, string>;
}

export class OptimizePromptDto {
  @IsString()
  prompt!: string;
}

export class CreateTemplateDto {
  @IsString()
  name!: string;

  @IsString()
  category!: string;

  @IsString()
  description!: string;

  @IsString()
  template!: string;

  @IsArray()
  @IsString({ each: true })
  variables!: string[];

  @IsArray()
  @IsString({ each: true })
  tags!: string[];
}

export class ExecuteChainDto {
  @IsArray()
  steps!: Array<{
    id: string;
    prompt: string;
    dependsOn?: string[];
  }>;
}

export class GenerateFewShotDto {
  @IsString()
  task!: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  count?: number;
}

export class SearchTemplatesDto {
  @IsString()
  query!: string;
}

// NLP Fusion DTOs
export class AddContextDto {
  @IsString()
  name!: string;

  @IsString()
  content!: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  weight?: number;
}

export class ExtractFeaturesDto {
  @IsString()
  text!: string;
}

export class FuseContextsDto {
  @IsArray()
  @IsString({ each: true })
  sourceIds!: string[];

  @IsString()
  @IsOptional()
  query?: string;

  @IsNumber()
  @IsOptional()
  @Min(100)
  @Max(8000)
  maxTokens?: number;
}
