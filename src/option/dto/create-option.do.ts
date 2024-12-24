import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the option',
    example: 'a sample title',
    type: String,
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The description of the option',
    example: 'a sample description',
    type: String,
  })
  description?: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Poll Id',
    example: 12,
    type: Number,
  })
  pollId: number; // Poll ID to which this option belongs
}
