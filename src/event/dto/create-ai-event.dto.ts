import { IsString, IsDate, IsOptional, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAiEventDto {
    @IsString()
    message: string;
    @IsNumber()
    userId: number;
  }
