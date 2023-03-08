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
import { CarsService } from './cars.service';
import {
  AddCarValidator,
  DeleteCarValidation,
  UpdateCarValidator,
  UserTokenValidation,
} from './cars.dto';

@Controller({ version: '1', path: 'cars' })
export class CarsController {
  constructor(private readonly CarsService: CarsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getCarsList(@Query() query: UserTokenValidation): Promise<object> {
    return this.CarsService.carsList(query.token, query.user);
  }

  @HttpCode(HttpStatus.GONE)
  @Delete('remove')
  deleteCar(@Body() body: DeleteCarValidation): Promise<object> {
    return this.CarsService.deleteCar(body.token, body.userId, body.carId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('add')
  addCar(@Body() body: AddCarValidator): Promise<object> {
    return this.CarsService.addCar(body);
  }

  @HttpCode(HttpStatus.OK)
  @Put('edit')
  editCar(@Body() body: UpdateCarValidator): Promise<object> {
    return this.CarsService.editCar(body);
  }
}
