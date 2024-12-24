import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { OptionsService } from './option.service';
import { CreateOptionDto } from './dto/create-option-do';
import { RemoveOptionDto } from './dto/remove-option-dto';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  async createOption(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @Delete()
  async removeOption(
    @Body() removeOptionDto: RemoveOptionDto,
  ): Promise<string> {
    const { pollId, optionId } = removeOptionDto;
    return this.optionsService.removeOptionFromPoll(pollId, optionId);
  }

  @Get()
  async getAllOptions() {
    return this.optionsService.findAll();
  }

  @Get(':optionId')
  async findOption(@Param('optionId') optionId: number) {
    return this.optionsService.findOption(optionId);
  }

  @Get('poll/:pollId')
  async getOptionsByPoll(@Param('pollId') pollId: number) {
    return this.optionsService.findByPoll(pollId);
  }
}
