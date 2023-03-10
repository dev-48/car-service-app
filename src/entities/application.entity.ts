import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { user } from './user.entity';
import { car } from './car.entity';

@Entity()
export class application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  registrationDate: string;

  @ManyToOne((type) => user, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  customer: user;

  @ManyToOne((type) => user, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  executor: user;

  @ManyToOne((type) => car, (car) => car.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  car: car;

  @Column({ length: '20' })
  type: string;

  @Column({ length: '50' })
  description: string;

  @Column({ length: '20', default: 'Не в работе' })
  status: string;
}
