import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  ApplicationDeleteValidator,
  ApplicationValidation,
  ChangeStatusValidator,
  ChangeWorkerValidator,
  EditApplicationValidation,
  UserTokenValidation,
} from './applications.dto';

@Controller({ version: '1', path: 'applications' })
export class ApplicationsController {
  constructor(private readonly ApplicationsService: ApplicationsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getApplicationsList(@Query() query: UserTokenValidation): Promise<object> {
    return this.ApplicationsService.getApplications(query.token, query.user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  createApplication(@Body() body: ApplicationValidation): Promise<object> {
    return this.ApplicationsService.create(body);
  }

  @HttpCode(HttpStatus.OK)
  @Put('edit')
  updateApplication(@Body() body: EditApplicationValidation): Promise<object> {
    return this.ApplicationsService.edit(body);
  }

  @HttpCode(HttpStatus.GONE)
  @Delete('delete')
  deleteApplication(@Body() body: ApplicationDeleteValidator): Promise<object> {
    return this.ApplicationsService.delete(body.applicationId);
  }

  @HttpCode(HttpStatus.OK)
  @Put('change/status')
  changeStatusApplication(
    @Body() body: ChangeStatusValidator,
  ): Promise<object> {
    return this.ApplicationsService.changeStatus(
      body.status,
      body.applicationId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Put('change/executor')
  changeWorker(@Body() body: ChangeWorkerValidator): Promise<object> {
    return this.ApplicationsService.changeWorker(
      body.workerId,
      body.applicationId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('staff/mechanics')
  getListOfMechanics(): Promise<object> {
    return this.ApplicationsService.listOfMechanics();
  }
}
