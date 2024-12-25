import { ApiProperty } from '@nestjs/swagger';

export class ReportVoteDto {
  @ApiProperty({
    description: 'Total number of votes for a poll',
    example: 100,
  })
  totalVotes: number;

  @ApiProperty({
    description: 'Votes per option in a poll',
    example: [
      { option: 'Messi', votes: 60 },
      { option: 'Ronaldo', votes: 40 },
    ],
  })
  optionVotes: { option: string; votes: number }[];
}
