import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Poll, (poll) => poll.creator)
  polls: Poll[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
