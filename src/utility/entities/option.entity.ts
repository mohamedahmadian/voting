import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Poll, (poll) => poll.options)
  poll: Poll;

  @OneToMany(() => Vote, (vote) => vote.option)
  votes: Vote[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
