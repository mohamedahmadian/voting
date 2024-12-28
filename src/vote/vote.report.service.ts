import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../utility/entities/vote.entity';
import { Poll } from '../utility/entities/poll.entity';
import * as moment from 'moment';

@Injectable()
export class VoteReportService {
  constructor(
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
    @InjectRepository(Poll) private pollRepository: Repository<Poll>,
  ) {}

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
