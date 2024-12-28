import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePollDto } from './dto/create-poll.dto';
import { Poll } from '../utility/entities/poll.entity';
import { UpdatePollDto } from './dto/update-poll.dto';
import { FindPollDto } from './dto/find-poll.dto';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private pollRepository: Repository<Poll>,
  ) {}

  async create(createPollDto: CreatePollDto): Promise<Poll> {
    const poll = this.pollRepository.create(createPollDto);
    const existingPoll = await this.pollRepository.findOne({
      where: {
        title: createPollDto.title,
      },
    });
    if (existingPoll) {
      throw new ConflictException(
        'Poll title should be unique, please choose another title',
      );
    }
    return this.pollRepository.save(poll);
  }

  async findAll(params: FindPollDto): Promise<Poll[]> {
    const queryBuilder = this.pollRepository.createQueryBuilder('poll');

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
  async getPollReport(pollId: number) {
    const poll = await this.pollRepository.findOne({
      where: { id: pollId },
      relations: ['votes', 'votes.option'],
    });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    const totalVotes = poll.votes.length;
    const optionVotes = poll.votes.reduce((acc, vote) => {
      const optionTitle = vote.option.title;
      if (!acc[optionTitle]) {
        acc[optionTitle] = 0;
      }
      acc[optionTitle]++;
      return acc;
    }, {});

    return { totalVotes, optionVotes };
  }

  async delete(pollId: number) {
    try {
      const result = await this.pollRepository.delete({ id: pollId });
      if (result.affected > 0) return 'Poll removed successfully';
      else throw new NotFoundException("Poll doesn't exist");
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new HttpException(
          "You can't delete this poll becaause of votings  on this pool",
          400,
        );
    }
  }
}
