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
import { CreateOptionDto } from './dto/create-option.do';
import { UpdateOptionDto } from './dto/update-option.dto';
import { FindOptionDto } from './dto/find-option.dto';

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
        title: createOptionDto.title,
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
      title: createOptionDto.title,
      description: createOptionDto.description,
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

  async findAll(findOptionDto: FindOptionDto): Promise<Option[]> {
    const queryBuilder = this.optionRepository.createQueryBuilder('option');

    if (findOptionDto.id) {
      queryBuilder.andWhere('option.id = :id', { id: findOptionDto.id });
    }

    if (findOptionDto.title) {
      queryBuilder.andWhere('option.title LIKE :title', {
        title: `%${findOptionDto.title}%`,
      });
    }

    if (findOptionDto.pollId) {
      queryBuilder.andWhere('option.pollId = :pollId', {
        pollId: findOptionDto.pollId,
      });
    }

    return queryBuilder.getMany();
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

  async update(id: number, updateOptionDto: UpdateOptionDto): Promise<Option> {
    const option = await this.optionRepository.findOne({
      where: {
        id,
      },
    });

    if (!option) {
      throw new NotFoundException('Option not found');
    }

    if (updateOptionDto.title) {
      option.title = updateOptionDto.title;
    }

    return this.optionRepository.save(option);
  }
}
