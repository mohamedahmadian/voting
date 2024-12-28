import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from '../option.service';
import { CreateOptionDto } from '../dto/create-option.do';
import { FindOptionDto } from '../dto/find-option.dto';
import { OptionsController } from '../option.controller';

describe('OptionsController', () => {
  let controller: OptionsController;
  let service: OptionsService;

  const mockOptionsService = {
    create: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
    findOption: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionsController],
      providers: [
        {
          provide: OptionsService,
          useValue: mockOptionsService,
        },
      ],
    }).compile();

    controller = module.get<OptionsController>(OptionsController);
    service = module.get<OptionsService>(OptionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOption', () => {
    it('should call create on the service with the correct DTO', async () => {
      const createOptionDto: CreateOptionDto = {
        pollId: 1,
        title: 'Option A',
      };
      const createdOption = { id: 1, ...createOptionDto };
      mockOptionsService.create.mockResolvedValue(createdOption);

      const result = await controller.createOption(createOptionDto);

      expect(service.create).toHaveBeenCalledWith(createOptionDto);
      expect(result).toEqual(createdOption);
    });
  });

  describe('removeOption', () => {
    it('should call remove on the service with the correct ID', async () => {
      const optionId = 1;
      const message = 'Option removed successfully.';
      mockOptionsService.remove.mockResolvedValue(message);

      const result = await controller.remove(optionId);

      expect(service.remove).toHaveBeenCalledWith(optionId);
      expect(result).toBe(message);
    });
  });

  describe('findAll', () => {
    it('should call findAll on the service with the correct query', async () => {
      const findOptionDto: FindOptionDto = { pollId: 1 };
      const options = [{ id: 1, title: 'Option A' }];
      mockOptionsService.findAll.mockResolvedValue(options);

      const result = await controller.findAll(findOptionDto);

      expect(service.findAll).toHaveBeenCalledWith(findOptionDto);
      expect(result).toEqual(options);
    });
  });

  describe('findOption', () => {
    it('should call findOption on the service with the correct ID', async () => {
      const optionId = 1;
      const option = { id: 1, title: 'Option A' };
      mockOptionsService.findOption.mockResolvedValue(option);

      const result = await controller.findOption(optionId);

      expect(service.findOption).toHaveBeenCalledWith(optionId);
      expect(result).toEqual(option);
    });
  });
});
