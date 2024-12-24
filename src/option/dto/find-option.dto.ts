import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FindOptionDto {
  @ApiProperty({
    description: 'The ID of the option',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: number;

  @ApiProperty({
    description: 'The title of the option to search for',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The ID of the poll the option belongs to',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  pollId?: number;
}
