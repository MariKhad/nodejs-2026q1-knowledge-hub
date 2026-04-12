import { IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../prisma/generated/client';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username', minLength: 3 })
  @IsString()
  @MinLength(3)
  login: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password (min 6 characters)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Role, example: Role.VIEWER, description: 'User role (default: viewer)', default: Role.VIEWER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.VIEWER;
}