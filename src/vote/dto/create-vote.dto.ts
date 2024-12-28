import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the poll', example: 1 })
  pollId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the option', example: 1 })
  optionId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Id of User doing vote', example: 1 })
  userId: number;
}
