import { IsString, IsDate, IsOptional, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateEventDto {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsDate()
    date: Date;
  
    @IsString()
    description: string;
  
    @IsArray()
    @IsString({ each: true })
    attendees: string[];
  
    @IsOptional()
    @IsString()
    location?: string;

    @IsNotEmpty()
    @IsNumber()
    assignedUser: User;
  }
