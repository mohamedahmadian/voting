import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../utility/entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updae.user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { username, password, name } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      name,
    });
    const user = await this.userRepository.save(newUser);
    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    await this.userRepository.save(user);
    return user;
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOneByOrFail({ id });
      return user;
    } catch (error) {
      throw new NotFoundException('User not found by this id');
    }
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
      relations,
    };

    if (username) {
      queryOptions.where = { username };
    }

    return this.userRepository.find(queryOptions);
  }

  async delete(id: number): Promise<string> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected > 0) return `User (${id}) deleted successfully`;
      else throw new NotFoundException(`User (${id}) not found`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException("User can't be deleted");
      }
    }
  }
}
