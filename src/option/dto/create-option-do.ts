import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the option',
    example: 'a sample title',
    type: String,
  })
  text: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Poll Id',
    example: 12,
    type: Number,
  })
  pollId: number; // Poll ID to which this option belongs
}
