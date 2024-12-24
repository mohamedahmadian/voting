import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from 'src/utility/entities/option.entity';
import { Poll } from 'src/utility/entities/poll.entity';
import { Repository } from 'typeorm';
import { CreateOptionDto } from './dto/create-option-do';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
  ) {}

  async create(createOptionDto: CreateOptionDto): Promise<Option> {
    const poll = await this.pollRepository.findOne({
      where: { id: createOptionDto.pollId },
    });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    const existingOption = await this.optionRepository.findOne({
      where: {
        text: createOptionDto.text,
        poll: { id: createOptionDto.pollId },
      },
    });
    if (existingOption) {
      throw new HttpException(
        "Option text can't be repetitive!, please choose another text",
        HttpStatus.CONFLICT,
      );
    }

    const option = this.optionRepository.create({
      text: createOptionDto.text,
      poll,
    });

    return this.optionRepository.save(option);
  }

  async removeOptionFromPoll(
    pollId: number,
    optionId: number,
  ): Promise<string> {
    const option = await this.optionRepository.findOne({
      where: { id: optionId, poll: { id: pollId } },
    });

    if (!option) {
      throw new NotFoundException('Option not found for the specified poll.');
    }

    await this.optionRepository.remove(option);

    return 'Option removed successfully.';
  }

  async findAll(): Promise<Option[]> {
    return this.optionRepository.find({ relations: ['poll'] });
  }

  async findOption(optionId: number): Promise<Option> {
    const option = await this.optionRepository.findOne({
      where: {
        id: optionId,
      },
    });
    if (!option) {
      throw new NotFoundException('Poll not found');
    }
    return option;
  }
  async findByPoll(pollId: number): Promise<Option[]> {
    const poll = await this.pollRepository.findOne({
      where: { id: pollId },
    });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    return this.optionRepository.find({
      where: {
        poll: {
          id: pollId,
        },
      },
    });
  }
}
