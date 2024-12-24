import { IsNumber } from 'class-validator';

export class RemoveOptionDto {
  @IsNumber()
  pollId: number;

  @IsNumber()
  optionId: number;
}
