import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'oldPassword123',
    description: 'Current password of the user',
    minLength: 4,
    required: true,
  })
  @IsString()
  @MinLength(4)
  oldPassword: string;

  @ApiProperty({
    example: 'newPassword456',
    description: 'New password (min 6 characters)',
    minLength: 4,
    required: true,
  })
  @IsString()
  @MinLength(4)
  newPassword: string;
}
