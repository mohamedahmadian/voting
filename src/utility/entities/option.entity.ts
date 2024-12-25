import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';
import { Transform } from 'class-transformer';
import * as moment from 'moment';

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
  @Transform(({ value }) => {
    return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : value;
  })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => {
    return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : value;
  })
  updatedAt: Date;
}
