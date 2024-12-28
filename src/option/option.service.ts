import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from '../utility/entities/option.entity';
import { Poll } from '../utility/entities/poll.entity';
import { Like, Repository } from 'typeorm';
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
        "Option title can't be repetitive!, please choose another title",
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

  async remove(optionId: number): Promise<string> {
    try {
      const result = await this.optionRepository.delete({ id: optionId });
      if (result.affected > 0) return 'Option removed successfully.';
      else throw new NotFoundException('Option not found');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else
        throw new HttpException(
          "You can't delete this poll because of votings  on this option",
          400,
        );
    }
  }

  async findAll(findOptionDto: FindOptionDto): Promise<Option[]> {
    const where: any = {};
    if (findOptionDto.id) {
      where.id = findOptionDto.id;
    }
    if (findOptionDto.pollId) {
      where.poll = {
        id: findOptionDto.pollId,
      };
    }
    if (findOptionDto.title) {
      where.title = Like(`%${findOptionDto.title}%`);
    }
    return this.optionRepository.find({ where });
  }

  async findOption(optionId: number): Promise<Option> {
    const option = await this.optionRepository.findOne({
      where: {
        id: optionId,
      },
    });
    if (!option) {
      throw new NotFoundException('Option not found');
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
