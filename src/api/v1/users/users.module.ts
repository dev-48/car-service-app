import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from '../../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([user])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
