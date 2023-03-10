import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ApplicationDTO } from '../applications/applications.dto';
import {
  AddToolValidator,
  ApplicationToolsDTO,
  ToolValidator,
  ToolValidatorApplication,
} from './tools.dto';

@Controller({ version: '1', path: 'tools' })
export class ToolsController {
  constructor(private readonly ToolsService: ToolsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getTools(): Promise<object> {
    return this.ToolsService.getTools();
  }

  @HttpCode(HttpStatus.OK)
  @Get('applications')
  getToolsApplication(@Query() query: ApplicationToolsDTO): Promise<object> {
    return this.ToolsService.getToolsApplication(query.applicationId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  addTools(@Body() body: AddToolValidator): Promise<object> {
    return this.ToolsService.addTool(body.title);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('applications/add')
  addToolToApplication(
    @Body() body: ToolValidatorApplication,
  ): Promise<object> {
    return this.ToolsService.addToolToApplication(
      body.toolId,
      body.applicationId,
    );
  }

  @HttpCode(HttpStatus.GONE)
  @Delete()
  delTool(@Body() body: ToolValidator): Promise<object> {
    return this.ToolsService.removeTool(body.toolId);
  }

  @HttpCode(HttpStatus.GONE)
  @Delete('applications/delete')
  delToolFromApplication(
    @Body() body: ToolValidatorApplication,
  ): Promise<object> {
    return this.ToolsService.removeToolFromApplication(
      body.toolId,
      body.applicationId,
    );
  }
}
