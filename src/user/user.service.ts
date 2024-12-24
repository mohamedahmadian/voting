import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/utility/entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { username, password, name } = createUserDto;

    // Check if username already exists
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      name,
    });
    const user = await this.userRepository.save(newUser);
    return {
      name: user.name,
      username: user.username,
      id: user.id,
      createdAt: user.createdAt,
    };
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['votes'],
    });
  }

  async findAll(param: FindUserDto): Promise<User[]> {
    const relations: string[] = [];
    const { showVotes, showPolls, username } = param;

    if (showVotes) {
      relations.push('votes');
    }

    if (showPolls) {
      relations.push('polls');
    }

    const queryOptions: any = {
      select: ['id', 'username', 'name', 'votes'],
      relations,
    };

    if (username) {
      queryOptions.where = { username };
    }

    return this.userRepository.find(queryOptions);
  }
  async findAllByPoll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['polls'],
      select: ['id', 'username', 'name', 'votes'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
