import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from '../utility/entities/vote.entity';
import { Poll } from '../utility/entities/poll.entity';
import { User } from '../utility/entities/user.entity';
import { Option } from '../utility/entities/option.entity';
import * as moment from 'moment';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
    @InjectRepository(Poll) private pollRepository: Repository<Poll>,
    @InjectRepository(Option) private optionRepository: Repository<Option>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * user can only vote one time,
   * after voting, notification system will be fired to notify all users about the vote
   *
   *
   *
   * @param {CreateVoteDto} createVoteDto
   * @return {*}  {Promise<Vote>}
   * @memberof VoteService
   */
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
      throw new ConflictException(
        `User has already voted for this poll at ${moment(existingVote.createdAt).format('YYYY-MM-DD HH:mm:ss')}`,
      );
    }

    const vote = this.voteRepository.create({
      user,
      poll,
      option,
    });

    const voteResult = await this.voteRepository.save(vote);
    this.notify(user, poll, option);
    return voteResult;
  }

  /**
   * We send to type of notification for all users connected to websocket server
   * - first: information about new vote
   * - second : a full report of selected pool
   *
   * @param {User} user
   * @param {Poll} poll
   * @param {Option} option
   * @memberof VoteService
   */
  async notify(user: User, poll: Poll, option: Option) {
    this.eventEmitter.emit(
      'broadcastMessage',
      ` new Vote from (${user.name}) for Poll (${poll.title}) by selecting (${option.title})`,
    );

    const voteReport = await this.getPollReport(poll.id);
    this.eventEmitter.emit('broadcastMessage', `${JSON.stringify(voteReport)}`);
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

    const optionVotesArray = Object.entries(optionVotes).map(
      ([option, votes]) => ({
        option,
        votes,
      }),
    );

    return { poll: poll.title, totalVotes, optionVotesArray };
  }

  /**
   * Get all votes by selecting specific pool which return selected user and option in each row
   *
   * @param {number} pollId
   * @return {*}
   * @memberof VoteService
   */
  async getVotesByPoll(pollId: number) {
    const votes = await this.voteRepository.find({
      where: { poll: { id: pollId } },
      relations: ['option', 'user'],
    });
    return votes.map((item) => {
      return {
        id: item.id,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        option: item.option.title,
        user: item.user.name + `(${item.user.username})`,
      };
    });
  }

  /**
   *
   * Get all votes by selecting specific option which return selected user and poll in each row
   * @param {number} optionId
   * @return {*}
   * @memberof VoteService
   */
  async getVotesByOption(optionId: number) {
    const votes = await this.voteRepository.find({
      where: { option: { id: optionId } },
      relations: ['user', 'poll'],
    });
    return votes.map((item) => {
      return {
        id: item.id,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        poll: item.poll.title,
        user: item.user.name + `(${item.user.username})`,
      };
    });
  }

  /**
   * Return an ordered list of users with most particiption in voting
   *
   * @return {*}  {Promise<{ name: string; voteCount: number }[]>}
   * @memberof VoteService
   */
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

  /**
   * Return an ordered list of polla with most participations
   *
   * @return {*}  {Promise<
   *     { pollTitle: string; voteCount: number }[]
   *   >}
   * @memberof VoteService
   */
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

  /**
   * Return all votes from selected user returning selected poll and option in each row
   *
   * @param {number} userId
   * @return {*}
   * @memberof VoteService
   */
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
