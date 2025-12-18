import { IsString, IsEnum, IsArray, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { PluginCategory } from '../PluginInterface';

export class RegisterPluginDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  version: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsEnum(PluginCategory)
  category: PluginCategory;

  @IsArray()
  @IsString({ each: true })
  capabilities: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependencies?: string[];

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @IsOptional()
  @IsString()
  checksum?: string;
}

export class UpdatePluginDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PluginCategory)
  category?: PluginCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  capabilities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependencies?: string[];

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class SearchPluginDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PluginCategory)
  category?: PluginCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  capabilities?: string[];
}

export class ListPluginsDto {
  @IsOptional()
  @IsEnum(PluginCategory)
  category?: PluginCategory;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
