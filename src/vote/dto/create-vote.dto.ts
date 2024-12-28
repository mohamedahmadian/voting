import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the poll', example: 1, type: Number })
  @Transform(({ value }) => {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new BadRequestException('Poll ID must be a valid number');
    }
    return parsedValue;
  })
  pollId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the option', example: 1 })
  @Transform(({ value }) => {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new BadRequestException('Option ID must be a valid number');
    }
    return parsedValue;
  })
  optionId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Id of User doing vote', example: 1 })
  @Transform(({ value }) => {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new BadRequestException('User ID must be a valid number');
    }
    return parsedValue;
  })
  userId: number;
}
