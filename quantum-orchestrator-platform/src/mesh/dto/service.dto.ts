import { IsString, IsEnum, IsNumber, IsArray, IsOptional, IsObject } from 'class-validator';
import { ServiceProtocol } from '../MeshInterface';

export class RegisterServiceDto {
  @IsOptional()
  @IsString()
    id?: string;

  @IsString()
    name!: string;

  @IsString()
    version!: string;

  @IsOptional()
  @IsString()
    description?: string;

  @IsEnum(ServiceProtocol)
    protocol: ServiceProtocol;

  @IsString()
    host!: string;

  @IsNumber()
    port!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
    endpoints?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
    dependencies?: string[];

  @IsOptional()
  @IsString()
    apiKey?: string;

  @IsOptional()
  @IsNumber()
    rateLimit?: number;
}

export class InvokeServiceDto {
  @IsEnum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  @IsString()
    endpoint!: string;

  @IsOptional()
  @IsObject()
    body?: any;

  @IsOptional()
  @IsObject()
    headers?: Record<string, string>;

  @IsOptional()
  @IsNumber()
    timeout?: number;
}
