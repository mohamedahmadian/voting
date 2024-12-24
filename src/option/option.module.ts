import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from 'src/utility/entities/poll.entity';
import { OptionsService } from './option.service';
import { OptionsController } from './option.controller';
import { Option } from 'src/utility/entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option, Poll])],
  providers: [OptionsService],
  controllers: [OptionsController],
})
export class OptionsModule {}
