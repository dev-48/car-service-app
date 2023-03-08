import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from '../../../entities/user.entity';
import { token } from '../../../entities/token.entity';
import { car } from '../../../entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([user, token, car])],
  providers: [CarsService],
  controllers: [CarsController],
})
export class CarsModule {}
