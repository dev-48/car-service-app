import {
  Entity,
  JoinColumn,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { user } from './user.entity';

@Entity()
export class token {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: user;

  @Column({ length: 100 })
  token: string;
}
