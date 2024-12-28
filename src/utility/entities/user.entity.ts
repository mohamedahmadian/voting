import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';
import { Exclude, Transform } from 'class-transformer';
import * as moment from 'moment';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Poll, (poll) => poll.creator)
  polls: Poll[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => {
    return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : value;
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => {
    return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : value;
  })
  updatedAt: Date;
}
