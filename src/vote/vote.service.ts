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
import { ClientService } from '../client/client.service';
import { MessageTypeEnum } from '../client/enum/messageType.enum';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
    @InjectRepository(Poll) private pollRepository: Repository<Poll>,
    @InjectRepository(Option) private optionRepository: Repository<Option>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly clientServie: ClientService,
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
  async registerVote(createVoteDto: CreateVoteDto) {
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

    await this.voteRepository.save(vote);
    this.notify(user, poll, option);
    return {
      message: 'user voted successfully',
      data: {
        user: `${user.username} - (${user.username})`,
        poll: poll.title,
        option: option.title,
      },
    };
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
    this.clientServie.broadCastMessage(
      MessageTypeEnum.text,
      ` new Vote from (${user.name}) for Poll (${poll.title}) by selecting (${option.title})`,
    );

    this.clientServie.broadCastMessage(
      MessageTypeEnum.poll,
      poll.id.toString(),
    );
  }
}
