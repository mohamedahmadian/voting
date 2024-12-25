import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Option } from './option.entity';
import { Vote } from './vote.entity';
import { Transform } from 'class-transformer';
import * as moment from 'moment';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.polls)
  creator: User;

  @OneToMany(() => Option, (option) => option.poll, { cascade: true })
  options: Option[];

  @OneToMany(() => Vote, (vote) => vote.poll)
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
