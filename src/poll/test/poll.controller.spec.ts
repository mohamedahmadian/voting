import { Test, TestingModule } from '@nestjs/testing';
import { PollController } from '../poll.controller';
import { PollService } from '../poll.service';
import { CreatePollDto } from '../dto/create-poll.dto';
import { FindPollDto } from '../dto/find-poll.dto';
import { UpdatePollDto } from '../dto/update-poll.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('PollController', () => {
  let pollController: PollController;
  let pollService: PollService;

  const mockPollService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    getPollReport: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollController],
      providers: [{ provide: PollService, useValue: mockPollService }],
    }).compile();

    pollController = module.get<PollController>(PollController);
    pollService = module.get<PollService>(PollService);
  });

  it('should be defined', () => {
    expect(pollController).toBeDefined();
  });

  describe('create', () => {
    it('should create a poll', async () => {
      const createPollDto: CreatePollDto = {
        title: 'Sample Poll',
        description: 'Sample Description',
      };
      mockPollService.create.mockResolvedValue({ id: 1, ...createPollDto });

      const result = await pollController.create(createPollDto);
      expect(result).toEqual({
        id: 1,
        title: 'Sample Poll',
        description: 'Sample Description',
      });
      expect(mockPollService.create).toHaveBeenCalledWith(createPollDto);
    });

    it('should throw ConflictException if poll title already exists', async () => {
      const createPollDto: CreatePollDto = {
        title: 'Existing Poll',
        description: 'Some description',
      };
      mockPollService.create.mockRejectedValue(
        new ConflictException('Poll already exists'),
      );

      await expect(pollController.create(createPollDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all polls with filters', async () => {
      const findPollDto: FindPollDto = {
        title: 'Sample Poll',
        showOptions: true,
      };
      const polls = [{ id: 1, title: 'Poll 1', description: 'Description 1' }];
      mockPollService.findAll.mockResolvedValue(polls);

      const result = await pollController.findAll(findPollDto);
      expect(result).toEqual(polls);
      expect(mockPollService.findAll).toHaveBeenCalledWith(findPollDto);
    });
  });

  describe('findOne', () => {
    it('should return a poll by id', async () => {
      const poll = { id: 1, title: 'Poll 1', description: 'Description 1' };
      mockPollService.findOne.mockResolvedValue(poll);

      const result = await pollController.findOne(1);
      expect(result).toEqual(poll);
      expect(mockPollService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if poll is not found', async () => {
      mockPollService.findOne.mockRejectedValue(
        new NotFoundException('Poll not found'),
      );

      await expect(pollController.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a poll with new data', async () => {
      const updatePollDto: UpdatePollDto = { title: 'Updated Title' };
      const updatedPoll = {
        id: 1,
        title: 'Updated Title',
        description: 'Updated Description',
      };
      mockPollService.update.mockResolvedValue(updatedPoll);

      const result = await pollController.update(1, updatePollDto);
      expect(result).toEqual(updatedPoll);
      expect(mockPollService.update).toHaveBeenCalledWith(1, updatePollDto);
    });

    it('should throw NotFoundException if poll to update does not exist', async () => {
      const updatePollDto: UpdatePollDto = { title: 'Updated Title' };
      mockPollService.update.mockRejectedValue(
        new NotFoundException('Poll not found'),
      );

      await expect(pollController.update(1, updatePollDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a poll', async () => {
      mockPollService.delete.mockResolvedValue('Poll removed successfully');

      const result = await pollController.remove(1);
      expect(result).toEqual('Poll removed successfully');
      expect(mockPollService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if poll does not exist to delete', async () => {
      mockPollService.delete.mockRejectedValue(
        new NotFoundException('Poll not found'),
      );

      await expect(pollController.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
