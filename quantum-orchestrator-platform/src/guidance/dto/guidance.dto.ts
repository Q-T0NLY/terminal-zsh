import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GuidanceContextDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentSection?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentPlugin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentService?: string;

  @ApiPropertyOptional({ enum: ['developer', 'admin', 'operator', 'user'] })
  @IsOptional()
  @IsEnum(['developer', 'admin', 'operator', 'user'])
  userRole?: 'developer' | 'admin' | 'operator' | 'user';

  @ApiPropertyOptional({ enum: ['beginner', 'intermediate', 'advanced', 'expert'] })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced', 'expert'])
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  systemState?: {
    registeredPlugins?: number;
    activeServices?: number;
    systemHealth?: string;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  userHistory?: {
    lastActions?: string[];
    preferences?: Record<string, any>;
  };
}

export class GetGuidanceDto {
  @ApiProperty({ description: 'The user query or question' })
  @IsString()
  query!: string;

  @ApiPropertyOptional({ description: 'Context information about the user and system state' })
  @IsOptional()
  @IsObject()
  context?: GuidanceContextDto;

  @ApiPropertyOptional({
    enum: ['navigation', 'configuration', 'troubleshooting', 'learning', 'automation'],
    description: 'The intent of the query',
  })
  @IsOptional()
  @IsEnum(['navigation', 'configuration', 'troubleshooting', 'learning', 'automation'])
  intent?: 'navigation' | 'configuration' | 'troubleshooting' | 'learning' | 'automation';
}

export class GetRecommendationsDto {
  @ApiProperty({ description: 'Plugin ID to get recommendations for' })
  @IsString()
  pluginId!: string;

  @ApiProperty({ description: 'Current plugin configuration' })
  @IsObject()
  currentConfig!: any;
}

export class ClearHistoryDto {
  @ApiProperty({ description: 'User ID whose history to clear' })
  @IsString()
  userId!: string;
}
