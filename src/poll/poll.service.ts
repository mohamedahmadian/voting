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
import { UpdatePollDto } from './dto/update-pol.dto';
import { FindPollDto } from './dto/find-poll.dto';
import moment from 'moment';

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

  async findAll(params: FindPollDto): Promise<Poll[]> {
    const queryBuilder = this.pollRepository.createQueryBuilder('poll');

    console.log(params);
    if (params.id) {
      queryBuilder.andWhere('poll.id = :id', { id: params.id });
    }

    if (params.title) {
      queryBuilder.andWhere('poll.title LIKE :title', {
        title: `%${params.title}%`,
      });
    }

    if (params.showOptions) {
      queryBuilder.leftJoinAndSelect('poll.options', 'options');
    }

    return queryBuilder.getMany();
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

  async update(id: number, updatePollDto: UpdatePollDto): Promise<Poll> {
    const poll = await this.pollRepository.findOne({ where: { id } });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    // Update poll properties
    Object.assign(poll, updatePollDto);

    return this.pollRepository.save(poll);
  }
}
