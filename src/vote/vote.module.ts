import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { Vote } from 'src/utility/entities/vote.entity';
import { Poll } from 'src/utility/entities/poll.entity';
import { Option } from 'src/utility/entities/option.entity';
import { User } from 'src/utility/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Poll, Option, User])],
  providers: [VoteService],
  controllers: [VoteController],
  exports: [VoteService],
})
export class VoteModule {}
