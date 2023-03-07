import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class user {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  surname: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 20 })
  patronymic: string;

  @Column({ length: 20 })
  gender: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column({ length: 50, nullable: false, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 20, default: 'user' })
  role: string;
}
