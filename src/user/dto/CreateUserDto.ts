import { IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EUserRole } from "../enums/EUserRole";

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username', minLength: 3 })
  @IsString()
  @MinLength(3)
  login: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password (min 6 characters)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: EUserRole, example: EUserRole.VIEWER, description: 'User role (default: viewer)', default: EUserRole.VIEWER })
  @IsOptional()
  @IsEnum(EUserRole)
  role?: EUserRole = EUserRole.VIEWER;
}