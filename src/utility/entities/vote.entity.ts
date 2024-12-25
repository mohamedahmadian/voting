import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Poll } from './poll.entity';
import { Option } from './option.entity';
import { Transform } from 'class-transformer';
import * as moment from 'moment';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Poll, (poll) => poll.votes)
  @JoinColumn({ name: 'pollId' })
  poll: Poll;

  @ManyToOne(() => Option, (option) => option.votes)
  @JoinColumn({ name: 'optionId' })
  option: Option;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => {
    return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : value;
  })
  createdAt: Date;
}
