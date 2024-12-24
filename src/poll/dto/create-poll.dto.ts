import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePollDto {
  @ApiProperty({
    description: 'The title of the poll',
    example: 'a sample title',
    type: String,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the poll',
    example: 'some description',
    type: String,
  })
  @IsNotEmpty()
  description: string;
}
