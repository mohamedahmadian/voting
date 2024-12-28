import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { Vote } from '../utility/entities/vote.entity';
import { Poll } from '../utility/entities/poll.entity';
import { Option } from '../utility/entities/option.entity';
import { User } from '../utility/entities/user.entity';
import { VoteReportService } from './vote.report.service';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Poll, Option, User]), ClientModule],
  providers: [VoteService, VoteReportService],
  controllers: [VoteController],
  exports: [VoteReportService],
})
export class VoteModule {}
