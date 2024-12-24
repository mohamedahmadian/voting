import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Option } from './option.entity';
import { Poll } from './poll.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @ManyToOne(() => Poll, (poll) => poll.votes)
  poll: Poll;

  @ManyToOne(() => Option, (option) => option.votes)
  option: Option;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
