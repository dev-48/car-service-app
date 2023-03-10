import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { application } from '../../../entities/application.entity';
import { tool } from '../../../entities/tool.entity';
import { applicationTool } from '../../../entities/applicationTool.entity';

@Injectable()
export class ToolsService {
  constructor(
    @InjectRepository(applicationTool)
    private applicationToolRepository: Repository<applicationTool>,
    @InjectRepository(tool)
    private toolRepository: Repository<tool>,
    @InjectRepository(application)
    private applicationRepository: Repository<application>,
  ) {}
  async getTools(): Promise<object> {
    return await this.toolRepository.find();
  }

  async getToolsApplication(applicationId: number): Promise<object> {
    return await this.applicationToolRepository
      .createQueryBuilder()
      .select(['id', 'applicationId', 'toolId'])
      .where('applicationId = :applicationId', {
        applicationId: Number(applicationId),
      })
      .getRawMany()
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }

  async addTool(title: string): Promise<object> {
    await this.toolRepository
      .insert({
        title: title,
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    return {
      statusCode: HttpStatus.OK,
      message: 'Tool added',
    };
  }

  async removeTool(toolId: number): Promise<object> {
    const tool = await this.toolRepository
      .findOne({ where: { id: toolId } })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    if (!tool) throw new BadRequestException('Invalid tool id');
    await this.toolRepository.delete(tool.id).catch(() => {
      throw new InternalServerErrorException();
    });
    return {
      statusCode: HttpStatus.GONE,
      message: 'The tool has been removed',
    };
  }

  async addToolToApplication(
    toolId: number,
    applicationId: number,
  ): Promise<object> {
    const tool = await this.toolRepository
      .findOne({ where: { id: toolId } })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    const application = await this.applicationRepository
      .findOne({
        where: { id: applicationId },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    if (!tool || !application) throw new BadRequestException('Invalid tool id');
    await this.applicationToolRepository
      .insert({
        application: application,
        tool: tool,
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    return {
      statusCode: HttpStatus.GONE,
      message: 'The tool has been added',
    };
  }

  async removeToolFromApplication(
    toolId: number,
    applicationId: number,
  ): Promise<object> {
    const tool = await this.toolRepository
      .findOne({ where: { id: toolId } })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    const application = await this.applicationRepository
      .findOne({
        where: { id: applicationId },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    if (!tool || !application) throw new BadRequestException('Invalid tool id');
    await this.applicationToolRepository
      .delete({
        application: application,
        tool: tool,
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    return {
      statusCode: HttpStatus.GONE,
      message: 'The tool has been removed',
    };
  }
}
