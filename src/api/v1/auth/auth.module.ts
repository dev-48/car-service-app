import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { token } from '../../../entities/token.entity';
import { user } from '../../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([user, token])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
