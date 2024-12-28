import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should call UserService.create with correct parameters', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testUser',
        password: 'password123',
        name: 'Test User',
      };
      mockUserService.create.mockResolvedValue(createUserDto);

      const result = await userController.create(createUserDto);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createUserDto);
    });
  });

  describe('findOne', () => {
    it('should call UserService.findOne with correct ID', async () => {
      const user = { id: 1, username: 'testUser', name: 'Test User' };
      mockUserService.findOne.mockResolvedValue(user);

      const result = await userController.findOne(1);
      expect(userService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should call UserService.findAll with correct parameters', async () => {
      const queryParams = {
        username: 'testUser',
        showVotes: true,
        showPolls: false,
      };
      const users = [
        { id: 1, username: 'testUser1', name: 'Test User 1' },
        { id: 2, username: 'testUser2', name: 'Test User 2' },
      ];
      mockUserService.findAll.mockResolvedValue(users);

      const result = await userController.findAll(
        queryParams.username,
        queryParams.showVotes,
        queryParams.showPolls,
      );
      expect(userService.findAll).toHaveBeenCalledWith(queryParams);
      expect(result).toEqual(users);
    });
  });

  describe('delete', () => {
    it('should call UserService.delete with correct ID', async () => {
      const id = 1;
      mockUserService.delete.mockResolvedValue(
        `User (${id}) deleted successfully`,
      );

      const result = await userController.delete(id);
      expect(userService.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(`User (${id}) deleted successfully`);
    });
  });
});
