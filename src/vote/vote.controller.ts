import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Votes')
@Controller('votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new vote' })
  async registerVote(@Body() createVoteDto: CreateVoteDto) {
    try {
      return await this.voteService.registerVote(createVoteDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new NotFoundException(error.message);
    }
  }

  @Get('report/:pollId')
  @ApiOperation({ summary: 'Get vote report for a poll' })
  async getPollReport(@Param('pollId') pollId: number) {
    return this.voteService.getPollReport(pollId);
  }

  @Get('user/most-active')
  @ApiOperation({ summary: 'Most active user in votings' })
  async getActiveUsers() {
    return this.voteService.getActiveUsers();
  }
  @Get('poll/most-active')
  @ApiOperation({ summary: 'Most active user in votings' })
  async getMostActivePolls() {
    return this.voteService.getMostActivePolls();
  }

  @Get('poll/:pollId')
  @ApiOperation({ summary: 'Get votes per poll' })
  async getVotesByPoll(@Param('pollId') pollId: number) {
    return this.voteService.getVotesByPoll(pollId);
  }

  @Get('option/:optionId')
  @ApiOperation({ summary: 'Get votes per option' })
  async getVotesByOption(@Param('optionId') optionId: number) {
    return this.voteService.getVotesByOption(optionId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get votes per poll' })
  async getVotesByUser(@Param('userId') userId: number) {
    return this.voteService.getVotesByUser(userId);
  }
}
