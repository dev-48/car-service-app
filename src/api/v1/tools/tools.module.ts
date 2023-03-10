import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { application } from '../../../entities/application.entity';
import { applicationTool } from '../../../entities/applicationTool.entity';
import { tool } from '../../../entities/tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([application, tool, applicationTool])],
  providers: [ToolsService],
  controllers: [ToolsController],
})
export class ToolsModule {}
