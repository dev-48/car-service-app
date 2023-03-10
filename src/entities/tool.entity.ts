import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class tool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  title: string;
}
