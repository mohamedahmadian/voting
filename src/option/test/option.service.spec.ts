import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from '../option.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Option } from '../../utility/entities/option.entity';
import { Poll } from '../../utility/entities/poll.entity';
import { NotFoundException, HttpException } from '@nestjs/common';
import { CreateOptionDto } from '../dto/create-option.do';
import { FindOptionDto } from '../dto/find-option.dto';
import { UpdateOptionDto } from '../dto/update-option.dto';

describe('OptionsService', () => {
  let service: OptionsService;
  let optionRepository: Repository<Option>;
  let pollRepository: Repository<Poll>;
  const createQueryBuilderMock = {
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };

  const mockOptionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => createQueryBuilderMock),
  };

  const mockPollRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionsService,
        {
          provide: getRepositoryToken(Option),
          useValue: mockOptionRepository,
        },
        {
          provide: getRepositoryToken(Poll),
          useValue: mockPollRepository,
        },
      ],
    }).compile();

    service = module.get<OptionsService>(OptionsService);
    optionRepository = module.get<Repository<Option>>(
      getRepositoryToken(Option),
    );
    pollRepository = module.get<Repository<Poll>>(getRepositoryToken(Poll));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new option if poll exists and option is unique', async () => {
      const createOptionDto: CreateOptionDto = {
        pollId: 1,
        title: 'Option A',
        description: 'Description A',
      };
      const poll = { id: 1, title: 'Poll 1' };

      mockPollRepository.findOne.mockResolvedValue(poll);
      mockOptionRepository.findOne.mockResolvedValue(null);
      mockOptionRepository.create.mockReturnValue(createOptionDto);
      mockOptionRepository.save.mockResolvedValue(createOptionDto);

      const result = await service.create(createOptionDto);

      expect(pollRepository.findOne).toHaveBeenCalledWith({
        where: { id: createOptionDto.pollId },
      });
      expect(optionRepository.findOne).toHaveBeenCalledWith({
        where: {
          title: createOptionDto.title,
          poll: { id: createOptionDto.pollId },
        },
      });
      expect(optionRepository.create).toHaveBeenCalledWith({
        title: createOptionDto.title,
        description: createOptionDto.description,
        poll,
      });
      expect(optionRepository.save).toHaveBeenCalledWith(createOptionDto);
      expect(result).toEqual(createOptionDto);
    });

    it('should throw NotFoundException if poll does not exist', async () => {
      const createOptionDto: CreateOptionDto = {
        pollId: 1,
        title: 'Option A',
        description: 'Description A',
      };

      mockPollRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createOptionDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException if option title is not unique', async () => {
      const createOptionDto: CreateOptionDto = {
        pollId: 1,
        title: 'Option A',
        description: 'Description A',
      };
      const poll = { id: 1, title: 'Poll 1' };
      const existingOption = { id: 1, title: 'Option A' };

      mockPollRepository.findOne.mockResolvedValue(poll);
      mockOptionRepository.findOne.mockResolvedValue(existingOption);

      await expect(service.create(createOptionDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('removeOptionFromPoll', () => {
    it('should remove an option if it exists', async () => {
      mockOptionRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.removeOptionFromPoll(1);

      expect(optionRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual('Option removed successfully.');
    });

    it('should throw HttpException if delete fails', async () => {
      mockOptionRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.removeOptionFromPoll(1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all options matching the filter', async () => {
      const findOptionDto: FindOptionDto = { pollId: 1 };
      const options = [{ id: 1, title: 'Option A' }];

      mockOptionRepository
        .createQueryBuilder()
        .getMany.mockResolvedValue(options);

      const result = await service.findAll(findOptionDto);

      expect(optionRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(options);
    });
  });

  describe('findOption', () => {
    it('should return an option if it exists', async () => {
      const option = { id: 1, title: 'Option A' };

      mockOptionRepository.findOne.mockResolvedValue(option);

      const result = await service.findOption(1);

      expect(optionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(option);
    });

    it('should throw NotFoundException if option does not exist', async () => {
      mockOptionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOption(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an option if it exists', async () => {
      const updateOptionDto: UpdateOptionDto = { title: 'Updated Option' };
      const option = { id: 1, title: 'Old Option' };

      mockOptionRepository.findOne.mockResolvedValue(option);
      mockOptionRepository.save.mockResolvedValue({
        ...option,
        ...updateOptionDto,
      });

      const result = await service.update(1, updateOptionDto);

      expect(optionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(optionRepository.save).toHaveBeenCalledWith({
        ...option,
        ...updateOptionDto,
      });
      expect(result).toEqual({ ...option, ...updateOptionDto });
    });

    it('should throw NotFoundException if option does not exist', async () => {
      const updateOptionDto: UpdateOptionDto = { title: 'Updated Option' };

      mockOptionRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateOptionDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
