import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updae.user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'update user' })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId') userId: number,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'User ID',
  })
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
  @ApiOperation({ summary: 'Return all users' })
  async findAll(
    @Query('username') username: string = '',
    @Query('showVotes') showVotes?: boolean,
    @Query('showPolls') showPolls?: boolean,
  ) {
    return this.userService.findAll({ username, showPolls, showVotes });
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'User ID',
  })
  @ApiOperation({ summary: 'Delete a user by ID' })
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
