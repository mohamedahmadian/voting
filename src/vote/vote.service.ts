import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from 'src/utility/entities/vote.entity';
import { Poll } from 'src/utility/entities/poll.entity';
import { User } from 'src/utility/entities/user.entity';
import { Option } from 'src/utility/entities/option.entity';
import * as moment from 'moment';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
    @InjectRepository(Poll) private pollRepository: Repository<Poll>,
    @InjectRepository(Option) private optionRepository: Repository<Option>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async registerVote(createVoteDto: CreateVoteDto): Promise<Vote> {
    const { pollId, optionId, userId } = createVoteDto;

    const poll = await this.pollRepository.findOne({ where: { id: pollId } });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    const option = await this.optionRepository.findOne({
      where: { id: optionId, poll: { id: pollId } },
    });
    if (!option) {
      throw new NotFoundException('Option not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingVote = await this.voteRepository.findOne({
      where: { user: { id: userId }, poll: { id: pollId } },
    });
    if (existingVote) {
      throw new ConflictException('User has already voted for this poll');
    }

    const vote = this.voteRepository.create({
      user: { id: userId },
      poll: { id: pollId },
      option: { id: optionId },
    });

    return this.voteRepository.save(vote);
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

    // const optionVotesArray = Object.entries(optionVotes).map(
    //   ([option, votes]) => ({
    //     option,
    //     votes,
    //   }),
    // );

    return { totalVotes, optionVotes };
  }

  async getVotesByPoll(pollId: number): Promise<Vote[]> {
    return this.voteRepository.find({
      where: { poll: { id: pollId } },
      relations: ['option', 'user'],
    });
  }

  async getVotesByOption(optionId: number) {
    return this.voteRepository.find({
      where: { option: { id: optionId } },
      relations: ['user', 'poll'],
    });
  }

  async getActiveUsers(): Promise<{ name: string; voteCount: number }[]> {
    const activeUsers = await this.voteRepository
      .createQueryBuilder('vote')
      .select('user.name', 'name')
      .addSelect('COUNT(vote.id)', 'vote_count')
      .innerJoin('vote.user', 'user')
      .groupBy('user.id')
      .addGroupBy('user.name')
      .orderBy('vote_count', 'DESC')
      .getRawMany();

    return activeUsers.map((user) => ({
      name: user.name,
      voteCount: parseInt(user.vote_count, 10), // Ensure proper numeric format
    }));
  }

  async getMostActivePolls(): Promise<
    { pollTitle: string; voteCount: number }[]
  > {
    const pollParticipation = await this.voteRepository
      .createQueryBuilder('vote')
      .select('poll.title', 'pollTitle')
      .addSelect('COUNT(vote.id)', 'vote_count')
      .innerJoin('vote.poll', 'poll')
      .groupBy('poll.id')
      .addGroupBy('poll.title')
      .orderBy('vote_count', 'DESC')
      .getRawMany();

    return pollParticipation;
  }

  async getVotesByUser(userId: number) {
    const votes = await this.voteRepository.find({
      where: { user: { id: userId } },
      relations: ['option', 'poll'],
    });
    return votes.map((item) => {
      return {
        id: item.id,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        poll: item.poll.title,
        option: item.option.title,
      };
    });
  }
}
