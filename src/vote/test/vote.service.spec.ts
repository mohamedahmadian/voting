import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ConflictException, NotFoundException } from '@nestjs/common';
import { VoteService } from '../vote.service';
import { Vote } from '../../utility/entities/vote.entity';
import { Poll } from '../../utility/entities/poll.entity';
import { Option } from '../../utility/entities/option.entity';
import { User } from '../../utility/entities/user.entity';
import { ClientService } from '../../client/client.service';
import { CreateVoteDto } from '../dto/create-vote.dto';

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockClientService = () => ({
  broadCastMessage: jest.fn(),
});

describe('VoteService', () => {
  let service: VoteService;
  let voteRepository: Repository<Vote>;
  let pollRepository: Repository<Poll>;
  let optionRepository: Repository<Option>;
  let userRepository: Repository<User>;
  let clientService: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        { provide: getRepositoryToken(Vote), useValue: mockRepository() },
        { provide: getRepositoryToken(Poll), useValue: mockRepository() },
        { provide: getRepositoryToken(Option), useValue: mockRepository() },
        { provide: getRepositoryToken(User), useValue: mockRepository() },
        { provide: ClientService, useValue: mockClientService() },
      ],
    }).compile();

    service = module.get<VoteService>(VoteService);
    voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
    pollRepository = module.get<Repository<Poll>>(getRepositoryToken(Poll));
    optionRepository = module.get<Repository<Option>>(
      getRepositoryToken(Option),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    clientService = module.get<ClientService>(ClientService);
  });

  describe('registerVote', () => {
    const createVoteDto: CreateVoteDto = {
      pollId: 1,
      optionId: 2,
      userId: 3,
    };

    it('should successfully register a vote', async () => {
      const poll = { id: 1, title: 'Test Poll' };
      const option = { id: 2, title: 'Option A', poll };
      const user = { id: 3, username: 'TestUser' };
      const vote = { id: 4, user, poll, option };

      jest.spyOn(pollRepository, 'findOne').mockResolvedValue(poll as any);
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(option as any);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(voteRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(voteRepository, 'create').mockReturnValue(vote as any);
      jest.spyOn(voteRepository, 'save').mockResolvedValue(vote as any);

      const result = await service.registerVote(createVoteDto);

      expect(result).toEqual({
        message: 'user voted successfully',
        data: {
          user: `${user.username} - (${user.username})`,
          poll: poll.title,
          option: option.title,
        },
      });
      expect(clientService.broadCastMessage).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if poll is not found', async () => {
      jest.spyOn(pollRepository, 'findOne').mockResolvedValue(null);

      await expect(service.registerVote(createVoteDto)).rejects.toThrow(
        new NotFoundException('Poll not found'),
      );
    });

    it('should throw NotFoundException if option is not found', async () => {
      jest.spyOn(pollRepository, 'findOne').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.registerVote(createVoteDto)).rejects.toThrow(
        new NotFoundException('Option not found'),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(pollRepository, 'findOne').mockResolvedValue({ id: 1 } as any);
      jest
        .spyOn(optionRepository, 'findOne')
        .mockResolvedValue({ id: 2 } as any);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.registerVote(createVoteDto)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('should throw ConflictException if user has already voted', async () => {
      const poll = { id: 1 };
      const option = { id: 2, poll };
      const user = { id: 3, username: 'TestUser' };
      const existingVote = { createdAt: new Date() };

      jest.spyOn(pollRepository, 'findOne').mockResolvedValue(poll as any);
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(option as any);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);
      jest
        .spyOn(voteRepository, 'findOne')
        .mockResolvedValue(existingVote as any);

      await expect(service.registerVote(createVoteDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
