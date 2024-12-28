import { Test, TestingModule } from '@nestjs/testing';
import { VoteController } from '../vote.controller';
import { VoteService } from '../vote.service';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { ReportVoteDto } from '../dto/report-vote.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('VoteController', () => {
  let voteController: VoteController;
  let voteService: VoteService;

  const mockVoteService = {
    registerVote: jest.fn(),
    getPollReport: jest.fn(),
    getActiveUsers: jest.fn(),
    getMostActivePolls: jest.fn(),
    getVotesByPoll: jest.fn(),
    getVotesByOption: jest.fn(),
    getVotesByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [
        {
          provide: VoteService,
          useValue: mockVoteService,
        },
      ],
    }).compile();

    voteController = module.get<VoteController>(VoteController);
    voteService = module.get<VoteService>(VoteService);
  });

  it('should be defined', () => {
    expect(voteController).toBeDefined();
  });

  describe('registerVote', () => {
    it('should register a vote successfully', async () => {
      const createVoteDto: CreateVoteDto = {
        pollId: 1,
        optionId: 1,
        userId: 1,
      };
      mockVoteService.registerVote.mockResolvedValue(
        'Vote registered successfully',
      );

      const result = await voteController.registerVote(createVoteDto);
      expect(result).toBe('Vote registered successfully');
      expect(mockVoteService.registerVote).toHaveBeenCalledWith(createVoteDto);
    });

    it('should throw ConflictException if vote is already registered', async () => {
      const createVoteDto: CreateVoteDto = {
        pollId: 1,
        optionId: 1,
        userId: 1,
      };
      mockVoteService.registerVote.mockRejectedValue(
        new ConflictException('Vote already exists'),
      );

      await expect(voteController.registerVote(createVoteDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if poll or option does not exist', async () => {
      const createVoteDto: CreateVoteDto = {
        pollId: 1,
        optionId: 1,
        userId: 1,
      };
      mockVoteService.registerVote.mockRejectedValue(
        new NotFoundException('Poll or option not found'),
      );

      await expect(voteController.registerVote(createVoteDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPollReport', () => {
    it('should return the vote report for a poll', async () => {
      const report: ReportVoteDto = {
        totalVotes: 100,
        optionVotes: [{ option: 'Option 1', votes: 60 }],
      };
      mockVoteService.getPollReport.mockResolvedValue(report);

      const result = await voteController.getPollReport(1);
      expect(result).toEqual(report);
      expect(mockVoteService.getPollReport).toHaveBeenCalledWith(1);
    });
  });

  describe('getActiveUsers', () => {
    it('should return the most active users', async () => {
      const activeUsers = [{ userId: 1, voteCount: 5 }];
      mockVoteService.getActiveUsers.mockResolvedValue(activeUsers);

      const result = await voteController.getActiveUsers();
      expect(result).toEqual(activeUsers);
      expect(mockVoteService.getActiveUsers).toHaveBeenCalled();
    });
  });

  describe('getMostActivePolls', () => {
    it('should return the most active polls', async () => {
      const activePolls = [{ pollId: 1, voteCount: 100 }];
      mockVoteService.getMostActivePolls.mockResolvedValue(activePolls);

      const result = await voteController.getMostActivePolls();
      expect(result).toEqual(activePolls);
      expect(mockVoteService.getMostActivePolls).toHaveBeenCalled();
    });
  });

  describe('getVotesByPoll', () => {
    it('should return votes for a specific poll', async () => {
      const votes = [{ userId: 1, optionId: 1 }];
      mockVoteService.getVotesByPoll.mockResolvedValue(votes);

      const result = await voteController.getVotesByPoll(1);
      expect(result).toEqual(votes);
      expect(mockVoteService.getVotesByPoll).toHaveBeenCalledWith(1);
    });
  });

  describe('getVotesByOption', () => {
    it('should return votes for a specific option', async () => {
      const votes = [{ userId: 1, optionId: 1 }];
      mockVoteService.getVotesByOption.mockResolvedValue(votes);

      const result = await voteController.getVotesByOption(1);
      expect(result).toEqual(votes);
      expect(mockVoteService.getVotesByOption).toHaveBeenCalledWith(1);
    });
  });

  describe('getVotesByUser', () => {
    it('should return votes for a specific user', async () => {
      const votes = [{ pollId: 1, optionId: 1 }];
      mockVoteService.getVotesByUser.mockResolvedValue(votes);

      const result = await voteController.getVotesByUser(1);
      expect(result).toEqual(votes);
      expect(mockVoteService.getVotesByUser).toHaveBeenCalledWith(1);
    });
  });
});
