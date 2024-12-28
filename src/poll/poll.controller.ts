import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UpdatePollDto } from './dto/update-poll.dto';
import { FindPollDto } from './dto/find-poll.dto';

@ApiTags('Polls')
@Controller('polls')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  @ApiOperation({ summary: 'Create new polls' })
  async create(@Body() createPollDto: CreatePollDto) {
    return this.pollService.create(createPollDto);
  }

  @Get()
  @ApiOperation({ summary: 'Return all polls' })
  async findAll(@Query() query: FindPollDto) {
    return this.pollService.findAll(query);
  }

  @Get('result/:pollId')
  @ApiOperation({ summary: 'Return statistic for selected poll' })
  @ApiQuery({
    name: 'pollId',
    required: false,
    description: 'Filter by poll ID',
    type: String,
  })
  async getPollReport(@Query('pollId', ParseIntPipe) pollId: number) {
    return this.pollService.getPollReport(pollId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'find a poll by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the poll',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pollService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a poll' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the poll to update',
  })
  @ApiBody({
    type: UpdatePollDto,
    description: 'Data to update the poll',
  })
  async update(@Param('id') id: number, @Body() updatePollDto: UpdatePollDto) {
    return this.pollService.update(id, updatePollDto);
  }

  @Delete(':pollId')
  @ApiOperation({ summary: 'Remove a poll' })
  async remove(@Param('pollId') pollId: number): Promise<string> {
    return this.pollService.delete(pollId);
  }
}
