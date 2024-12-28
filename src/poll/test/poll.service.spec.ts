import { Test, TestingModule } from '@nestjs/testing';
import { PollService } from '../poll.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Poll } from '../../utility/entities/poll.entity';
import {
  ConflictException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { CreatePollDto } from '../dto/create-poll.dto';
import { FindPollDto } from '../dto/find-poll.dto';
import { UpdatePollDto } from '../dto/update-poll.dto';

describe('PollService', () => {
  let pollService: PollService;
  let pollRepository: Repository<Poll>;

  const createQueryBuilderMock = {
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };

  const mockPollRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    createQueryBuilder: jest.fn(() => createQueryBuilderMock),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollService,
        {
          provide: getRepositoryToken(Poll),
          useValue: mockPollRepository,
        },
      ],
    }).compile();

    pollService = module.get<PollService>(PollService);
    pollRepository = module.get<Repository<Poll>>(getRepositoryToken(Poll));
  });

  it('should be defined', () => {
    expect(pollService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new poll', async () => {
      const createPollDto: CreatePollDto = {
        title: 'Sample Poll',
        description: 'Sample Description',
      };
      const createdPoll = { id: 1, ...createPollDto };
      mockPollRepository.create.mockReturnValue(createdPoll);
      mockPollRepository.save.mockResolvedValue(createdPoll);
      mockPollRepository.findOne.mockResolvedValue(null);

      const result = await pollService.create(createPollDto);
      expect(result).toEqual(createdPoll);
      expect(mockPollRepository.create).toHaveBeenCalledWith(createPollDto);
      expect(mockPollRepository.save).toHaveBeenCalledWith(createdPoll);
    });

    it('should throw ConflictException if poll title already exists', async () => {
      const createPollDto: CreatePollDto = {
        title: 'Existing Poll',
        description: 'Description',
      };
      mockPollRepository.findOne.mockResolvedValue({ title: 'Existing Poll' });

      await expect(pollService.create(createPollDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of polls', async () => {
      const findPollDto: FindPollDto = {
        title: 'Sample Poll',
        showOptions: true,
      };
      const polls = [{ id: 1, title: 'Poll 1', description: 'Description 1' }];

      mockPollRepository.createQueryBuilder().getMany.mockResolvedValue(polls);

      const result = await pollService.findAll(findPollDto);
      expect(result).toEqual(polls);
      expect(mockPollRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a poll by id', async () => {
      const poll = { id: 1, title: 'Poll 1', description: 'Description 1' };
      mockPollRepository.findOneOrFail.mockResolvedValue(poll);

      const result = await pollService.findOne(1);
      expect(result).toEqual(poll);
      expect(mockPollRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if poll not found', async () => {
      mockPollRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException('Poll Id is not valid'),
      );

      await expect(pollService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a poll', async () => {
      const updatePollDto: UpdatePollDto = { title: 'Updated Title' };
      const existingPoll = {
        id: 1,
        title: 'Old Title',
        description: 'Old Description',
      };
      const updatedPoll = { ...existingPoll, ...updatePollDto };
      mockPollRepository.findOne.mockResolvedValue(existingPoll);
      mockPollRepository.save.mockResolvedValue(updatedPoll);

      const result = await pollService.update(1, updatePollDto);
      expect(result).toEqual(updatedPoll);
      expect(mockPollRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPollRepository.save).toHaveBeenCalledWith(updatedPoll);
    });

    it('should throw NotFoundException if poll not found', async () => {
      const updatePollDto: UpdatePollDto = { title: 'Updated Title' };
      mockPollRepository.findOne.mockResolvedValue(null);

      await expect(pollService.update(1, updatePollDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPollReport', () => {
    it('should return poll report', async () => {
      const poll = {
        id: 1,
        votes: [
          { option: { title: 'Option 1' } },
          { option: { title: 'Option 1' } },
        ],
      };
      mockPollRepository.findOne.mockResolvedValue(poll);

      const result = await pollService.getPollReport(1);
      expect(result).toEqual({
        totalVotes: 2,
        optionVotes: { 'Option 1': 2 },
      });
    });

    it('should throw NotFoundException if poll not found', async () => {
      mockPollRepository.findOne.mockResolvedValue(null);

      await expect(pollService.getPollReport(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a poll successfully', async () => {
      mockPollRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await pollService.delete(1);
      expect(result).toEqual('Poll removed successfully');
      expect(mockPollRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw HttpException if poll cannot be deleted', async () => {
      mockPollRepository.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(pollService.delete(1)).rejects.toThrow(HttpException);
    });
  });
});
