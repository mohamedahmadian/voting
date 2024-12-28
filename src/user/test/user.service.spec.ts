import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../utility/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    findOneByOrFail: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if username exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existingUser',
        password: 'password123',
        name: 'Existing User',
      };
      mockUserRepository.findOne.mockResolvedValue({
        username: 'existingUser',
      });

      await expect(userService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should hash password and save new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newUser',
        password: 'password123',
        name: 'New User',
      };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(createUserDto);
      mockUserRepository.save.mockResolvedValue({
        username: 'newUser',
        name: 'New User',
        id: 1,
        createdAt: new Date(),
      });
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await userService.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'newUser',
        password: 'hashedPassword',
        name: 'New User',
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'New User',
        username: 'newUser',
        id: 1,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('findOne', () => {
    it('should return user if found', async () => {
      const user = { id: 1, username: 'testUser', name: 'Test User' };
      mockUserRepository.findOneByOrFail.mockResolvedValue(user);

      const result = await userService.findOne(1);
      expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOneByOrFail.mockRejectedValue(new Error());

      await expect(userService.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all users with optional filters and relations', async () => {
      const users = [
        { id: 1, username: 'user1', name: 'User 1' },
        { id: 2, username: 'user2', name: 'User 2' },
      ];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await userService.findAll({
        username: '',
        showVotes: false,
        showPolls: false,
      });

      expect(userRepository.find).toHaveBeenCalledWith({
        relations: [],
        where: undefined,
      });
      expect(result).toEqual(users);
    });

    it('should include specified relations', async () => {
      const users = [{ id: 1, username: 'user1', name: 'User 1', votes: [] }];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await userService.findAll({
        username: '',
        showVotes: true,
        showPolls: false,
      });

      expect(userRepository.find).toHaveBeenCalledWith({
        relations: ['votes'],
        where: undefined,
      });
      expect(result).toEqual(users);
    });
  });

  describe('delete', () => {
    it('should delete user and return success message', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await userService.delete(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe('User (1) deleted successfully');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(userService.delete(99)).rejects.toThrow(NotFoundException);
    });
  });
});
