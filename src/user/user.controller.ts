import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Get()
  @ApiQuery({
    name: 'username',
    required: false,
    type: String,
    description: 'The username of the user to filter by',
    example: '',
  })
  @ApiQuery({
    name: 'showVotes',
    required: false,
    type: Boolean,
    description: 'Whether to include the user votes relation',
    example: false,
  })
  @ApiQuery({
    name: 'showPolls',
    required: false,
    type: Boolean,
    description: 'Whether to include the user polls relation',
    example: false,
  })
  async findAll(
    @Query('username') username: string = '',
    @Query('showVotes') showVotes?: boolean,
    @Query('showPolls') showPolls?: boolean,
  ) {
    return this.userService.findAll({ username, showPolls, showVotes });
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
