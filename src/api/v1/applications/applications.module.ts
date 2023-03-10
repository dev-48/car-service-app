import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from '../../../entities/user.entity';
import { token } from '../../../entities/token.entity';
import { car } from '../../../entities/car.entity';
import { application } from '../../../entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([user, token, car, application])],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
