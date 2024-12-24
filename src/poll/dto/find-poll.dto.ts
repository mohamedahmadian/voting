import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

export class FindPollDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The ID of the poll to filter by',
    required: false,
  })
  id?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'The title of the poll to filter by',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Show poll opions flag',
    required: false,
    default: false,
    type: Boolean,
  })
  @Transform(({ value }) => value === 'true')
  showOptions: boolean = false;
}
