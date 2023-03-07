import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  DeleteDataValidator,
  UpdateDataValidator,
  UpdateUserDataValidator,
} from './users.dto';

@Controller({ version: '1', path: 'users' })
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getUsers(): Promise<object> {
    return this.UsersService.getClients();
  }

  @HttpCode(HttpStatus.OK)
  @Get('staff')
  getWorkers(): Promise<object> {
    return this.UsersService.getWorkers();
  }

  @HttpCode(HttpStatus.GONE)
  @Delete('delete')
  deleteUser(@Body() body: DeleteDataValidator): Promise<object> {
    return this.UsersService.deleteUser(body.id);
  }

  @HttpCode(HttpStatus.OK)
  @Put('role')
  updateRole(@Body() body: UpdateDataValidator): Promise<object> {
    return this.UsersService.updateRole(body.id, body.role);
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  updateUser(@Body() body: UpdateUserDataValidator): Promise<object> {
    return this.UsersService.updateUser(body);
  }
}
