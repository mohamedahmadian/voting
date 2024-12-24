// update-option.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOptionDto {
  @ApiProperty({
    description: 'The title of the option',
    example: 'Option A',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;
}
