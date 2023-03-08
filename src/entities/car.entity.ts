import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { user } from './user.entity';

@Entity()
export class car {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => user, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: user;

  @Column({ length: 20 })
  brand: string;

  @Column({ length: 20 })
  color: string;

  @Column({ length: 20 })
  registrationNumber: string;
}
