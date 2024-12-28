import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePollDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The title of the poll',
    example: 'Updated Poll Title',
    required: false,
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The description of the poll',
    example: 'This is an updated description for the poll.',
    required: false,
  })
  description?: string;
}
