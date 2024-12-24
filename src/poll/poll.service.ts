import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePollDto } from './dto/create-poll.dto';
import { Poll } from 'src/utility/entities/poll.entity';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private pollRepository: Repository<Poll>,
  ) {}

  async create(createPollDto: CreatePollDto): Promise<Poll> {
    const poll = this.pollRepository.create(createPollDto);
    return this.pollRepository.save(poll);
  }

  async findAll(): Promise<Poll[]> {
    return this.pollRepository.find();
  }

  async findOne(id: number): Promise<Poll> {
    try {
      const poll = await this.pollRepository.findOneOrFail({
        where: {
          id,
        },
      });
      return poll;
    } catch (error) {
      throw new NotFoundException('Poll Id is not valid');
    }
  }
}
