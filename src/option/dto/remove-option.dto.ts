import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RemoveOptionDto {
  @ApiProperty({
    description: 'The ID of the poll from which the option will be removed',
    example: 1,
  })
  @IsNumber()
  pollId: number;

  @ApiProperty({
    description: 'The ID of the option to be removed',
    example: 2,
  })
  @IsNumber()
  optionId: number;
}
