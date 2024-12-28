import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiProperty({
    description: 'The password of user',
    example: 'password',
    type: String,
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The name of user',
    example: 'a sample name',
    type: String,
  })
  name: string;
}
