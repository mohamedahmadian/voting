import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OptionsService } from './option.service';
import { CreateOptionDto } from './dto/create-option.do';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindOptionDto } from './dto/find-option.dto';

@ApiTags('Options')
@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new option' })
  async createOption(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @Delete(':optionId')
  @ApiOperation({ summary: 'Remove an option from a poll' })
  async removeOption(@Param('optionId') optionId: number): Promise<string> {
    return this.optionsService.removeOptionFromPoll(optionId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all options' })
  async findAll(@Query() findOptionDto: FindOptionDto) {
    return this.optionsService.findAll(findOptionDto);
  }

  @Get(':optionId')
  @ApiOperation({ summary: 'Get an option by ID' })
  async findOption(@Param('optionId') optionId: number) {
    return this.optionsService.findOption(optionId);
  }
}
