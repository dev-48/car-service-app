import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { application } from './application.entity';
import { tool } from './tool.entity';

@Entity()
export class applicationTool {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => application, (application) => application.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  application: application;

  @ManyToOne((type) => tool, (tool) => tool.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tool: tool;
}
